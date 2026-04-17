# Design: Printly SaaS MVP

## Technical Approach

Payload CMS como backend headless (colecciones + access control + hooks). Next.js App Router como frontend con dos route groups: `(payload)` para el panel admin y `(frontend)` para el cotizador. El campo `owner: relationship('users')` en cada colección de precios actúa como clave de tenancy. El frontend carga precios via Server Actions con cache keyed por `ownerId`.

**Opciones dinámicas**: las opciones disponibles en el cotizador (tamaños, gramajes, porcentajes de tinta, rangos de anillado) NO son hardcodeadas — se derivan de los registros de precio configurados por el owner. Si un owner no tiene precio para A3 + 100g, esa combinación no aparece como opción seleccionable. Esto hace el sistema flexible y evita cálculos con precio=undefined.

**Acceso al cotizador**: tanto Owner como Seller acceden al cotizador en `/app`. El middleware bloquea `/admin` a todos excepto super admin, y `/app/settings` a sellers.

**Estructura de rutas**:
```
/                        → Landing page (pública, comercial)
/login                   → Autenticación por username
/app                     → Cotizador (owner + seller)
/app/settings            → Panel de configuración (owner only)
/app/settings/sellers    → Gestión de vendedores (owner only)
/admin                   → Payload CMS (super admin only)
```

## Architecture Decisions

| Decisión | Opción elegida | Alternativas | Rationale |
|----------|---------------|--------------|-----------|
| Modelo de tenancy | Campo `owner` en colecciones de precios | Colección `Organizations` separada | MVP más simple; Organizations agrega complejidad sin beneficio actual |
| Seed de precios | `afterChange` hook en Users collection | Endpoint manual / admin action | Automático = menos fricción en onboarding; hook es el patrón Payload correcto |
| Cache de precios | `unstable_cache` keyed por `ownerId` | Sin cache / SWR client | Server-side cache reduce latencia; key por tenant garantiza aislamiento |
| Bloqueo de acceso al panel | Middleware en `/admin` (todos excepto admin) y `/app/settings` (sellers) | `hidden: true` en colecciones | Middleware es la barrera más robusta y centralizada |
| Settings del owner | UI propia en `/app/settings` con server actions | Payload admin para owners | Payload admin queda limpio solo para super admin; UX mucho mejor para el owner |
| Estado del cotizador | Estado local React (useState/useReducer) | Zustand / Jotai | Sin dependencias extra; el estado no persiste entre sesiones por diseño |
| Login | Username sin email requerido | Email + password | Consistente con beep-system-payload; más simple para users de imprenta |
| Opciones del cotizador | Dinámicas: derivadas de registros de precio del owner | Hardcodeadas como enum en beep | Flexibility: owner puede agregar/quitar gramajes; cotizador nunca muestra opciones sin precio |
| Cascading selects | Cada selector filtra basándose en la selección previa | Selects independientes | Previene combinaciones inválidas (A3 sin gramaje 100g no aparece si no existe precio) |

## Data Flow

```
[Seller/Owner login] ──→ Payload auth ──→ JWT con { role, id, owner? }
                                              │
                    ┌─────────────────────────┘
                    ▼
[Frontend cotizador]
  Server Component: getPriceConfig(ownerId)
    └─ unstable_cache(ownerId) ──→ Payload local API ──→ PostgreSQL
                                        └─ WHERE owner = ownerId

  Client Component: QuoteCalculator
    ├─ Pill toggles → useState → usePriceCalculation() → precio en tiempo real
    ├─ "Agregar" → WorkTable (estado local)
    └─ Bottom bar → Server Action (incrementCounter) ──→ Payload local API
                                                              └─ Counters WHERE owner = ownerId
```

```
[Admin crea Owner en Payload Admin]
  Users.afterChange hook
    └─ role === 'owner' && operation === 'create'
         └─ payload.create × N (PaperPrices, InkPrices, ProfitMargins, BindingPrices)
              └─ cada registro con { owner: newUser.id }
```

