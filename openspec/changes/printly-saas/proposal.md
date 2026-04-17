# Proposal: Printly SaaS MVP

## Intent

Construir desde cero un SaaS de cotización para imprentas multi-tenant, más flexible y visualmente superior al sistema single-tenant de referencia (beep-system-payload). Cada imprenta cliente (owner) tiene su propia configuración de precios, sus vendedores y su branding. El admin (yo) administra todos los clientes desde un panel centralizado.

## Scope

### In Scope
- Sistema de roles: Admin / Owner (tenant) / Seller
- Multi-tenancy por campo `owner` en todas las colecciones de precios
- Colecciones Payload: Users, PaperPrices, InkPrices, ProfitMargins, BindingPrices, Counters
- Seed automático de precios base al crear un Owner (via afterChange hook)
- Sellers vinculados a su Owner; acceso solo al cotizador
- **Landing page** comercial del producto SaaS (descripción, features, pricing de planes, CTA)
- **Login** con username (sin email requerido), protección de rutas autenticadas
- **Frontend cotizador** (`/app`): diseño "Ethereal Architect", layout 2 columnas, pill toggles dinámicos, tabla de trabajos, bottom action bar
- Lógica de cotización en tiempo real: papel + tinta × margen + anillado + adicional; opciones derivadas dinámicamente de precios configurados
- **Panel de settings del owner** (`/app/settings`): UI visual para gestionar precios de papel/tinta/márgenes/anillado con CRUD completo — agregar, editar y eliminar combinaciones
- **Gestión de sellers** (`/app/settings/sellers`): crear, ver y eliminar sellers del tenant
- Cache por tenant (`unstable_cache` keyed por `ownerId`)
- Payload admin exclusivo para super admin (owners y sellers no acceden)

### Out of Scope
- Planes de suscripción / billing
- Subdomains por tenant
- Colección Organizations separada
- Exportación PDF (fase siguiente)
- Mobile-first / responsive (fase siguiente)
- Historial de ventas / reportes avanzados

## Capabilities

### New Capabilities
- `tenant-management`: CRUD de owners desde el panel admin; seed automático de precios base
- `user-roles`: Roles admin/owner/seller con access control; Payload admin exclusivo para super admin
- `price-configuration`: Configuración de precios por tenant (papel, tinta, márgenes, anillado)
- `quote-calculator`: Formulario de cotización en tiempo real con pill toggles dinámicos y tabla de trabajos
- `job-actions`: Registrar venta / generar presupuesto con contadores por tenant
- `landing-page`: Página pública comercial del producto con descripción, features y pricing
- `auth-flow`: Login con username, protección de rutas, redirección por rol post-login
- `owner-settings`: Panel visual del owner para gestionar precios y márgenes (CRUD completo de combinaciones)
- `seller-management`: Panel del owner para crear, ver y eliminar sellers de su tenant

### Modified Capabilities
- None (proyecto nuevo desde cero)

## Approach

Payload CMS como backend headless + Next.js App Router como frontend. El campo `owner: relationship('users')` en cada colección de precios es el eje del multi-tenancy. Access control por rol en cada operación Payload. Frontend con diseño "Ethereal Architect" del Stitch: layout 2 columnas, pill toggles, gradiente indigo en CTAs, sombras difusas.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/collections/Users.ts` | New | Roles admin/owner/seller + campo `owner` para sellers |
| `src/collections/PaperPrices.ts` | New | Campo `owner` + access control tenant |
| `src/collections/InkPrices.ts` | New | Campo `owner` + access control tenant |
| `src/collections/ProfitMargins.ts` | New | Campo `owner` + access control tenant |
| `src/collections/BindingPrices.ts` | New | Campo `owner` + access control tenant |
| `src/collections/Counters.ts` | New | Campo `owner`, contadores por tenant |
| `src/lib/access.ts` | New | Helpers de access control multi-tenant |
| `src/lib/hooks/use-price-calculation.ts` | New | Lógica de cotización en tiempo real |
| `src/app/(frontend)/` | New | UI cotizador: layout 2col, pill toggles, tabla de trabajos |
| `src/app/services/` | New | PricesService, CountersService (cache keyed por ownerId) |
| `src/payload.config.ts` | New | Registro de todas las colecciones |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Owner ve datos de otro tenant | Med | Tests de access control en cada colección; Where clause estricta |
| Seed falla al crear owner | Low | Hook `afterChange` en Users con manejo de error explícito |
| Cache no se invalida al cambiar precios | Med | Incluir `ownerId` + `updatedAt` como parte de la cache key |
| Payload Admin expuesto a sellers | Low | Middleware de redirección + `hidden` en colecciones por rol |

## Rollback Plan

Proyecto nuevo — no hay datos existentes que migrar. Rollback = revertir commits o restaurar desde backup de DB. La DB es PostgreSQL local en desarrollo; no hay riesgo de pérdida de datos de producción en esta fase.

## Dependencies

- PostgreSQL corriendo localmente (ya configurado en el proyecto)
- `pnpm generate:types` después de cada cambio en colecciones

## Success Criteria

- [ ] La landing page es accesible sin login y describe el producto con sección de pricing
- [ ] El login con username redirige: owner → `/app/settings`, seller → `/app`
- [ ] Admin puede crear un Owner y se generan precios base automáticamente
- [ ] Owner puede agregar, editar y eliminar combinaciones de precio desde `/app/settings`
- [ ] Owner puede crear y eliminar Sellers desde `/app/settings/sellers`
- [ ] Seller inicia sesión y solo ve el cotizador; `/app/settings` y `/admin` están bloqueados
- [ ] El cotizador muestra solo opciones con precio configurado; al cambiar size se filtran weights
- [ ] Registrar venta / presupuesto incrementa el contador del tenant correcto
- [ ] `pnpm lint` y `tsc --noEmit` pasan sin errores
