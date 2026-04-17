# user-roles Specification

## Purpose

Define los tres roles del sistema (admin, owner, seller), sus permisos en Payload CMS y las restricciones de acceso al panel administrativo.

## Requirements

### Requirement: Role Definitions

El sistema MUST soportar exactamente tres roles: `admin`, `owner`, `seller`. El rol MUST estar guardado en el JWT para que el access control funcione sin consultar la DB en cada request.

#### Scenario: Login como seller

- GIVEN un User con role=seller intenta acceder a `/admin`
- WHEN el sistema evalúa el acceso
- THEN el seller es redirigido al frontend (`/`)
- AND no puede ver ninguna colección del panel Payload

#### Scenario: Login como owner

- GIVEN un User con role=owner se autentica
- WHEN accede al panel Payload
- THEN puede ver y editar sus colecciones de precios y sus Sellers
- AND NO puede ver colecciones de otros Owners ni la lista completa de Users

#### Scenario: Login como admin

- GIVEN el User con role=admin se autentica
- WHEN accede al panel Payload
- THEN tiene acceso completo a todas las colecciones y todos los tenants

### Requirement: Seller-Owner Binding

Un User con role=seller MUST tener un campo `owner` que apunte al Owner al que pertenece. Este campo MUST ser requerido al crear un seller.

#### Scenario: Owner crea un seller

- GIVEN un Owner autenticado en el panel Payload
- WHEN crea un nuevo User
- THEN el rol asignado MUST ser `seller`
- AND el campo `owner` del nuevo seller apunta automáticamente al Owner que lo crea

#### Scenario: Owner intenta crear otro owner

- GIVEN un Owner autenticado intenta crear un User con role=owner
- WHEN envía el formulario
- THEN el sistema rechaza la operación con un error

### Requirement: Panel Access Control

El panel Payload MUST estar completamente inaccesible para usuarios con role=seller.

#### Scenario: Seller intenta acceder directamente al panel

- GIVEN un Seller con sesión activa intenta navegar a `/admin`
- WHEN el middleware evalúa la ruta
- THEN es redirigido a `/` sin ver ningún contenido del panel