## File Changes

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/collections/Users.ts` | Crear | Roles, loginWithUsername, campo `owner` para sellers, afterChange seed hook |
| `src/collections/PaperPrices.ts` | Crear | Campo `owner` required, access control tenant, displayName hook |
| `src/collections/InkPrices.ts` | Crear | Campo `owner` required, access control tenant |
| `src/collections/ProfitMargins.ts` | Crear | Campo `owner` required, access control tenant |
| `src/collections/BindingPrices.ts` | Crear | Campo `owner` required, access control tenant |
| `src/collections/Counters.ts` | Crear | Campo `owner` required, acceso sistema/admin |
| `src/lib/access.ts` | Crear | `getUserRole`, `tenantRead`, `tenantUpdate`, `isAdmin`, `adminOrOwner` |
| `src/lib/seed/default-prices.ts` | Crear | Datos de precios base por colección (constantes) |
| `src/payload.config.ts` | Modificar | Registrar las 6 colecciones, loginWithUsername global |
| `src/middleware.ts` | Crear | `/admin` → solo admin; `/app/settings` → solo owner; `/app` → autenticados; `/` → redirect si autenticado |
| `src/app/(frontend)/layout.tsx` | Modificar | Providers, fuente Inter, tema Ethereal Architect |
| `src/app/(frontend)/page.tsx` | Crear | Landing page pública: hero, features, pricing, CTA |
| `src/app/(frontend)/login/page.tsx` | Crear | Formulario de login con username |
| `src/app/(frontend)/login/actions.ts` | Crear | Server action de autenticación con Payload |
| `src/app/(frontend)/app/layout.tsx` | Crear | Layout autenticado con navbar y sidebar de navegación |
| `src/app/(frontend)/app/page.tsx` | Crear | Cotizador: layout 2 columnas, configurador + tabla |
| `src/app/(frontend)/app/actions.ts` | Crear | `getPriceConfigAction`, `incrementSaleAction`, `incrementBudgetAction` |
| `src/app/(frontend)/app/settings/layout.tsx` | Crear | Layout de settings con nav entre secciones |
| `src/app/(frontend)/app/settings/page.tsx` | Crear | Redirect a `/app/settings/prices` |
| `src/app/(frontend)/app/settings/prices/page.tsx` | Crear | CRUD de PaperPrices, InkPrices, ProfitMargins, BindingPrices |
| `src/app/(frontend)/app/settings/prices/actions.ts` | Crear | Server actions CRUD de precios |
| `src/app/(frontend)/app/settings/sellers/page.tsx` | Crear | Lista y formulario de sellers del tenant |
| `src/app/(frontend)/app/settings/sellers/actions.ts` | Crear | Server actions crear/eliminar sellers |
| `src/app/services/prices.service.ts` | Crear | `getPriceConfig(ownerId)` con `unstable_cache` |
| `src/app/services/counters.service.ts` | Crear | `incrementCounter(ownerId, type)` |
| `src/components/quote/configurator.tsx` | Crear | Formulario con pill toggles, precio en tiempo real |
| `src/components/quote/work-table.tsx` | Crear | Tabla de trabajos con edit/delete, empty state |
| `src/components/quote/bottom-bar.tsx` | Crear | Acciones venta/presupuesto con totales |
| `src/lib/hooks/use-price-calculation.ts` | Crear | Hook de cálculo: fórmula papel + tinta × margen + anillado |
| `src/lib/schemas/print-schema.ts` | Crear | Schema Zod para validar parámetros del trabajo |
| `src/lib/safe-action-client.ts` | Crear | Cliente next-safe-action con `actionClient` |

## Interfaces / Contracts

```typescript
// Tenant access pattern para todas las colecciones de precios
type TenantAccess = (args: AccessArgs) => boolean | Where
// Admin → true | Owner → { owner: { equals: user.id } } | Seller → { owner: { equals: user.owner } }

// Estructura de precios cargada por el cotizador
// Las keys son strings dinámicos (no enums) — lo que el owner tenga configurado
interface PriceConfig {
  paperPrices: Record<string, Record<string, number>>   // size → weight → price
  inkPrices: { blancoNegro?: number; color?: Record<string, number> }
  profitMargins: Record<string, Record<string, number>> // format → quantityRange → margin
  bindingPrices: Record<string, number>                 // quantityRange → price
}

// Opciones disponibles derivadas del PriceConfig (para renderizar los selects)
interface AvailableOptions {
  sizes: string[]                              // tamaños con al menos un gramaje configurado
  weightsBySize: Record<string, string[]>      // gramajes disponibles para cada tamaño
  inkFormats: string[]                         // formatos con precio configurado
  percentagesByFormat: Record<string, string[]>
  bindingRanges: string[]
}

// Trabajo en la tabla
interface WorkItem {
  id: string
  params: PrintParams
  printingCost: number
  bindingPrice: number
  totalPrice: number
}
```

## Testing Strategy

Sin test runner configurado — verificación por `pnpm lint` + `tsc --noEmit` + revisión manual de los escenarios de specs.

| Capa | Qué verificar | Cómo |
|------|--------------|------|
| Tipos | Contratos entre colecciones y servicios | `tsc --noEmit` |
| Linting | Convenciones del proyecto | `pnpm lint` |
| Manual | Escenarios de aislamiento de tenant | Login como Owner A/B, verificar datos |
| Manual | Cálculo de precio en tiempo real | Comparar resultado vs fórmula en spec |

## Migration / Rollout

Proyecto nuevo desde cero. No hay migración de datos. Al agregar cada colección ejecutar `pnpm generate:types` para actualizar `payload-types.ts`.

## Open Questions

- Resueltas: opciones dinámicas ✅, owner + seller acceden al cotizador ✅
