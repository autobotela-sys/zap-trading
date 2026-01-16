from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import redis
import json
from kiteconnect import KiteConnect

from config import settings
from database import engine, get_db, Base
from models import User, ZerodhaAccount, Order, Position
from schemas import (
    UserCreate, UserLogin, UserResponse, Token,
    AccountCreate, AccountResponse, OrderPlaceRequest, PlaceOrderResponse,
    PositionResponse, SetTokenRequest, APIResponse
)
from auth import create_access_token, get_current_active_user, get_current_user
from cryptography.fernet import Fernet
import base64

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Multi-account Zerodha Trading Platform"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

# Encryption key for credentials
ENCRYPTION_KEY = base64.urlsafe_b64encode(settings.JWT_SECRET.encode()[:32].ljust(32, b'0'))
cipher_suite = Fernet(ENCRYPTION_KEY)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def broadcast_to_user(self, user_id: int, message: dict):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except:
                    pass

manager = ConnectionManager()

# ========== Utility Functions ==========
def encrypt_data(data: str) -> str:
    return cipher_suite.encrypt(data.encode()).decode()

def decrypt_data(data: str) -> str:
    return cipher_suite.decrypt(data.encode()).decode()

def get_kite_instance(account: ZerodhaAccount) -> KiteConnect:
    kite = KiteConnect(api_key=account.api_key)
    if account.access_token:
        kite.set_access_token(account.access_token)
    return kite

# ========== Root Endpoint ==========
@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

