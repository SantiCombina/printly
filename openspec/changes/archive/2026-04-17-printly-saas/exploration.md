## Exploration: Convertir beep-system-payload en SaaS multi-tenant para imprentas

### Current State (beep-system-payload — single-tenant)

El sistema original es un sistema de cotización para una sola imprenta. Sus colecciones:

- **Users**: 3 roles (admin, owner, seller). Owner tiene datos del local (localName, localPhone, localAddress)
- **PaperPrices**: precio por tamaño (a4, oficio, a3, comercial, adhesivo) × gramaje (6 tipos)
- **InkPrices**: costo de tinta por formato (B/N o Color) × porcentaje (10%, 50%, 100%)
- **ProfitMargins**: margen multiplicador por formato × rango de páginas (7 rangos)
- **BindingPrices**: precio de anillado por rango de hojas (4 rangos)
- **Counters**: contador diario de ventas y presupuestos

**Lógica de cotización** (`use-price-calculation.ts`):
```
costo_papel = precio_hoja[size][weight] × hojas
costo_tinta = precio_tinta[format][percentage] × páginas (×2 si A3)
costo_impresión = costo_papel + costo_tinta
precio_final = roundedPrice(costo_impresión × margen[format][rango_páginas])
precio_total = precio_final + anillado + adicional
```

**Frontend**: formulario de cotización (página única) donde el seller/owner carga parámetros de un trabajo y lo agrega a una tabla. Puede guardar como PDF, registrar como venta, o registrar como presupuesto.

### Problema del Single-tenant

Todas las colecciones de precios son globales — no hay relación con un tenant. En el SaaS necesitamos que cada Owner tenga su propia configuración de precios, y los Sellers de un Owner solo vean los datos de ese Owner.

---

### Arquitectura SaaS Multi-tenant

#### Modelo de Tenancy

El **Owner ES el tenant**. Cada registro de precios debe tener una relación `owner: relationship('users')`.

Los Sellers se relacionan a un Owner mediante un campo `owner` en Users.

El Admin (yo) tiene visibilidad total sobre todos los tenants desde el panel Payload.

#### Nuevas colecciones necesarias

1. **Tenants** (opcional, alternativa a usar Users directamente): podría crearse una colección separada `Organizations` para datos del negocio, con slug, plan, etc. Pero con el modelo actual (owner en Users) es suficiente para empezar.

2. **Subscriptions/Plans** (futuro): para manejar planes de suscripción. Fuera del alcance inicial.

#### Cambios al modelo de datos

**Users** (extender):
- `owner`: relationship → Users (solo para role=seller, apunta a su owner)
- Eliminar: `localName`, `localPhone`, `localAddress` — estos van a una colección `Organizations` separada, o se mantienen en Users pero solo accesibles por owner

**PaperPrices** (agregar):
- `owner`: relationship → Users (required, hidden para el owner que lo crea)

**InkPrices**, **ProfitMargins**, **BindingPrices** (mismo cambio):
- `owner`: relationship → Users

**Counters** (cambiar):
- `owner`: relationship → Users
- Separar contadores por tenant

#### Access Control multi-tenant

```typescript
// Owner ve solo sus registros
// Seller ve solo los registros de su owner
// Admin ve todo

const tenantRead: Access = ({ req: { user } }) => {
  const role = getUserRole(user)
  if (role === 'admin') return true
  if (role === 'owner') return { owner: { equals: user.id } }
  if (role === 'seller') return { owner: { equals: user.owner } }
  return false
}
```

#### Frontend SaaS

El frontend del seller/owner necesita:
1. **Login** → determina el tenant (owner.id)
2. **Dashboard del owner**: gestión de precios, gestión de sellers
3. **Vista del seller**: solo el formulario de cotización (igual que beep, pero cargando los precios de su owner)
4. **Panel admin** (Payload CMS): gestión de todos los owners, sus configs y planes

---

### Approaches

#### Opción A: `owner` field directo en cada colección de precios

Agregar `owner: relationship('users')` a PaperPrices, InkPrices, ProfitMargins, BindingPrices, Counters.

- Pros: simple, directo, usa las colecciones existentes de beep sin nueva abstracción
- Cons: si en el futuro hay múltiples locales por owner habría que refactorizar
- Esfuerzo: Bajo

#### Opción B: Colección `Organizations` separada

Crear `Organizations` (tenant entity) y relacionar todo ahí en vez de Users.

- Pros: más limpio conceptualmente, permite multi-local por owner en el futuro
- Cons: agrega una colección extra, más complejo el access control
- Esfuerzo: Medio

