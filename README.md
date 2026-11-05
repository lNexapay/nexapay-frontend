# NexaPay Frontend

Interfaz web de **NexaPay**, una billetera digital multimoneda (USD, EUR, COP, ARS) de simulación, con fondos ficticios. Este repositorio contiene el **frontend**; la API está en [`nexapay-backend`](https://github.com/lNexapay/nexapay-backend).

## Qué incluye hoy

| Pantalla | Ruta | Acceso | Detalle |
|----------|------|--------|---------|
| **Landing** | `/` | Pública | Presentación de NexaPay y accesos a login y registro |
| **Login** | `/login` | Pública | Correo y contraseña, o **inicio de sesión con Google**; opción de recordar la sesión |
| **Registro** | `/registro` | Pública | Crea la cuenta (y su billetera) en el backend |
| **Inicio** | `/inicio` | Con sesión | Balance total, saldo por moneda, actividad reciente, resumen de espacios y tarjeta del asistente de IA. Desde aquí se abren las operaciones: ingreso, conversión y transferencia |
| **Historial** | `/historial` | Con sesión | Todas las operaciones, con filtros |
| **Monedas** | `/monedas` | Con sesión | Saldos y tasas de cambio, más una calculadora de equivalentes (sin comisión: no es tu saldo) |
| **Mis espacios** | `/espacios` | Con sesión | Espacios de ahorro: crear, aportar y retirar, con meta opcional |
| **Perfil** | `/perfil` | Con sesión | Datos del usuario y número de cuenta (para que otros te transfieran) |
| **404** | cualquier otra | Pública | Página no encontrada |

Las pantallas con sesión usan datos reales del backend. Además hay un **chat flotante con el asistente NEXAPAY AI**, que responde preguntas sobre la cuenta del usuario.

## Stack

- React 19 + TypeScript
- Vite
- React Router 7 (`react-router-dom`)
- CSS Modules
- `@react-oauth/google` (login con Google)
- `lucide-react` (íconos)
- Oxlint

## Requisitos

- Node.js 22 (es la versión que usa el CI)
- Git
- El [backend](https://github.com/lNexapay/nexapay-backend) corriendo en local para iniciar sesión y operar

## Inicio rápido

```bash
# 1. Clonar e instalar
git clone https://github.com/lNexapay/nexapay-frontend.git
cd nexapay-frontend
npm install

# 2. Variables de entorno
cp .env.example .env.local
# Edita .env.local (ver tabla más abajo)

# 3. Iniciar
npm run dev
```

Vite muestra la URL en la terminal (normalmente `http://localhost:5173`).

> El backend solo acepta peticiones desde `http://localhost:5173` (CORS). Si Vite usa otro puerto, las peticiones fallarán con un error de CORS: libera el 5173 o pide ajustar el backend.

## Conectar con el backend

1. Levanta el backend siguiendo su [README](https://github.com/lNexapay/nexapay-backend#readme) (queda en `http://localhost:3000`).
2. Verifica que `.env.local` tenga:

```
VITE_API_URL=http://localhost:3000
```

3. Reinicia `npm run dev` si cambiaste el `.env.local` (Vite lo lee solo al arrancar).

Las peticiones usan `credentials: 'include'` porque el backend guarda el refresh token en una cookie `HttpOnly`. El token de acceso se renueva automáticamente cuando vence (`src/services/api.ts`).

### En producción

En el build de producción el frontend llama a rutas relativas (`/api/...`) y **Vercel las redirige al backend en Railway** mediante `vercel.json`. Así el navegador solo habla con un origen y la cookie de sesión funciona sin problemas de CORS. `VITE_API_URL` solo se usa en desarrollo; si cambia la URL del backend desplegado, hay que actualizar el destino en `vercel.json`.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del backend (solo desarrollo) | `http://localhost:3000` |
| `VITE_GOOGLE_CLIENT_ID` | ID de cliente de Google para el login. Debe ser el mismo que usa el backend en `GOOGLE_CLIENT_ID`. Si está vacío, el botón de Google no se muestra | `1234-abc.apps.googleusercontent.com` |

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
├── pages/              # Una carpeta por pantalla: Landing, Login, Registro, Inicio,
│                       # Historial, Monedas, Espacios, Perfil, NoEncontrada
├── components/         # Componentes reutilizables: layouts, Sidebar, MenuInferior, Modal,
│                       # Operaciones (ingreso, conversión, transferencia), Chat, BotonGoogle...
├── context/            # UsuarioContext (sesión), OperacionesContext (modal de operaciones)
│                       # y ChatContext (chat con la IA)
├── services/           # Llamadas al backend: api (peticiones y renovación de token), auth,
│                       # billetera, espacios e ia
├── hooks/              # Hooks compartidos (por ejemplo, cerrar sesión)
├── data/               # Nombres, símbolos y formato de las monedas
├── assets/             # Imágenes
└── index.css           # Estilos globales
```

Cada componente y página lleva su propio archivo `.module.css`. La sesión se guarda en `localStorage` (si el usuario elige recordarla) o en `sessionStorage`, y las rutas privadas se protegen con `RutaProtegida`.

## Cómo trabajamos

1. Crea una rama desde `main`: `feat/...`, `fix/...`, `docs/...`.
2. Commits y título del PR con formato [Conventional Commits](https://www.conventionalcommits.org/): `feat: ...`, `fix: ...`, `docs: ...`. El CI rechaza los títulos que no lo cumplan.
3. Abre un Pull Request hacia `main` y pide revisión.
4. Antes de abrirlo, verifica en local:

```bash
npm run lint
npm run build
```

Si el cambio es visual, adjunta una captura en el PR. No subas `.env` ni datos reales. Más detalle en [CONTRIBUTING.md](CONTRIBUTING.md) y en la carpeta [`docs/`](docs/README.md).

## Pendientes conocidos

- El proyecto aún no tiene pruebas automáticas: el CI solo ejecuta lint y build.
- La URL del backend desplegado está escrita a mano en `vercel.json`.
- Definir la licencia.