# ========== Authentication Endpoints ==========
@app.post("/api/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    hashed_password = User.get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not user.verify_password(login_data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, user=user)

@app.get("/api/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user

# ========== Account Endpoints ==========
@app.get("/api/accounts", response_model=List[AccountResponse])
async def get_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    accounts = db.query(ZerodhaAccount).filter(
        ZerodhaAccount.user_id == current_user.id
    ).all()

    # Calculate total P&L for each account
    result = []
    for account in accounts:
        total_pnl = 0.0
        if account.access_token:
            try:
                kite = get_kite_instance(account)
                positions = kite.positions()
                if 'net' in positions:
                    total_pnl = sum(pos.get('pnl', 0) for pos in positions['net'])
            except:
                pass

        result.append(AccountResponse(
            id=account.id,
            nickname=account.nickname,
            api_key=account.api_key,
            is_active=account.is_active,
            last_login=account.last_login,
            total_pnl=total_pnl
        ))

    return result

@app.post("/api/accounts", response_model=AccountResponse)
async def create_account(
    account_data: AccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Create new account
    new_account = ZerodhaAccount(
        user_id=current_user.id,
        nickname=account_data.nickname,
        api_key=account_data.api_key,
        api_secret_enc=encrypt_data(account_data.api_secret),
        user_id_enc=encrypt_data(account_data.zerodha_user_id) if account_data.zerodha_user_id else None,
        password_enc=encrypt_data(account_data.zerodha_password) if account_data.zerodha_password else None
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    return AccountResponse(
        id=new_account.id,
        nickname=new_account.nickname,
        api_key=new_account.api_key,
        is_active=new_account.is_active,
        last_login=None,
        total_pnl=0.0
    )

@app.delete("/api/accounts/{account_id}")
async def delete_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    account = db.query(ZerodhaAccount).filter(
        ZerodhaAccount.id == account_id,
        ZerodhaAccount.user_id == current_user.id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    db.delete(account)
    db.commit()
    return {"success": True, "message": "Account deleted"}

# ========== Zerodha OAuth Endpoints ==========
@app.post("/api/accounts/{account_id}/request-token")
async def request_token(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    account = db.query(ZerodhaAccount).filter(
        ZerodhaAccount.id == account_id,
        ZerodhaAccount.user_id == current_user.id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    kite = KiteConnect(api_key=account.api_key)
    login_url = kite.login_url()

    return {"login_url": login_url}

@app.post("/api/accounts/set-token", response_model=APIResponse)
async def set_token(
    token_data: SetTokenRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    account = db.query(ZerodhaAccount).filter(
        ZerodhaAccount.id == token_data.account_id,
        ZerodhaAccount.user_id == current_user.id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    try:
        kite = KiteConnect(api_key=account.api_key)
        # Decrypt API secret
        api_secret = decrypt_data(account.api_secret_enc)
        data = kite.generate_session(token_data.request_token, api_secret=api_secret)

        # Store access token
        account.access_token = encrypt_data(data["access_token"])
        account.request_token = token_data.request_token
        account.public_token = data.get("public_token")
        account.last_login = datetime.now()

        db.commit()

        return APIResponse(success=True, message="Access token set successfully", data={"access_token": data["access_token"]})

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to set access token: {str(e)}")

# ========== Order Endpoints ==========
@app.post("/api/orders/place", response_model=PlaceOrderResponse)
async def place_order(
    order_data: OrderPlaceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    results = []
    INDEX_LOT_SIZES = {"NIFTY": 65, "BANKNIFTY": 35, "SENSEX": 20}

    # Get accounts
    accounts = db.query(ZerodhaAccount).filter(
        ZerodhaAccount.id.in_(order_data.account_ids),
        ZerodhaAccount.user_id == current_user.id
    ).all()

    if not accounts:
        raise HTTPException(status_code=404, detail="No valid accounts found")

    # Calculate quantity
    lot_size = INDEX_LOT_SIZES.get(order_data.index, 1)
    quantity = order_data.lots * lot_size

    # Generate trading symbol
    # You'll need to implement instrument lookup or use the existing helper
    tradingsymbol = f"{order_data.index}{order_data.expiry.replace('-', '')}{order_data.strike}{order_data.option_type}"

    for account in accounts:
        try:
            if not account.access_token:
                results.append({
                    "account": account.nickname,
                    "success": False,
                    "message": "Account not logged in"
                })
                continue

            kite = get_kite_instance(account)

            # Decrypt access token
            access_token = decrypt_data(account.access_token)
            kite.set_access_token(access_token)

            # Place order
            exchange = "BFO" if order_data.index == "SENSEX" else "NFO"
            variety = kite.VARIETY_AMO if order_data.amo else kite.VARIETY_REGULAR

            order_params = {
                "exchange": exchange,
                "tradingsymbol": tradingsymbol,
                "transaction_type": order_data.transaction_type,
                "quantity": quantity,
                "product": order_data.product,
                "order_type": order_data.order_type,
                "validity": kite.VALIDITY_DAY
            }

            if order_data.order_type == "LIMIT" and order_data.price:
                order_params["price"] = order_data.price

            order_id = kite.place_order(variety=variety, **order_params)

            # Save order to database
            new_order = Order(
                account_id=account.id,
                order_id=str(order_id),
                tradingsymbol=tradingsymbol,
                exchange=exchange,
                transaction_type=order_data.transaction_type,
                quantity=quantity,
                product=order_data.product,
                order_type=order_data.order_type,
                price=order_data.price,
                status="pending",
                variety="amo" if order_data.amo else "regular",
                kite_order_id=str(order_id)
            )
            db.add(new_order)
            db.commit()

            results.append({
                "account": account.nickname,
                "success": True,
                "order_id": str(order_id),
                "message": "Order placed successfully"
            })

        except Exception as e:
            results.append({
                "account": account.nickname,
                "success": False,
                "message": str(e)
            })

    success_count = sum(1 for r in results if r.get("success"))
    total_count = len(results)

    return PlaceOrderResponse(
        success=success_count > 0,
        message=f"Orders placed: {success_count}/{total_count}",
        orders=results
    )

# ========== Position Endpoints ==========
@app.get("/api/positions", response_model=List[PositionResponse])
async def get_positions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get user's accounts
    accounts = db.query(ZerodhaAccount).filter(
        ZerodhaAccount.user_id == current_user.id,
        ZerodhaAccount.access_token.isnot(None)
    ).all()

    all_positions = []

    for account in accounts:
        try:
            kite = get_kite_instance(account)
            access_token = decrypt_data(account.access_token)
            kite.set_access_token(access_token)

            positions = kite.positions()
            if 'net' in positions:
                for pos in positions['net']:
                    if abs(pos.get('quantity', 0)) > 0:
                        all_positions.append({
                            "account_id": account.id,
                            "tradingsymbol": pos.get('tradingsymbol'),
                            "exchange": pos.get('exchange'),
                            "quantity": pos.get('quantity'),
                            "product": pos.get('product'),
                            "pnl": pos.get('pnl', 0),
                            "avg_price": pos.get('average_price'),
                            "last_price": pos.get('last_price')
                        })
        except Exception as e:
            pass  # Skip failed accounts

    return all_positions

# ========== WebSocket for Real-time Updates ==========
@app.websocket("/ws/positions")
async def positions_websocket(websocket: WebSocket, token: str):
    # Verify token
    payload = verify_token(token)
    if not payload:
        await websocket.close(code=1008)
        return

    user_id = payload.get("sub")
    await manager.connect(websocket, user_id)

    try:
        while True:
            # Get latest positions
            # This is a simplified version - you'd want to optimize this
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
