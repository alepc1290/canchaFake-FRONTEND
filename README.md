# ⚽ Canchas5 — Backend API

API REST para el sistema de reservas de canchas de fútbol, construida con **Node.js + Express + MongoDB + JWT**.

---

## 🚀 Cómo correr el proyecto

### 1. Requisitos previos
- Node.js >= 18
- MongoDB corriendo localmente (o una URI de MongoDB Atlas)

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```
Editá `.env`:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/canchas5
JWT_SECRET=un_secreto_muy_largo_y_seguro
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. (Opcional) Cargar datos de ejemplo
```bash
node config/seed.js
# Admin:  admin@canchas5.com / admin123
# User:   juan@example.com   / user1234
```

### 5. Iniciar el servidor
```bash
npm start          # producción
npm run dev        # desarrollo con nodemon
```

Servidor disponible en: `http://localhost:8000`

---

## 📁 Estructura del proyecto

```
backend/
├── config/
│   ├── db.js          → Conexión a MongoDB
│   └── seed.js        → Datos de ejemplo
├── controllers/
│   ├── authController.js
│   ├── canchaController.js
│   ├── productoController.js
│   ├── reservaController.js
│   └── usuarioController.js
├── middleware/
│   ├── auth.js        → protect, adminOnly, selfOrAdmin
│   ├── errorHandler.js
│   └── validate.js
├── models/
│   ├── User.js
│   ├── Cancha.js
│   ├── Producto.js
│   └── Reserva.js
├── routes/
│   ├── authRoutes.js
│   ├── canchaRoutes.js
│   ├── productoRoutes.js
│   ├── reservaRoutes.js
│   └── usuarioRoutes.js
├── app.js
└── server.js
```

---

## 🔌 Endpoints

### Auth
| Método | Ruta             | Auth | Descripción          |
|--------|------------------|------|----------------------|
| POST   | /api/auth/register | ❌  | Registrar usuario    |
| POST   | /api/auth/login    | ❌  | Login → JWT          |
| GET    | /api/auth/me       | ✅  | Perfil del usuario   |

### Canchas
| Método | Ruta                              | Auth  | Descripción           |
|--------|-----------------------------------|-------|-----------------------|
| GET    | /api/canchas                      | ❌    | Listar canchas        |
| GET    | /api/canchas/:id                  | ❌    | Detalle cancha        |
| GET    | /api/canchas/:id/horarios?fecha=  | ❌    | Horarios disponibles  |
| POST   | /api/canchas                      | Admin | Crear cancha          |
| PUT    | /api/canchas/:id                  | Admin | Actualizar cancha     |
| DELETE | /api/canchas/:id                  | Admin | Eliminar cancha       |

### Reservas
| Método | Ruta                            | Auth       | Descripción           |
|--------|---------------------------------|------------|-----------------------|
| GET    | /api/reservas                   | ✅ (admin: todas) | Listar reservas |
| GET    | /api/reservas/usuario/:userId   | ✅ Self/Admin | Mis reservas      |
| GET    | /api/reservas/:id               | ✅         | Detalle reserva       |
| POST   | /api/reservas                   | ✅         | Crear reserva         |
| DELETE | /api/reservas/:id               | ✅ Self/Admin | Cancelar reserva   |

### Productos
| Método | Ruta                  | Auth  | Descripción        |
|--------|-----------------------|-------|--------------------|
| GET    | /api/productos        | ❌    | Listar productos   |
| GET    | /api/productos/:id    | ❌    | Detalle producto   |
| POST   | /api/productos        | Admin | Crear producto     |
| PUT    | /api/productos/:id    | Admin | Actualizar         |
| DELETE | /api/productos/:id    | Admin | Eliminar           |

### Usuarios (Admin)
| Método | Ruta                          | Auth  | Descripción         |
|--------|-------------------------------|-------|---------------------|
| GET    | /api/usuarios                 | Admin | Listar usuarios     |
| GET    | /api/usuarios/:id             | ✅ Self/Admin | Ver usuario  |
| PUT    | /api/usuarios/:id             | ✅ Self/Admin | Actualizar   |
| PATCH  | /api/usuarios/:id/desactivar  | Admin | Desactivar          |
| PATCH  | /api/usuarios/:id/activar     | Admin | Activar             |
| DELETE | /api/usuarios/:id             | Admin | Eliminar            |

---

## 📦 Ejemplos de requests

### Registro
```http
POST /api/auth/register
Content-Type: application/json

{ "nombre": "María García", "email": "maria@mail.com", "password": "secreta123" }
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{ "email": "maria@mail.com", "password": "secreta123" }
```

### Crear reserva
```http
POST /api/reservas
Authorization: Bearer <token>
Content-Type: application/json

{
  "canchaId": "64f...",
  "fecha": "2025-02-10",
  "horaInicio": "19:00",
  "horaFin": "20:00"
}
```

### Crear cancha (admin)
```http
POST /api/canchas
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "nombre": "Cancha Épsilon",
  "tipo": "Fútbol 5",
  "precio": 3800,
  "descripcion": "Nueva cancha con césped de última generación.",
  "imagen": "https://url-de-imagen.com/cancha.jpg"
}
```

---

## 🛡️ Reglas de negocio

- Las contraseñas se hashean con **bcrypt** (salt 12) antes de guardarse.
- El JWT se envía en el header `Authorization: Bearer <token>`.
- **No se puede reservar** una cancha si ya existe una reserva confirmada en el mismo horario (verificación de solapamiento).
- Los usuarios **solo** pueden ver/cancelar sus propias reservas; el admin puede ver todas.
- No se puede desactivar ni eliminar a otro admin.
