# job-actions Specification

## Purpose

Acciones sobre la tabla de trabajos acumulados: registrar como venta o generar presupuesto. Ambas acciones incrementan contadores diarios por tenant.

## Requirements

### Requirement: Register Sale

El sistema MUST permitir registrar la tabla de trabajos actual como una venta. Al hacerlo MUST incrementar el contador de ventas del día para el tenant correspondiente.

#### Scenario: Registro de venta exitoso

- GIVEN la tabla de trabajos tiene al menos un trabajo
- WHEN el usuario presiona "Registrar Venta"
- THEN el contador de ventas del tenant para el día actual se incrementa en 1
- AND la tabla de trabajos se limpia

#### Scenario: Tabla vacía al intentar registrar venta

- GIVEN la tabla de trabajos está vacía
- WHEN el usuario presiona "Registrar Venta"
- THEN la acción es bloqueada
- AND se muestra un mensaje de error indicando que no hay trabajos

### Requirement: Register Budget

El sistema MUST permitir generar un presupuesto a partir de la tabla de trabajos. Al hacerlo MUST incrementar el contador de presupuestos del día para el tenant.

#### Scenario: Generación de presupuesto exitosa

- GIVEN la tabla de trabajos tiene al menos un trabajo
- WHEN el usuario presiona "Generar Presupuesto"
- THEN el contador de presupuestos del tenant para el día actual se incrementa en 1
- AND la tabla de trabajos se limpia

### Requirement: Daily Counters per Tenant

El sistema MUST mantener contadores diarios independientes por tenant (salesCount, budgetsCount). El día MUST determinarse por fecha en formato DD-MM-YYYY. Si no existe un registro para el día actual, MUST crearse automáticamente al primer incremento.

#### Scenario: Primer registro del día

- GIVEN no existe un Counter para el tenant en la fecha de hoy
- WHEN se registra la primera venta del día
- THEN se crea un nuevo Counter con salesCount=1 y budgetsCount=0

#### Scenario: Contadores aislados entre tenants

- GIVEN el Owner A registra 3 ventas y el Owner B registra 1 venta en el mismo día
- WHEN se consultan los contadores del día
- THEN el counter del Owner A muestra salesCount=3
- AND el counter del Owner B muestra salesCount=1
