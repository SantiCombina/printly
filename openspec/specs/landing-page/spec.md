# landing-page Specification

## Purpose

Página pública comercial del producto Printly SaaS. Visible sin autenticación. Comunica el valor del producto a potenciales clientes (dueños de imprentas).

## Requirements

### Requirement: Public Accessibility

La landing page en `/` MUST ser accesible sin autenticación. Un usuario autenticado que visite `/` SHOULD ser redirigido a `/app`.

#### Scenario: Visita sin sesión

- GIVEN un usuario no autenticado
- WHEN navega a `/`
- THEN ve la landing page completa sin redirección

#### Scenario: Visita con sesión activa

- GIVEN un usuario autenticado (owner o seller)
- WHEN navega a `/`
- THEN es redirigido a `/app`

### Requirement: Content Sections

La landing page MUST incluir: hero con propuesta de valor, sección de features del producto, sección de pricing con al menos un plan, y CTA de contacto/onboarding.

#### Scenario: Sección de pricing visible

- GIVEN un visitante en la landing page
- WHEN hace scroll hasta la sección de pricing
- THEN ve los planes disponibles con sus características y precio

### Requirement: Design

La landing page MUST usar el sistema de diseño "Ethereal Architect": tipografía Inter, paleta indigo/emerald, sin bordes de 1px, tonal layering para secciones.
