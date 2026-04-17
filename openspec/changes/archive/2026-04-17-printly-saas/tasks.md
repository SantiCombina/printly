# Tasks: Printly SaaS MVP

## Phase 1: Fundación — Tipos, acceso y colecciones

- [x] 1.1 Crear `src/lib/access.ts` con `getUserRole`, `isAdmin`, `tenantRead`, `tenantUpdate`, `adminOrOwner`; el patrón tenant debe resolver `owner.id` para sellers leyendo el campo `owner` del JWT
- [x] 1.2 Crear `src/lib/seed/default-prices.ts` con constantes de precios base (paper, ink, margins, binding) para el seed automático
- [x] 1.3 Crear `src/collections/Users.ts`: roles admin/owner/seller, `loginWithUsername`, campo `owner` (relationship a Users, requerido para sellers), `afterChange` hook que dispara seed cuando `role === 'owner' && operation === 'create'`
- [x] 1.4 Crear `src/collections/PaperPrices.ts`: campos `owner` (relationship), `size` (text libre), `weight` (text libre), `price` (number), `displayName` (hook); access control tenant via `src/lib/access.ts`
- [x] 1.5 Crear `src/collections/InkPrices.ts`: campos `owner`, `format` (text), `percentage` (text, opcional), `price`; access control tenant
- [x] 1.6 Crear `src/collections/ProfitMargins.ts`: campos `owner`, `format` (text), `quantityRange` (text), `margin` (number); access control tenant
- [x] 1.7 Crear `src/collections/BindingPrices.ts`: campos `owner`, `quantityRange` (text), `price`; access control tenant
- [x] 1.8 Crear `src/collections/Counters.ts`: campos `owner`, `date` (text DD-MM-YYYY), `salesCount`, `budgetsCount`; acceso solo sistema/admin
- [x] 1.9 Modificar `src/payload.config.ts`: registrar las 6 colecciones nuevas, configurar `loginWithUsername` global, remover colección Media
- [x] 1.10 Ejecutar `pnpm generate:types` y verificar que `src/payload-types.ts` refleja todas las colecciones

## Phase 2: Servicios y safe-action client

- [x] 2.1 Crear `src/lib/safe-action-client.ts` exportando `actionClient` (instancia de next-safe-action)
- [x] 2.2 Crear `src/app/services/prices.service.ts`: función `getPriceConfig(ownerId)` que consulta las 4 colecciones de precio, convierte a `PriceConfig` y usa `unstable_cache` keyed por `ownerId`; también exportar `deriveAvailableOptions(config: PriceConfig): AvailableOptions`
- [x] 2.3 Crear `src/app/services/counters.service.ts`: función `incrementCounter(ownerId, type)` que busca o crea el Counter del día para el tenant y lo incrementa
- [x] 2.4 Crear `src/middleware.ts`: `/admin/*` → solo role=admin (sino redirect `/`); `/app/settings/*` → solo role=owner (sino redirect `/app`); `/app/*` → requiere auth (sino redirect `/login`); `/` → si autenticado redirect a `/app`

## Phase 3: Lógica del cotizador

- [x] 3.1 Crear `src/lib/schemas/print-schema.ts`: schema Zod para `PrintParams` (páginas, size, weight, format, side, percentage, bindingQuantity, additional, remarks) con validaciones cruzadas (color requiere percentage)
- [x] 3.2 Crear `src/lib/hooks/use-price-calculation.ts`: hook que recibe `PrintParams` + `PriceConfig` y retorna `{ printingCost, bindingPrice, printingPrice, totalWorkPrice }` aplicando la fórmula de la spec (doble faz, A3×2, margen por rango)
- [x] 3.3 Crear `src/app/(frontend)/app/actions.ts`: server actions `getPriceConfigAction`, `incrementSaleAction`, `incrementBudgetAction`
- [x] 3.4 Crear `src/app/(frontend)/app/settings/prices/actions.ts`: server actions `createPriceAction`, `updatePriceAction`, `deletePriceAction` para las 4 colecciones de precio
- [x] 3.5 Crear `src/app/(frontend)/app/settings/sellers/actions.ts`: server actions `createSellerAction`, `deleteSellerAction`
- [x] 3.6 Crear `src/app/(frontend)/login/actions.ts`: server action de autenticación que llama a Payload auth y setea cookie de sesión

## Phase 4: UI — Layout, autenticación y landing

- [x] 4.1 Modificar `src/app/(frontend)/layout.tsx`: fuente Inter, variables CSS del tema Ethereal Architect (colores indigo/emerald/surface), providers
- [x] 4.2 Crear `src/app/(frontend)/page.tsx`: landing page con secciones hero, features, pricing (planes), CTA — Server Component estático
- [x] 4.3 Crear `src/app/(frontend)/login/page.tsx`: formulario de login con username + password usando shadcn Form + Zod; llama `loginAction`; redirige por rol post-login
- [x] 4.4 Crear `src/app/(frontend)/app/layout.tsx`: layout autenticado con navbar superior (logo, user info, logout) y navegación a `/app` y `/app/settings` (este último solo para owners)
- [x] 4.5 Crear `src/app/(frontend)/app/settings/layout.tsx`: layout de settings con sidebar/tabs de navegación entre Precios (sub-secciones) y Vendedores

## Phase 5: UI — Cotizador y settings

- [x] 5.1 Crear `src/components/quote/configurator.tsx`: input de páginas, pill toggles cascading (size → weights disponibles, format → percentages disponibles), precio en tiempo real via `usePriceCalculation`
- [x] 5.2 Crear `src/components/quote/work-table.tsx`: tabla con columnas specs+precio, edit/delete por fila, empty state ilustrado, subtotal acumulado
- [x] 5.3 Crear `src/components/quote/bottom-bar.tsx`: barra sticky con total, botones "Registrar Venta" (emerald) y "Generar Presupuesto" (indigo), deshabilitados si tabla vacía
- [x] 5.4 Crear `src/app/(frontend)/app/page.tsx`: Server Component que resuelve `ownerId`, carga `PriceConfig` + `AvailableOptions`, layout 2 columnas (60% configurador / 40% tabla)
- [x] 5.5 Crear `src/app/(frontend)/app/settings/prices/page.tsx`: tabbed UI con 4 secciones (Papel, Tinta, Márgenes, Anillado); tabla de registros por sección con botón agregar + editar + eliminar
- [x] 5.6 Crear `src/app/(frontend)/app/settings/sellers/page.tsx`: lista de sellers del tenant con nombre de usuario y fecha de creación; formulario inline para crear nuevo seller

## Phase 6: Verificación

- [x] 6.1 `pnpm lint` — sin errores
- [x] 6.2 `tsc --noEmit` — sin errores de tipo
- [x] 6.3 Manual: visitar `/` sin sesión → ver landing; visitar `/` con sesión → redirect a `/app`
- [x] 6.4 Manual: login con owner → redirect a `/app/settings`; login con seller → redirect a `/app`
- [x] 6.5 Manual: seller intenta navegar a `/app/settings` → redirect a `/app`; intenta `/admin` → redirect a `/`
- [x] 6.6 Manual: owner crea nueva combinación de precio en settings → aparece como opción en el cotizador
- [x] 6.7 Manual: owner elimina gramaje "75g" para A4 → deja de aparecer en el cotizador al seleccionar A4
- [x] 6.8 Manual: owner crea seller → seller aparece en lista; owner elimina seller → seller no puede iniciar sesión
- [x] 6.9 Manual: seller registra venta → contador del tenant se incrementa, tabla se limpia
- [x] 6.10 Manual: admin crea owner → se generan precios base automáticamente en las 4 colecciones
