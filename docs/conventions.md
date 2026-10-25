# Convenciones de código (frontend)

Reglas simples para que el código se vea como si lo hubiera escrito una sola persona.

## TypeScript

- Los `tsconfig` del repo mandan. Evita `any`; si es inevitable, deja un comentario con el motivo.
- Tipa las **props** de cada componente con una `interface` o `type`.
- Usa `const` por defecto; `let` solo si se reasigna. Nunca `var`.
- Prefiere `async/await` sobre cadenas de `.then()`.

## Nombres

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes (archivo y nombre) | `PascalCase` | `UserCard.tsx` |
| Hooks | `camelCase` con prefijo `use` | `useAuth.ts` |
| Funciones y variables | `camelCase` | `formatCurrency` |
| Tipos e interfaces | `PascalCase` | `User`, `TransactionResponse` |
| Constantes globales | `UPPER_SNAKE_CASE` | `API_TIMEOUT_MS` |
| Carpetas de páginas y componentes | `PascalCase`, igual que su componente | `pages/Registro/`, `components/Input/` |
| Otras carpetas (`services`, `context`, `data`) | minúsculas | `services/auth.ts` |
| Variables de entorno | `VITE_` + `UPPER_SNAKE_CASE` | `VITE_API_URL` |

## Componentes React

- Solo **componentes de función** con hooks.
- Un componente por archivo (los auxiliares muy pequeños pueden convivir).
- Exporta con nombre (`export function UserCard`) para facilitar búsquedas y refactors.
- Las props se desestructuran en la firma:

```tsx
interface UserCardProps {
  name: string;
  email: string;
}

export function UserCard({ name, email }: UserCardProps) {
  return (
    <article>
      <h3>{name}</h3>
      <p>{email}</p>
    </article>
  );
}
```

- Listas con `key` estable y única (no uses el índice si la lista puede cambiar).
- No muten el estado directamente; crea copias nuevas.
- Evita `useEffect` cuando un valor se puede **derivar** durante el render.
- Cuando haya datos remotos, maneja siempre los estados: cargando, error, vacío y éxito.

## Peticiones a la API

- Solo desde `services/` (como `services/auth.ts`); no hagas `fetch` suelto dentro de los componentes. Al sumar más servicios, extrae un cliente común.
- Las peticiones con sesión llevan `credentials: 'include'`.
- Usa `import.meta.env.VITE_API_URL` para la URL base, nunca valores fijos.
- Maneja los errores según el [formato estándar del backend](https://github.com/lNexapay/nexapay-backend/blob/main/docs/api.md#formato-de-errores).

## Estilos

- Define una sola estrategia de estilos (ver pendientes en [architecture.md](architecture.md)) y úsala en todo el proyecto.
- Colores, espaciados y tipografías en variables centralizadas, no valores sueltos repetidos.
- Diseño **responsive**: probar al menos en móvil y escritorio.

## Íconos

Usa `lucide-react` e importa solo los íconos necesarios:

```tsx
import { Wallet } from 'lucide-react';
```

## Seguridad

- **Nunca** guardes secretos ni llaves privadas en el frontend: todo lo de `VITE_` es público.
- No uses `dangerouslySetInnerHTML` con contenido que provenga de usuarios.
- No imprimas tokens ni datos personales en `console.log`.
- Toda validación del cliente es solo de comodidad: el backend siempre debe validar.

## Antes de abrir un PR

```bash
npm run lint
npm run build
```

El CI ejecuta estas mismas verificaciones. Además, revisa a mano la pantalla en el navegador y adjunta una captura en el PR si el cambio es visual.
