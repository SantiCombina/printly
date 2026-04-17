# owner-settings Specification

## Purpose

Panel visual en `/app/settings` que permite al Owner gestionar todas sus configuraciones de precio: papel, tinta, márgenes de ganancia y anillado. CRUD completo de combinaciones — el owner puede agregar nuevas, editar existentes y eliminar las que no use.

## Requirements

### Requirement: Price CRUD

El owner MUST poder crear, editar y eliminar registros en las 4 colecciones de precio (PaperPrices, InkPrices, ProfitMargins, BindingPrices) desde una interfaz visual, sin acceder al panel Payload.

#### Scenario: Agregar nueva combinación de papel

- GIVEN el owner está en `/app/settings`
- WHEN completa el formulario con un tamaño, gramaje y precio nuevos y confirma
- THEN el registro es creado en PaperPrices con el `owner` del usuario autenticado
- AND la nueva combinación aparece disponible en el cotizador

#### Scenario: Editar precio existente

- GIVEN el owner ve la tabla de precios de papel con registros existentes
- WHEN modifica el valor de precio de una fila y guarda
- THEN el registro se actualiza en la base de datos
- AND el cotizador refleja el nuevo precio (cache invalidado)

#### Scenario: Eliminar combinación

- GIVEN el owner tiene una combinación de precio que ya no usa
- WHEN la elimina desde la interfaz
- THEN el registro es eliminado
- AND esa combinación deja de aparecer en el cotizador

### Requirement: Settings Navigation

El panel MUST tener navegación entre secciones: Precios de Papel, Precios de Tinta, Márgenes de Ganancia, Precios de Anillado, Vendedores.

#### Scenario: Navegación entre secciones

- GIVEN el owner está en `/app/settings`
- WHEN selecciona la sección "Márgenes de Ganancia"
- THEN se muestra la tabla de ProfitMargins del tenant sin recargar la página

### Requirement: Data Isolation

El owner MUST ver y poder modificar únicamente sus propios registros. La UI MUST NOT mostrar ni permitir acceso a datos de otros tenants.

#### Scenario: Solo datos del tenant

- GIVEN el Owner A tiene 5 registros de PaperPrices y el Owner B tiene 3
- WHEN el Owner A accede a `/app/settings`
- THEN solo ve sus 5 registros
