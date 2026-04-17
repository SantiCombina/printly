# tenant-management Specification

## Purpose

Gestión del ciclo de vida de Owners (tenants) desde el panel Admin. Incluye creación, activación y seed automático de precios base.

## Requirements

### Requirement: Owner Creation

El Admin MUST poder crear un User con role=owner, incluyendo nombre del local, teléfono y dirección. Al confirmar la creación, el sistema MUST generar automáticamente registros de precios base (PaperPrices, InkPrices, ProfitMargins, BindingPrices) asociados a ese owner.

#### Scenario: Creación exitosa de owner con seed automático

- GIVEN el Admin está autenticado en el panel Payload
- WHEN crea un User con role=owner y completa los campos requeridos
- THEN el usuario owner es guardado
- AND se crean automáticamente los registros de precios base para ese owner

#### Scenario: Seed falla parcialmente

- GIVEN el Admin crea un owner exitosamente
- WHEN el seed automático falla para alguna colección
- THEN el sistema MUST registrar el error sin revertir la creación del owner
- AND el Admin SHOULD poder disparar el seed manualmente

### Requirement: Owner Isolation

El sistema MUST garantizar que un Owner no pueda ver ni modificar datos de otro Owner. Cada colección de precios MUST filtrar por el campo `owner` del usuario autenticado.

#### Scenario: Owner intenta leer precios de otro tenant

- GIVEN dos Owners (A y B) con sus propios registros de precios
- WHEN el Owner A consulta la colección PaperPrices
- THEN solo recibe sus propios registros
- AND los registros del Owner B no aparecen en la respuesta

### Requirement: Owner Deletion

El Admin MUST poder eliminar un Owner. Al hacerlo, SHOULD eliminarse en cascada todos sus registros de precios y Sellers asociados.

#### Scenario: Eliminación de owner

- GIVEN el Admin selecciona un Owner existente para eliminar
- WHEN confirma la eliminación
- THEN el Owner es eliminado
- AND todos sus PaperPrices, InkPrices, ProfitMargins, BindingPrices, Counters y Sellers son eliminados
