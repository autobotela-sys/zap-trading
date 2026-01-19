from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    accounts = relationship("ZerodhaAccount", back_populates="user", cascade="all, delete-orphan")

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

class ZerodhaAccount(Base):
    __tablename__ = "zerodha_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    nickname = Column(String, nullable=False)
    api_key = Column(String, nullable=False)
    api_secret_enc = Column(String, nullable=False)  # Encrypted
    zerodha_user_id_enc = Column(String)  # Zerodha user ID (encrypted)
    zerodha_password_enc = Column(String)  # Zerodha password (encrypted)
    request_token = Column(String)
    access_token = Column(String)  # Encrypted
    public_token = Column(String)
    last_login = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="accounts")
    orders = relationship("Order", back_populates="account", cascade="all, delete-orphan")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("zerodha_accounts.id"), nullable=False)
    order_id = Column(String)  # Zerodha order ID
    tradingsymbol = Column(String, nullable=False)
    exchange = Column(String, nullable=False)
    transaction_type = Column(String, nullable=False)  # BUY/SELL
    quantity = Column(Integer, nullable=False)
    product = Column(String, nullable=False)  # MIS/NRML/CNC
    order_type = Column(String, nullable=False)  # MARKET/LIMIT
    price = Column(Float)
    status = Column(String, nullable=False)  # pending, completed, rejected, cancelled
    variety = Column(String)  # regular/amo/bo/co/oco
    kite_order_id = Column(String)
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    account = relationship("ZerodhaAccount", back_populates="orders")

class Position(Base):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("zerodha_accounts.id"), nullable=False)
    tradingsymbol = Column(String, nullable=False)
    exchange = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    product = Column(String, nullable=False)
    pnl = Column(Float, default=0.0)
    avg_price = Column(Float)
    last_price = Column(Float)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
