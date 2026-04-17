# auth-flow Specification

## Purpose

Autenticación con username, protección de rutas y redirección por rol post-login.

## Requirements

### Requirement: Username Login

El sistema MUST permitir login con username sin requerir email. Las credenciales MUST validarse contra la colección Users de Payload.

#### Scenario: Login exitoso como owner

- GIVEN un User con role=owner existe en el sistema
- WHEN ingresa username y password correctos en `/login`
- THEN es autenticado y redirigido a `/app/settings`

#### Scenario: Login exitoso como seller

- GIVEN un User con role=seller existe en el sistema
- WHEN ingresa username y password correctos en `/login`
- THEN es autenticado y redirigido a `/app`

#### Scenario: Credenciales inválidas

- GIVEN un usuario ingresa credenciales incorrectas
- WHEN envía el formulario de login
- THEN permanece en `/login` con mensaje de error
- AND no se crea sesión

### Requirement: Route Protection

Las rutas bajo `/app` MUST requerir autenticación. Un usuario no autenticado que intente acceder a `/app` MUST ser redirigido a `/login`.

#### Scenario: Acceso no autenticado a ruta protegida

- GIVEN un usuario sin sesión activa
- WHEN intenta navegar a `/app`
- THEN es redirigido a `/login`

### Requirement: Role-based Route Restriction

Las rutas bajo `/app/settings` MUST estar restringidas a usuarios con role=owner. Un seller que intente acceder MUST ser redirigido a `/app`.

#### Scenario: Seller intenta acceder a settings

- GIVEN un usuario con role=seller autenticado
- WHEN navega a `/app/settings`
- THEN es redirigido a `/app`
