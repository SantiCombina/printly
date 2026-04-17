# price-configuration Specification

## Purpose

Gestión de las tablas de precios por tenant: papel, tinta, márgenes de ganancia y anillado. Cada Owner tiene sus propios valores independientes.

## Requirements

### Requirement: Paper Prices per Tenant

El sistema MUST mantener precios de papel por combinación de tamaño × gramaje, asociados a un Owner. Los valores de tamaño y gramaje son strings libres — el Owner MAY configurar cualquier combinación. No existe una lista fija de opciones válidas; las opciones disponibles en el cotizador se derivan de los registros existentes del tenant.

#### Scenario: Owner actualiza precio de papel

- GIVEN un Owner autenticado con registros de PaperPrices existentes
- WHEN modifica el precio de una combinación tamaño/gramaje
- THEN el nuevo precio es guardado para ese Owner
- AND los precios de otros Owners no se modifican

#### Scenario: Acceso de lectura desde el cotizador

- GIVEN un Seller autenticado cuyo owner es el Owner A
- WHEN el cotizador carga la configuración de precios
- THEN solo recibe los PaperPrices del Owner A

### Requirement: Ink Prices per Tenant

El sistema MUST mantener precios de tinta por formato (blancoNegro, color) y porcentaje de cobertura (10%, 50%, 100% — solo para color), asociados a un Owner.

#### Scenario: Owner actualiza costo de tinta color

- GIVEN un Owner con registros de InkPrices
- WHEN modifica el precio de color al 50%
- THEN solo ese registro cambia para ese tenant

### Requirement: Profit Margins per Tenant

El sistema MUST mantener márgenes de ganancia por formato × rango de páginas (1, 2, 3-9, 10-49, 50-99, 100-499, 500+), asociados a un Owner. El margen es un multiplicador sobre el costo de impresión.

#### Scenario: Margen diferente por rango de páginas

- GIVEN un Owner con márgenes distintos para "1 página" y "10-49 páginas"
- WHEN el cotizador calcula el precio para 1 página vs 20 páginas
- THEN aplica el multiplicador correcto según el rango

### Requirement: Binding Prices per Tenant

El sistema MUST mantener precios de anillado por rango de hojas (1-99, 100-199, 200-499, 500+), asociados a un Owner.

#### Scenario: Owner sin configuración de anillado

- GIVEN un Owner cuyo precio de anillado para un rango es 0
- WHEN el cotizador calcula un trabajo con anillado en ese rango
- THEN el costo de anillado contribuye $0 al total
