# Arquitectura (frontend)

Describe cómo está organizado el frontend **hoy** y hacia dónde conviene llevarlo. Si el equipo acuerda algo distinto, regístralo en un [ADR](adr/README.md) y actualiza este archivo.

## Visión general

```
┌─────────────────────────────┐   HTTP/JSON   ┌──────────────────────┐
│  Navegador                  │ ────────────▶ │  Backend (Express)   │
│  React 19 + React Router    │ ◀──────────── │  nexapay-backend     │
│  (empaquetado con Vite)     │  + cookies    └──────────────────────┘
└─────────────────────────────┘
```

- Es una **SPA** (aplicación de una sola página): Vite empaqueta el código y React Router maneja la navegación en el cliente.
- Toda la información real viene del backend por HTTP con JSON. El frontend no accede a la base de datos.
- Las peticiones que usan sesión llevan `credentials: 'include'`, porque el backend guarda el refresh token en una cookie `HttpOnly`.

## Estado actual

| Elemento | Detalle |
|----------|---------|
| Punto de entrada | `index.html` → `src/main.tsx` |
| UI | React 19 + CSS Modules (un `.module.css` por componente o página) |
| Rutas | `/` redirige a `/login`; `/login`, `/registro`, `/inicio` (en `src/App.tsx`) |
| Estado de sesión | `UsuarioContext` (nombre y email), guardado en `localStorage` o `sessionStorage` según "recordar sesión" |
| API | `src/services/auth.ts` (solo el registro está conectado) |
| Datos | Saldos y monedas **simulados** en `src/data/monedas.ts` |
| Calidad | Oxlint (`npm run lint`) y `tsc -b` dentro de `npm run build` |

## Estructura actual de `src/`

```
src/
├── main.tsx              # Punto de entrada: monta React
├── App.tsx               # Rutas y proveedor de usuario
├── index.css             # Estilos globales
├── pages/                # Una carpeta por pantalla
│   ├── Login/            # Login.tsx, PanelVisual.tsx
│   ├── Registro/         # Registro.tsx
│   └── Inicio/           # Inicio.tsx (dashboard), Encabezado.tsx
├── components/           # Componentes reutilizables
│   ├── Input/
│   ├── Logo/
│   └── Sidebar/
├── context/              # UsuarioContext.tsx
├── services/             # Llamadas al backend (auth.ts)
├── data/                 # Datos simulados (monedas.ts), temporal
└── assets/               # Imágenes
```

Regla práctica: lo que usa **una sola** pantalla vive junto a ella en `pages/<Pantalla>/`; cuando lo usan dos o más, súbelo a `components/`, `hooks/` o `utils/`.

Carpetas que se crearán cuando hagan falta: `hooks/` (hooks reutilizables), `types/` (tipos compartidos del contrato con la API) y `utils/` (funciones puras, como formatear montos, que hoy viven en `data/monedas.ts`).

## Principios

1. **Componentes pequeños y enfocados.** Si uno supera ~150 líneas, probablemente haga demasiado.
2. **Separar presentación de datos.** Los componentes reciben props; las llamadas a la API van en `services/`.
3. **Un único cliente HTTP.** Hoy `auth.ts` lee `VITE_API_URL` por su cuenta; al sumar más servicios conviene extraer un cliente común (URL base, `credentials`, errores).
4. **Tipos alineados con el contrato del backend.** Ver [AUTH_API](https://github.com/lNexapay/nexapay-backend/blob/main/docs/AUTH_API.md) y [api.md](https://github.com/lNexapay/nexapay-backend/blob/main/docs/api.md).
5. **Estados de interfaz explícitos:** cargando, error, vacío y con datos.
6. **Accesibilidad básica:** etiquetas en formularios, texto alternativo en imágenes, navegación con teclado.

## Pendientes por decidir (candidatos a ADR)

- Conectar el login y la renovación de sesión (`/api/auth/login`, `/refresh`) y proteger `/inicio`.
- Dónde guardar el access token (memoria vs. almacenamiento del navegador) y cómo renovarlo.
- Reemplazar los datos simulados por los de la API (monedas, tasas, saldos).
- Manejo de errores del backend, que hoy responde con `{ message }` (auth) y `{ error }` (wallet).
- Estrategia de estilos a largo plazo (CSS Modules hoy) y sistema de diseño.
- Pruebas (unitarias y end-to-end) y despliegue en Vercel.
