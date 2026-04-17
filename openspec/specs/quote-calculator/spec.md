# quote-calculator Specification

## Purpose

Formulario de cotización en tiempo real. Permite configurar un trabajo de impresión y ver el precio calculado al instante antes de agregarlo a la tabla de trabajos.

## Requirements

### Requirement: Real-time Price Calculation

El sistema MUST recalcular el precio total cada vez que el usuario cambia cualquier parámetro del trabajo. La fórmula MUST ser:

```
hojas = side === 'dobleFaz' ? páginas / 2 : páginas
costo_papel = precio_hoja[tamaño][gramaje] × hojas
costo_tinta = precio_tinta[formato][porcentaje] × páginas  (×2 si tamaño === 'a3')
costo_impresión = costo_papel + costo_tinta
precio_impresión = roundedPrice(costo_impresión × margen[formato][rango_páginas])
precio_total = precio_impresión + precio_anillado + adicional
```

#### Scenario: Cálculo básico B/N sin anillado

- GIVEN los precios del tenant están cargados
- WHEN el usuario ingresa 10 páginas, tamaño A4, gramaje 75g, formato B/N, simple faz
- THEN el precio se muestra en tiempo real aplicando el margen correspondiente al rango 10-49

#### Scenario: Color requiere porcentaje

- GIVEN el usuario selecciona formato "color"
- WHEN no selecciona porcentaje de cobertura
- THEN el botón "Agregar" MUST estar deshabilitado
- AND se muestra un mensaje indicando que el porcentaje es requerido

#### Scenario: Doble faz reduce hojas

- GIVEN 10 páginas con doble faz seleccionado
- WHEN el sistema calcula el costo de papel
- THEN usa 5 hojas para el cálculo del papel (pero 10 páginas para la tinta)

### Requirement: Work Table

El sistema MUST mantener una tabla de trabajos en sesión. Cada trabajo agregado MUST mostrar sus parámetros y precio. El usuario MUST poder editar y eliminar trabajos de la tabla.

#### Scenario: Agregar trabajo a la tabla

- GIVEN el formulario tiene valores válidos y precio calculado
- WHEN el usuario presiona "Agregar"
- THEN el trabajo aparece en la tabla con sus specs y precio
- AND el formulario se resetea a valores vacíos

#### Scenario: Eliminar trabajo de la tabla

- GIVEN la tabla tiene al menos un trabajo
- WHEN el usuario presiona el ícono de eliminar en una fila
- THEN el trabajo es removido de la tabla
- AND el subtotal total se recalcula

#### Scenario: Tabla vacía

- GIVEN no hay trabajos en la tabla
- THEN se muestra una ilustración de estado vacío

### Requirement: Configurator Options

El sistema MUST derivar las opciones disponibles en el cotizador (tamaños, gramajes, formatos, porcentajes, rangos de anillado) exclusivamente de los registros de precio configurados por el tenant. El cotizador MUST NOT mostrar una opción que no tenga precio configurado. Cuando el usuario selecciona un valor, los selectores dependientes MUST actualizarse para mostrar solo las sub-opciones con precio disponible para esa selección.

#### Scenario: Opciones filtradas por tenant

- GIVEN un Seller del Owner A inicia sesión
- WHEN el cotizador carga
- THEN las opciones y precios corresponden únicamente al Owner A

#### Scenario: Gramaje no disponible para un tamaño

- GIVEN el Owner A tiene precio para A4+75g y A4+80g, pero NO para A3+75g
- WHEN el usuario selecciona tamaño "A3"
- THEN el selector de gramaje NO muestra "75g" como opción
- AND solo muestra los gramajes con precio configurado para A3

#### Scenario: Formato sin precio configurado

- GIVEN el Owner A no tiene ningún InkPrice para formato "color"
- WHEN el cotizador carga
- THEN "color" no aparece como opción de formato seleccionable
