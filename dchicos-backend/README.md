# API REST - Python FastAPI

API REST completa con operaciones CRUD para gestionar Items y Users.

## Características

- ✅ **CRUD completo** para Items y Users
- ✅ **Validación de datos** con Pydantic
- ✅ **Documentación automática** con Swagger UI y ReDoc
- ✅ **Búsqueda** de items y usuarios
- ✅ **Manejo de errores** profesional
- ✅ **Paginación** en listados

## Tecnologías

- **FastAPI**: Framework web moderno y rápido
- **Pydantic**: Validación de datos
- **Uvicorn**: Servidor ASGI

## Instalación

### 1. Clonar el repositorio o usar el código

### 2. Activate and Deactivate virtual environment

```bash
source venv/bin/activate
deactivate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

## Ejecución

### Modo desarrollo

```bash
uvicorn main:app --reload
```

### Modo producción

```bash
python main.py
```

La API estará disponible en: `http://localhost:8000`

## Documentación

Una vez que la aplicación esté corriendo, puedes acceder a:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Endpoints

### General

- `GET /` - Información de la API
- `GET /health` - Estado de salud de la API

### Items (CRUD)

- `POST /items` - Crear un nuevo item
- `GET /items` - Obtener todos los items (con paginación)
- `GET /items/{item_id}` - Obtener un item específico
- `PUT /items/{item_id}` - Actualizar un item
- `DELETE /items/{item_id}` - Eliminar un item
- `GET /items/search/{keyword}` - Buscar items por palabra clave

### Users (CRUD)

- `POST /users` - Crear un nuevo usuario
- `GET /users` - Obtener todos los usuarios (con paginación)
- `GET /users/{user_id}` - Obtener un usuario específico
- `PUT /users/{user_id}` - Actualizar un usuario
- `DELETE /users/{user_id}` - Eliminar un usuario
- `GET /users/search/{username}` - Buscar usuarios por nombre

## Ejemplos de uso

### Crear un Item

```bash
curl -X POST "http://localhost:8000/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Laptop de alta gama",
    "price": 1299.99,
    "is_available": true
  }'
```

### Obtener todos los Items

```bash
curl -X GET "http://localhost:8000/items"
```

### Actualizar un Item

```bash
curl -X PUT "http://localhost:8000/items/1" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1199.99
  }'
```

### Eliminar un Item

```bash
curl -X DELETE "http://localhost:8000/items/1"
```

### Crear un Usuario

```bash
curl -X POST "http://localhost:8000/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juanperez",
    "email": "juan@example.com",
    "full_name": "Juan Pérez",
    "password": "secreto123"
  }'
```

### Buscar Items

```bash
curl -X GET "http://localhost:8000/items/search/laptop"
```

## Modelos de Datos

### Item

```json
{
  "id": 1,
  "name": "Laptop",
  "description": "Laptop de alta gama",
  "price": 1299.99,
  "is_available": true,
  "created_at": "2025-11-10T12:00:00"
}
```

### User

```json
{
  "id": 1,
  "username": "juanperez",
  "email": "juan@example.com",
  "full_name": "Juan Pérez",
  "is_active": true,
  "created_at": "2025-11-10T12:00:00"
}
```

## Base de Datos

Actualmente usa una base de datos en memoria (diccionario Python). Los datos se pierden al reiniciar la aplicación.

Para producción, se recomienda integrar una base de datos real:
- **PostgreSQL** con SQLAlchemy
- **MongoDB** con Motor
- **MySQL** con SQLAlchemy

## Estructura del Proyecto

```
.
├── main.py           # Archivo principal con los endpoints
├── models.py         # Modelos Pydantic para validación
├── database.py       # Simulación de base de datos
├── requirements.txt  # Dependencias del proyecto
└── README.md        # Documentación
```

## Próximos Pasos

- [ ] Integrar base de datos real (PostgreSQL/MongoDB)
- [ ] Agregar autenticación JWT
- [ ] Implementar tests unitarios
- [ ] Agregar caché con Redis
- [ ] Dockerizar la aplicación
- [ ] Agregar más entidades (productos, órdenes, etc.)

## Licencia

MIT
