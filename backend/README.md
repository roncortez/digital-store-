# Digital Store Backend

Backend API para la tienda digital con PostgreSQL.

## 🚀 Quick Start

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Copia `.env.example` a `.env` (ya está creado):
```bash
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/digital_store
PORT=3000
NODE_ENV=development
```

### 3. Iniciar PostgreSQL con Docker
```bash
docker-compose up -d
```

Esto iniciará PostgreSQL en el puerto 5432.

### 4. Poblar la Base de Datos
```bash
npm run seed
```

Este comando:
- Crea todas las tablas (categories, brands, conditions, products)
- Inserta datos de ejemplo (22 productos)

### 5. Iniciar el Servidor
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Endpoints Disponibles

#### GET /api/categories
Obtiene todas las categorías.

**Response:**
```json
{
  "success": true,
  "categories": [
    { "id": 1, "name": "Computadoras", "created_at": "..." },
    { "id": 2, "name": "Celulares", "created_at": "..." }
  ]
}
```

#### GET /api/brands
Obtiene todas las marcas.

**Response:**
```json
{
  "success": true,
  "brands": [
    { "id": 1, "name": "Apple", "created_at": "..." },
    { "id": 2, "name": "Samsung", "created_at": "..." }
  ]
}
```

#### GET /api/conditions
Obtiene todas las condiciones.

**Response:**
```json
{
  "success": true,
  "conditions": [
    { "id": 1, "name": "Nuevo", "created_at": "..." },
    { "id": 2, "name": "Usado", "created_at": "..." }
  ]
}
```

#### GET /api/products
Obtiene productos con filtros opcionales.

**Query Parameters:**
- `categories` - IDs de categorías separados por comas (ej: `1,3`)
- `brands` - IDs de marcas separados por comas (ej: `2,5`)
- `conditions` - IDs de condiciones separados por comas (ej: `1`)
- `search` - Búsqueda por nombre (ej: `iphone`)

**Ejemplos:**
```bash
# Todos los productos
GET /api/products

# Productos de categorías 1 y 3
GET /api/products?categories=1,3

# Productos de marca Apple (id: 1)
GET /api/products?brands=1

# Productos nuevos de Apple
GET /api/products?brands=1&conditions=1

# Buscar "iphone"
GET /api/products?search=iphone

# Combinar filtros
GET /api/products?categories=3&brands=1,2&conditions=1&search=pro
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "iPhone 14 Pro Max",
      "description": "...",
      "price": 1199.99,
      "image_url": "...",
      "category_id": 3,
      "brand_id": 1,
      "condition_id": 1,
      "stock": 15,
      "category_name": "Celulares",
      "brand_name": "Apple",
      "condition_name": "Nuevo",
      "created_at": "..."
    }
  ],
  "total": 1
}
```

## 🗄️ Database Schema

```sql
categories
├─ id (SERIAL PRIMARY KEY)
├─ name (VARCHAR)
└─ created_at (TIMESTAMP)

brands
├─ id (SERIAL PRIMARY KEY)
├─ name (VARCHAR)
└─ created_at (TIMESTAMP)

conditions
├─ id (SERIAL PRIMARY KEY)
├─ name (VARCHAR)
└─ created_at (TIMESTAMP)

products
├─ id (SERIAL PRIMARY KEY)
├─ name (VARCHAR)
├─ description (TEXT)
├─ price (DECIMAL)
├─ image_url (VARCHAR)
├─ category_id (FK → categories)
├─ brand_id (FK → brands)
├─ condition_id (FK → conditions)
├─ stock (INTEGER)
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)
```

## 🐳 Docker Commands

```bash
# Iniciar PostgreSQL
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener PostgreSQL
docker-compose down

# Detener y eliminar datos
docker-compose down -v
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor en modo desarrollo

# Producción
npm run build        # Compila TypeScript a JavaScript
npm start            # Inicia el servidor compilado

# Base de datos
npm run seed         # Pobla la base de datos con datos de ejemplo
```

## 📝 Notas

- La base de datos se ejecuta en `localhost:5432`
- Usuario: `postgres`
- Contraseña: `postgres123`
- Base de datos: `digital_store`
- CORS está habilitado para todas las rutas
