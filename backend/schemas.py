from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# ========== User Schemas ==========
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ========== Account Schemas ==========
class AccountBase(BaseModel):
    nickname: str
    api_key: str
    api_secret: str
    zerodha_user_id: Optional[str] = None
    zerodha_password: Optional[str] = None

class AccountCreate(AccountBase):
    pass

class AccountUpdate(BaseModel):
    nickname: Optional[str] = None
    api_key: Optional[str] = None
    api_secret: Optional[str] = None

class AccountResponse(BaseModel):
    id: int
    nickname: str
    api_key: str
    is_active: bool
    last_login: Optional[datetime]
    total_pnl: float = 0.0

    class Config:
        from_attributes = True

# ========== Order Schemas ==========
class OrderPlaceRequest(BaseModel):
    account_ids: list[int] = Field(..., min_items=1)
    index: str = Field(..., pattern="^(NIFTY|BANKNIFTY|SENSEX)$")
    expiry: str
    strike: str
    option_type: str = Field(..., pattern="^(CE|PE)$")
    lots: int = Field(..., ge=1, le=100)
    transaction_type: str = Field(..., pattern="^(BUY|SELL)$")
    product: str = Field(..., pattern="^(MIS|NRML|CNC)$")
    order_type: str = Field(..., pattern="^(MARKET|LIMIT)$")
    price: Optional[float] = None
    amo: bool = False

class OrderResponse(BaseModel):
    id: int
    account_id: int
    tradingsymbol: str
    transaction_type: str
    quantity: int
    product: str
    order_type: str
    status: str
    error_message: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class PlaceOrderResponse(BaseModel):
    success: bool
    message: str
    orders: list[dict]

# ========== Position Schemas ==========
class PositionResponse(BaseModel):
    id: int
    account_id: int
    tradingsymbol: str
    quantity: int
    product: str
    pnl: float
    avg_price: Optional[float]
    last_price: Optional[float]

    class Config:
        from_attributes = True

# ========== Token Schema ==========
class SetTokenRequest(BaseModel):
    account_id: int
    request_token: str

# ========== Common Response Schema ==========
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
