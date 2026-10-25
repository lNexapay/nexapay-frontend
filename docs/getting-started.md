# Primeros pasos (frontend)

Guía para dejar el frontend corriendo en tu máquina desde cero.

## 1. Requisitos

| Herramienta | Versión | Verificar |
|-------------|---------|-----------|
| Node.js | 20 o superior | `node -v` |
| npm | incluido con Node | `npm -v` |
| Git | cualquiera reciente | `git --version` |

## 2. Clonar e instalar

```bash
git clone https://github.com/lNexapay/nexapay-frontend.git
cd nexapay-frontend
npm install
```

## 3. Variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` si el backend corre en otra URL o puerto:

```
VITE_API_URL=http://localhost:3000
```

> Usa siempre `.env.local` para valores locales. Y recuerda: lo que empieza con `VITE_` termina dentro del código que descarga el navegador, así que **no pongas secretos**.

## 4. Levantar el backend (opcional)

Si necesitas datos reales, clona y levanta [`nexapay-backend`](https://github.com/lNexapay/nexapay-backend) siguiendo su guía de primeros pasos. Por defecto escucha en `http://localhost:3000`.

> Si el navegador muestra un error de **CORS**, avisa al equipo de backend: el servidor debe permitir el origen del frontend (`http://localhost:5173` en desarrollo).

## 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`). Los cambios se reflejan al instante.

## 6. Verificar tu trabajo antes de un PR

```bash
npm run lint     # revisa el estilo con Oxlint
npm run build    # revisa los tipos y genera la versión de producción
```

El CI ejecuta exactamente estos dos comandos en cada PR.

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| `command not found: vite` | Faltan dependencias | `npm install` |
| El puerto 5173 está ocupado | Otro proceso lo usa | Vite elige otro puerto automáticamente; revisa la terminal |
| La app no llama al backend | `VITE_API_URL` mal configurada | Revisa `.env.local` y **reinicia** `npm run dev` (Vite lee el entorno al arrancar) |
| Error de CORS en la consola | El backend no permite este origen | Avisar al equipo de backend |
| `tsc -b` falla en `build` | Errores de tipos | Corrige los errores que indica la terminal |

## Siguiente paso

Lee el [flujo de trabajo con Git](git-workflow.md) y [CONTRIBUTING.md](../CONTRIBUTING.md) antes de tu primer PR.
