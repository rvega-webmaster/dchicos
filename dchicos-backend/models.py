from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# Modelos para Items
class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Nombre del item")
    description: Optional[str] = Field(None, max_length=500, description="Descripción del item")
    price: float = Field(..., gt=0, description="Precio del item")
    is_available: bool = Field(True, description="Disponibilidad del item")


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: Optional[float] = Field(None, gt=0)
    is_available: Optional[bool] = None


class Item(ItemBase):
    id: int
    created_at: str

    class Config:
        from_attributes = True


# Modelos para Users
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Nombre de usuario")
    email: EmailStr = Field(..., description="Email del usuario")
    full_name: Optional[str] = Field(None, max_length=100, description="Nombre completo")


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Contraseña del usuario")


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    password: Optional[str] = Field(None, min_length=6)


class User(UserBase):
    id: int
    created_at: str
    is_active: bool

    class Config:
        from_attributes = True


# Modelos de respuesta
class MessageResponse(BaseModel):
    message: str
    detail: Optional[str] = None
