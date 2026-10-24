# NexaPay Frontend

Interfaz web de **NexaPay**, una billetera digital multimoneda (USD, EUR, COP, ARS). Este repositorio contiene el **frontend**; la API está en [`nexapay-backend`](https://github.com/lNexapay/nexapay-backend).

## Qué incluye hoy

| Pantalla | Ruta | Estado |
|----------|------|--------|
| **Login** | `/login` | Interfaz completa (formulario, mostrar/ocultar contraseña, recordar sesión, acceso demo). **Aún no está conectado al backend** |
| **Registro** | `/registro` | Conectado al backend (`POST /api/auth/register`); al terminar vuelve al login con un mensaje de cuenta creada |
| **Inicio (dashboard)** | `/inicio` | Sidebar, encabezado con saludo y usuario. Los saldos y monedas son **datos simulados** (`src/data/monedas.ts`) |

La ruta `/` redirige a `/login`.

## Stack

- React 19 + TypeScript
- Vite
- React Router 7 (`react-router-dom`)
- CSS Modules
- `lucide-react` (íconos)
- Oxlint

## Requisitos

- Node.js 20 o superior
- Git
- El [backend](https://github.com/lNexapay/nexapay-backend) corriendo en local para registrarse

## Inicio rápido

```bash
# 1. Clonar e instalar
git clone https://github.com/lNexapay/nexapay-frontend.git
cd nexapay-frontend
npm install

# 2. Variables de entorno
cp .env.example .env.local

# 3. Iniciar
npm run dev
```

Vite muestra la URL en la terminal (normalmente `http://localhost:5173`).

> El backend solo acepta peticiones desde `http://localhost:5173` (CORS). Si Vite usa otro puerto, el registro fallará con un error de CORS: libera el 5173 o pide ajustar el backend.

## Conectar con el backend

1. Levanta el backend siguiendo su [README](https://github.com/lNexapay/nexapay-backend#readme) (queda en `http://localhost:3000`).
2. Verifica que `.env.local` tenga:

```
VITE_API_URL=http://localhost:3000
```

3. Reinicia `npm run dev` si cambiaste el `.env` (Vite lo lee solo al arrancar).

Las peticiones usan `credentials: 'include'` porque el backend guarda el refresh token en una cookie `HttpOnly`.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del backend | `http://localhost:3000` |

Todo lo que empieza con `VITE_` es **público** (viaja al navegador). Nunca pongas secretos aquí. Usa `.env.local` para tus valores; no se sube a Git.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Revisa tipos (`tsc -b`) y genera `dist/` |
| `npm run lint` | Ejecuta Oxlint |
| `npm run preview` | Sirve localmente el resultado de `build` |

## Estructura

```
src/
├── main.tsx            # Punto de entrada
├── App.tsx             # Rutas de la aplicación
├── pages/              # Una carpeta por pantalla: Login, Registro, Inicio
├── components/         # Componentes reutilizables: Input, Logo, Sidebar
├── context/            # UsuarioContext: usuario en sesión (localStorage/sessionStorage)
├── services/           # Llamadas al backend (auth.ts)
├── data/               # Datos simulados de monedas (temporal)
├── assets/             # Imágenes
└── index.css           # Estilos globales
```

Cada componente y página lleva su propio archivo `.module.css`.

## Cómo trabajamos

1. Crea una rama desde `main`: `feat/...`, `fix/...`, `docs/...`.
2. Commits claros, por ejemplo `feat(login): conecta el inicio de sesión al backend`.
3. Abre un Pull Request hacia `main` y pide revisión.
4. Antes de abrirlo, verifica en local:

```bash
npm run lint
npm run build
```

Si el cambio es visual, adjunta una captura en el PR. No subas `.env` ni datos reales.

## Pendientes conocidos

- Conectar el login al backend (`/api/auth/login`) y manejar renovación de sesión.
- Reemplazar los datos simulados del dashboard por los de la API (monedas, tasas, saldos).
- Proteger la ruta `/inicio` para usuarios sin sesión.
- Pantallas de wallet: conversión y movimientos.
- Definir la licencia.
