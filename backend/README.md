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

### Estructura de Respuestas

Todos los endpoints siguen una estructura consistente:

#### ✅ Respuesta Exitosa
```json
{
  "success": true,
  "data_key": { /* datos específicos del endpoint */ }
}
```

#### ❌ Respuesta de Error
```json
{
  "success": false,
  "error": "Mensaje descriptivo del error"
}
```

### Códigos de Estado HTTP
- `200 OK` - Operación exitosa
- `400 Bad Request` - Parámetros inválidos o faltantes
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

---

### Endpoints Disponibles

#### GET /api/categories
Obtiene todas las categorías ordenadas alfabéticamente.

**Response (200):**
```json
{
  "success": true,
  "categories": [
    { "id": 1, "name": "Computadoras", "created_at": "2024-01-01T00:00:00.000Z" },
    { "id": 2, "name": "Celulares", "created_at": "2024-01-01T00:00:00.000Z" }
  ]
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to fetch categories"
}
```

---

#### GET /api/brands
Obtiene todas las marcas ordenadas alfabéticamente.

**Response (200):**
```json
{
  "success": true,
  "brands": [
    { "id": 1, "name": "Apple", "created_at": "2024-01-01T00:00:00.000Z" },
    { "id": 2, "name": "Samsung", "created_at": "2024-01-01T00:00:00.000Z" }
  ]
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to fetch brands"
}
```

---

#### GET /api/conditions
Obtiene todas las condiciones de productos.

**Response (200):**
```json
{
  "success": true,
  "conditions": [
    { "id": 1, "name": "Nuevo", "created_at": "2024-01-01T00:00:00.000Z" },
    { "id": 2, "name": "Usado", "created_at": "2024-01-01T00:00:00.000Z" }
  ]
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to fetch conditions"
}
```

---

#### GET /api/products
Obtiene productos con filtros opcionales. Los productos se ordenan por fecha de creación (más recientes primero).

**Query Parameters:**
- `categories` - IDs de categorías separados por comas (ej: `1,3`)
- `brands` - IDs de marcas separados por comas (ej: `2,5`)
- `conditions` - IDs de condiciones separados por comas (ej: `1`)
- `search` - Búsqueda por descripción (insensible a acentos y mayúsculas)

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

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "iPhone 14 Pro Max",
      "description": "Smartphone de última generación",
      "price": 1199.99,
      "image_url": "https://example.com/iphone.jpg",
      "category_id": 3,
      "brand_id": 1,
      "condition_id": 1,
      "stock": 15,
      "category_name": "Celulares",
      "brand_name": "Apple",
      "condition_name": "Nuevo",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to fetch products"
}
```

---

#### GET /api/products/:id
Obtiene un producto específico por su ID.

**Parameters:**
- `id` - ID numérico del producto

**Response (200):**
```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "iPhone 14 Pro Max",
    "description": "Smartphone de última generación",
    "price": 1199.99,
    "image_url": "https://example.com/iphone.jpg",
    "category_id": 3,
    "brand_id": 1,
    "condition_id": 1,
    "stock": 15,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Product not found"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to fetch product"
}
```

---

#### POST /api/payphone/confirm
Confirma el estado de una transacción de Payphone con la pasarela de pagos.

**Request Body:**
```json
{
  "id": 12345,
  "clientTxId": "ORDER_2024_001"
}
```

**Response (200) - Transacción Aprobada:**
```json
{
  "success": true,
  "transaction": {
    "id": 12345,
    "clientTransactionId": "ORDER_2024_001",
    "status": "Approved",
    "statusCode": 3,
    "isApproved": true,
    "amount": 10000,
    "currency": "USD",
    "authorizationCode": "ABC123",
    "reference": "REF_12345",
    "date": "2024-01-01T12:00:00.000Z",
    "customer": {
      "email": "cliente@example.com",
      "phone": "+593999999999",
      "document": "1234567890"
    },
    "card": {
      "type": "Credit",
      "brand": "Visa",
      "lastDigits": "4242"
    }
  }
}
```

**Response (200) - Transacción Cancelada:**
```json
{
  "success": true,
  "transaction": {
    "id": 12345,
    "clientTransactionId": "ORDER_2024_001",
    "status": "Canceled",
    "statusCode": 2,
    "isApproved": false,
    "amount": 10000,
    "currency": "USD",
    "authorizationCode": "",
    "reference": "REF_12345",
    "date": "2024-01-01T12:00:00.000Z",
    "customer": {
      "email": "cliente@example.com",
      "phone": "+593999999999",
      "document": "1234567890"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Missing required fields: id and clientTxId"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Payment gateway not configured"
}
```

---

#### GET /api/payphone/response
Endpoint de redirección después de completar el pago en Payphone. **No debe ser llamado directamente por el frontend.**

Este endpoint:
1. Recibe la redirección desde Payphone con parámetros de transacción
2. Confirma el estado con la API de Payphone
3. Redirige al frontend con los resultados

**Query Parameters (automáticos desde Payphone):**
- `id` - ID de la transacción en Payphone
- `clientTransactionId` - ID de transacción del cliente

**Redirección al Frontend:**
```
http://localhost:5173/payment-result?status=success&transactionId=12345&amount=100.00&authCode=ABC123&reference=REF_12345&clientTxId=ORDER_2024_001
```

**Parámetros de Redirección:**
- `status` - `success`, `cancelled`, o `error`
- `transactionId` - ID de la transacción
- `amount` - Monto procesado (en dólares)
- `authCode` - Código de autorización
- `reference` - Referencia del pago
- `clientTxId` - ID de transacción del cliente
- `message` - (Solo en errores) Mensaje descriptivo del error

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
