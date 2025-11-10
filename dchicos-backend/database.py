# Base de datos en memoria (simulación)
# En producción, usar una base de datos real como PostgreSQL, MongoDB, etc.

class Database:
    def __init__(self):
        self.items = {}
        self.users = {}
        self.current_item_id = 1
        self.current_user_id = 1
    
    def reset(self):
        self.items = {}
        self.users = {}
        self.current_item_id = 1
        self.current_user_id = 1

# Instancia global de la base de datos
db = Database()
