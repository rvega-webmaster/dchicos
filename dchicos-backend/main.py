from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List
from datetime import datetime

from models import (
    Item, ItemCreate, ItemUpdate,
    User, UserCreate, UserUpdate,
    MessageResponse
)
from database import db

app = FastAPI(
    title="API REST - CRUD Operations",
    description="API completa con operaciones CRUD para Items y Users",
    version="1.0.0"
)


# ==================== ENDPOINTS GENERALES ====================

@app.get("/", tags=["General"])
async def root():
    """Endpoint raíz que muestra información de la API"""
    return {
        "message": "Bienvenido a la API REST",
        "version": "1.0.0",
        "endpoints": {
            "items": "/items",
            "users": "/users",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }


@app.get("/health", tags=["General"])
async def health_check():
    """Endpoint para verificar el estado de la API"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


# ==================== CRUD ITEMS ====================

@app.post("/items", response_model=Item, status_code=status.HTTP_201_CREATED, tags=["Items"])
async def create_item(item: ItemCreate):
    """
    Crear un nuevo item
    
    - **name**: Nombre del item (requerido)
    - **description**: Descripción del item (opcional)
    - **price**: Precio del item (requerido, debe ser mayor a 0)
    - **is_available**: Disponibilidad del item (por defecto True)
    """
    item_id = db.current_item_id
    new_item = {
        "id": item_id,
        "name": item.name,
        "description": item.description,
        "price": item.price,
        "is_available": item.is_available,
        "created_at": datetime.now().isoformat()
    }
    db.items[item_id] = new_item
    db.current_item_id += 1
    return new_item


@app.get("/items", response_model=List[Item], tags=["Items"])
async def get_items(skip: int = 0, limit: int = 100):
    """
    Obtener todos los items
    
    - **skip**: Número de items a saltar (paginación)
    - **limit**: Número máximo de items a retornar
    """
    items = list(db.items.values())
    return items[skip : skip + limit]


@app.get("/items/{item_id}", response_model=Item, tags=["Items"])
async def get_item(item_id: int):
    """
    Obtener un item específico por ID
    
    - **item_id**: ID del item a buscar
    """
    if item_id not in db.items:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item con ID {item_id} no encontrado"
        )
    return db.items[item_id]


@app.put("/items/{item_id}", response_model=Item, tags=["Items"])
async def update_item(item_id: int, item: ItemUpdate):
    """
    Actualizar un item existente
    
    - **item_id**: ID del item a actualizar
    - Todos los campos son opcionales
    """
    if item_id not in db.items:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item con ID {item_id} no encontrado"
        )
    
    stored_item = db.items[item_id]
    update_data = item.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        stored_item[field] = value
    
    db.items[item_id] = stored_item
    return stored_item


@app.delete("/items/{item_id}", response_model=MessageResponse, tags=["Items"])
async def delete_item(item_id: int):
    """
    Eliminar un item
    
    - **item_id**: ID del item a eliminar
    """
    if item_id not in db.items:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item con ID {item_id} no encontrado"
        )
    
    deleted_item = db.items.pop(item_id)
    return MessageResponse(
        message="Item eliminado exitosamente",
        detail=f"Item '{deleted_item['name']}' con ID {item_id} fue eliminado"
    )


# ==================== CRUD USERS ====================

@app.post("/users", response_model=User, status_code=status.HTTP_201_CREATED, tags=["Users"])
async def create_user(user: UserCreate):
    """
    Crear un nuevo usuario
    
    - **username**: Nombre de usuario (requerido, mínimo 3 caracteres)
    - **email**: Email del usuario (requerido, debe ser válido)
    - **full_name**: Nombre completo (opcional)
    - **password**: Contraseña (requerido, mínimo 6 caracteres)
    """
    # Verificar si el username o email ya existen
    for existing_user in db.users.values():
        if existing_user["username"] == user.username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El nombre de usuario ya está en uso"
            )
        if existing_user["email"] == user.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
    
    user_id = db.current_user_id
    new_user = {
        "id": user_id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "is_active": True,
        "created_at": datetime.now().isoformat()
    }
    db.users[user_id] = new_user
    db.current_user_id += 1
    return new_user


@app.get("/users", response_model=List[User], tags=["Users"])
async def get_users(skip: int = 0, limit: int = 100):
    """
    Obtener todos los usuarios
    
    - **skip**: Número de usuarios a saltar (paginación)
    - **limit**: Número máximo de usuarios a retornar
    """
    users = list(db.users.values())
    return users[skip : skip + limit]


@app.get("/users/{user_id}", response_model=User, tags=["Users"])
async def get_user(user_id: int):
    """
    Obtener un usuario específico por ID
    
    - **user_id**: ID del usuario a buscar
    """
    if user_id not in db.users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {user_id} no encontrado"
        )
    return db.users[user_id]


@app.put("/users/{user_id}", response_model=User, tags=["Users"])
async def update_user(user_id: int, user: UserUpdate):
    """
    Actualizar un usuario existente
    
    - **user_id**: ID del usuario a actualizar
    - Todos los campos son opcionales
    """
    if user_id not in db.users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {user_id} no encontrado"
        )
    
    stored_user = db.users[user_id]
    update_data = user.model_dump(exclude_unset=True)
    
    # Verificar username y email únicos si se actualizan
    if "username" in update_data:
        for uid, existing_user in db.users.items():
            if uid != user_id and existing_user["username"] == update_data["username"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El nombre de usuario ya está en uso"
                )
    
    if "email" in update_data:
        for uid, existing_user in db.users.items():
            if uid != user_id and existing_user["email"] == update_data["email"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El email ya está registrado"
                )
    
    for field, value in update_data.items():
        if field != "password":  # No guardamos la contraseña en este ejemplo
            stored_user[field] = value
    
    db.users[user_id] = stored_user
    return stored_user


@app.delete("/users/{user_id}", response_model=MessageResponse, tags=["Users"])
async def delete_user(user_id: int):
    """
    Eliminar un usuario
    
    - **user_id**: ID del usuario a eliminar
    """
    if user_id not in db.users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {user_id} no encontrado"
        )
    
    deleted_user = db.users.pop(user_id)
    return MessageResponse(
        message="Usuario eliminado exitosamente",
        detail=f"Usuario '{deleted_user['username']}' con ID {user_id} fue eliminado"
    )


# ==================== ENDPOINTS ADICIONALES ====================

@app.get("/items/search/{keyword}", response_model=List[Item], tags=["Items"])
async def search_items(keyword: str):
    """
    Buscar items por palabra clave en el nombre o descripción
    
    - **keyword**: Palabra clave a buscar
    """
    results = []
    keyword_lower = keyword.lower()
    for item in db.items.values():
        if (keyword_lower in item["name"].lower() or 
            (item["description"] and keyword_lower in item["description"].lower())):
            results.append(item)
    return results


@app.get("/users/search/{username}", response_model=List[User], tags=["Users"])
async def search_users(username: str):
    """
    Buscar usuarios por nombre de usuario
    
    - **username**: Nombre de usuario a buscar (búsqueda parcial)
    """
    results = []
    username_lower = username.lower()
    for user in db.users.values():
        if username_lower in user["username"].lower():
            results.append(user)
    return results


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
