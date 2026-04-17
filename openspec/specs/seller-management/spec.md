# seller-management Specification

## Purpose

Gestión de vendedores del tenant desde `/app/settings/sellers`. El Owner puede crear, ver y eliminar los sellers que tienen acceso al cotizador de su imprenta.

## Requirements

### Requirement: Seller CRUD

El owner MUST poder crear nuevos sellers (con username y password) y eliminar sellers existentes. Los sellers creados MUST quedar automáticamente vinculados al owner que los creó.

#### Scenario: Crear seller

- GIVEN el owner está en `/app/settings/sellers`
- WHEN completa el formulario con username y password y confirma
- THEN se crea un User con role=seller y campo `owner` apuntando al owner autenticado
- AND el nuevo seller aparece en la lista

#### Scenario: Eliminar seller

- GIVEN el owner ve la lista de sus sellers
- WHEN elimina un seller
- THEN el User es eliminado y ya no puede iniciar sesión

#### Scenario: Owner no puede crear otro owner

- GIVEN el owner está en el formulario de creación de seller
- WHEN intenta establecer role=owner (si hubiera tal campo)
- THEN el sistema asigna role=seller forzosamente — el rol no es editable por el owner

### Requirement: Seller List

El owner MUST poder ver la lista de todos sus sellers con username y fecha de creación.

#### Scenario: Lista de sellers del tenant

- GIVEN el owner tiene 3 sellers creados
- WHEN accede a `/app/settings/sellers`
- THEN ve una lista con los 3 sellers
- AND no ve sellers de otros tenants