#### Opción C: Subdomain-based tenancy

Cada owner tiene su subdominio (imprenta1.printly.com)

- Pros: isolación perfecta, mejor UX
- Cons: complejidad de deployment, certificados SSL, fuera del alcance del MVP
- Esfuerzo: Alto

---

### Recommendation

**Opción A** para el MVP. Usar `owner` field directo en cada colección de precios. Es la evolución más directa de beep-system-payload. Si en el futuro se necesitan múltiples locales por owner, se puede migrar a Organizations.

**Flujo de onboarding**:
1. Admin crea un User con role=owner (con localName, localPhone, localAddress)
2. Admin (o un seed automático) crea los registros de precio base para ese owner
3. Owner puede modificar sus precios desde el panel Payload
4. Owner crea sus Sellers desde el panel Payload
5. Sellers acceden al frontend de cotización, que filtra precios por su owner

**Stack del frontend**:
- Route group `(frontend)` para la app de cotización (igual que beep)
- Route group `(payload)` para el admin panel (Payload CMS) — solo admin y owners con acceso restringido
- Sellers solo ven `(frontend)`

---

### Risks

- **Seed de precios**: cuando se crea un owner hay que decidir si se crean precios por defecto automáticamente (recomendado) o si el admin los carga manualmente
- **Cache por tenant**: el `unstable_cache` actual en beep usa keys globales — en el SaaS hay que incluir el `ownerId` como parte de la cache key
- **Payload Admin para owners**: los owners necesitan acceso al Payload admin panel para gestionar sus precios y sellers, pero con vistas filtradas. Hay que validar bien que no puedan ver datos de otros owners
- **Primer acceso de owner**: definir si el owner puede modificar los tipos de papel/tinta (options de los selects) o solo los precios — en beep los campos de categoría son readOnly para non-admin

---

### Ready for Proposal
Sí. Con este análisis se puede crear la propuesta de cambio para el MVP del SaaS.

**Alcance del MVP sugerido**:
1. Multi-tenancy: campo `owner` en todas las colecciones de precios
2. Sellers vinculados a su owner
3. Access control por tenant
4. Frontend de cotización filtrado por tenant (login → detecta owner)
5. Seed automático de precios al crear un owner
6. Dashboard básico del owner (gestión de sellers + sus precios)

---

## Design Reference: Printly SaaS Dashboard (Stitch)

### Sistema de Diseño — "Ethereal Architect"

**Paleta de colores:**
- Primary (Indigo): `#3525cd` / `#4F46E5` (container)
- Success (Emerald): `#10B981`
- Background: `#f8f9fa` (surface) / `#f3f4f5` (low) / `#ffffff` (lowest)
- Text: `#191c1d` (primary) / `#464555` (muted)
- Borders/outline: `#777587` / `#c7c4d8`

**Tipografía:** Inter exclusivamente. Headlines con letter-spacing -0.02em.

**Filosofía visual:**
- Sin bordes de 1px para secciones — separación por color shifts
- Cards con radius 12px, inputs 8px, toggles pill (9999px)
- CTAs: gradiente 135° de `primary` → `primary-container`
- Glassmorphism para elementos flotantes
- Sombras "wide-diffusion": `0px 20px 40px rgba(25,28,29,0.06)`

### Pantallas diseñadas

**PrintDesk Desktop Dashboard:**
- Top nav sticky: logo + subtítulo + ícono panel + logout
- Layout 2 columnas: 60% configurador / 40% tabla de trabajos
- Configurador: input grande de páginas, precio en tiempo real, opciones en pill toggles (tamaño, gramaje, tinta, tipo papel)
- Métricas: producción diaria, eficiencia de tinta, stock de papel
- Tabla derecha: jobs con edit/delete, hover states, empty state illustration
- Bottom action bar: presupuestos (indigo) + ventas (verde)

**PrintDesk Desktop - Job Cards View:**
- Header: "Architect Print" branding + tabs (Dashboard, Jobs in Progress, Completed, Archive)
- Panel "New Order": opciones rápidas de papel/color + botón "Add to Jobs"
- Lista de trabajos: cards verticales con specs completas (papel, tamaño, gramaje, color, anillado)
- Resumen financiero: subtotal + precio final + botón CHECKOUT

**Mobile Dashboard:**
- Navegación bottom bar
- Cotizador compacto arriba
- Lista de trabajos como cards scrollable
- Bottom bar: Presupuestos ($0.00) + "32 Hoy" en ventas
