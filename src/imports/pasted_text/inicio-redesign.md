Rediseñá la pantalla actual de **Inicio** de mi sistema de gestión de taller, tomando como base la interfaz actual que ya está creada. No rediseñar todo desde cero: mantener la identidad visual general, el sidebar, el color violeta principal, las cards blancas, los bordes suaves y la estética limpia.

El objetivo es **simplificar el Inicio para que sea más fácil de usar por talleristas**, priorizando la funcionalidad y reduciendo la carga mental. La pantalla debe ser directa, clara y operativa. El usuario no debería tener que pensar demasiado para entender qué hacer.

La idea principal es:

**Entrar al sistema → crear OT / buscar algo / ver qué hay que hacer hoy.**

---

# Objetivo del rediseño

Transformar el Inicio en una pantalla simple de trabajo diario para talleristas.

Priorizar:

* Crear una nueva Orden de Trabajo.
* Buscar por patente, cliente u OT.
* Ver turnos de hoy.
* Ver órdenes de trabajo activas.
* Ver pendientes importantes.
* Acceder rápido a funciones principales.

Reducir o quitar elementos que sean más analíticos, administrativos o secundarios.

No convertir el Inicio en una pantalla de estadísticas. Las estadísticas deben quedar en su sección correspondiente.

---

# Jerarquía principal del Inicio

Organizar la pantalla con esta prioridad:

1. **Crear nueva OT**
2. **Buscar por patente, cliente u OT**
3. **Agenda de hoy**
4. **Órdenes de trabajo activas**
5. **Requiere atención**
6. Accesos secundarios simples

La pantalla debe responder rápido:

* ¿Qué vehículo entra hoy?
* ¿Qué OTs están activas?
* ¿Qué tengo pendiente?
* ¿Dónde creo una nueva OT?
* ¿Dónde busco una patente?

---

# Bloque superior

Mantener un bloque superior simple con:

Título:

**Inicio**

o

**Panel del taller**

Subtítulo corto:

**Gestioná el trabajo diario del taller desde un solo lugar.**

Acción principal muy visible:

**+ Crear nueva OT**

Este botón debe ser el elemento más importante de la pantalla.

El buscador debe estar cerca del botón principal y debe ser fácil de entender.

Placeholder:

**Buscar por patente, cliente u OT**

El buscador debe ser grande, claro y usable.

---

# Simplificar las cards de métricas

Actualmente hay varias cards: OTs en proceso, OTs ingresadas hoy, presupuestos pendientes, turnos de hoy, listos para entregar, etc.

Reducir la cantidad de cards visibles en el Inicio para no saturar.

Dejar solo las más operativas:

* **OTs activas**
* **Turnos de hoy**
* **Pendientes**
* **Listos para entregar**

No mostrar cards que sean más analíticas o financieras en el Inicio, como ingresos del mes, cobranzas o métricas generales. Esas pueden ir a Estadísticas o Cobranzas.

Cada card debe ser accionable, con texto simple:

* **Ver órdenes**
* **Ver agenda**
* **Resolver pendientes**
* **Ver entregas**

Usar números grandes, títulos cortos y acciones claras.

Ejemplo:

**2**
**OTs activas**
Ver órdenes →

---

# Agenda de hoy

Mantener la sección **Agenda de hoy**, pero hacerla más simple y directa.

Debe mostrar:

* Hora.
* Patente.
* Cliente.
* Motivo o servicio.
* Acción.

Cada turno debe tener solo una acción principal:

Si ya tiene OT:

**Ver OT**

Si no tiene OT:

**Crear OT**

Evitar textos largos o múltiples acciones por fila.

Mostrar también el estado de Google Calendar de forma sutil:

**Google Calendar conectado**

y acción secundaria:

**Sincronizar**

No hacer que Google Calendar compita visualmente con la agenda. Debe ser información de apoyo.

---

# Órdenes de trabajo activas

La sección **Órdenes de trabajo activas** debe tener mucha importancia.

Debe estar visible en el primer scroll, junto a Agenda de hoy o inmediatamente debajo.

Mostrar una tabla simple con pocas columnas:

* OT
* Patente
* Cliente
* Servicio
* Estado
* Acción

Evitar demasiadas columnas como presupuesto, importe o datos secundarios si generan ruido visual.

La acción principal de cada fila debe ser:

**Ver OT**

El objetivo es que el tallerista vea rápido qué autos están en trabajo y pueda entrar a cada OT.

---

# Requiere atención

Simplificar la sección **Requiere atención** para que sea una lista de tareas concretas, no un bloque grande ni ambiguo.

Mostrar solo pendientes accionables, por ejemplo:

* **2 turnos sin OT creada**
* **1 presupuesto pendiente de aprobación**
* **1 vehículo listo para entregar**
* **2 OTs con datos incompletos**

Cada pendiente debe tener una acción clara:

* **Crear OT**
* **Ver OT**
* **Completar datos**
* **Ver entrega**

Evitar textos largos. Usar frases cortas y directas.

---

# Accesos rápidos simples

Agregar o mantener accesos rápidos, pero sin convertir el Inicio en una botonera gigante.

Accesos recomendados:

* **Nueva OT**
* **Ver OTs**
* **Agenda**
* **Clientes**
* **Repuestos / Stock**

No mostrar demasiadas opciones administrativas en Inicio.

Opciones como estadísticas, configuración, marcas y modelos, servicios, textos o usuarios deben quedar en el menú lateral o en configuración, no como protagonistas del Inicio.

---

# Sidebar

Mantener el sidebar, pero simplificar la jerarquía visual.

Orden sugerido:

1. **Inicio**
2. **Ingresar nueva OT**
3. **Órdenes de Trabajo**
4. **Calendario**
5. **Clientes**
6. **Repuestos / Stock**
7. **Presupuestos**
8. **Estadísticas**
9. **Cobranzas**
10. **Configuración**
11. **Papelera**

La sección Presupuestos debe sentirse secundaria, porque los presupuestos siempre están asociados a una OT.

El botón **Ingresar nueva OT** debe seguir destacado en el sidebar.

---

# Lenguaje y microcopy

Usar lenguaje simple, directo y cotidiano para talleristas.

Evitar textos largos, técnicos o demasiado administrativos.

Preferir:

**Crear OT**

en lugar de:

**Generar nueva orden de trabajo**

Preferir:

**Ver órdenes**

en lugar de:

**Consultar órdenes de trabajo activas**

Preferir:

**Pendientes**

en lugar de:

**Requiere atención operacional**

Preferir:

**Listos para entregar**

en lugar de:

**Unidades con proceso finalizado pendiente de egreso**

La interfaz debe sentirse práctica, no burocrática.

---

# Reducir carga visual

Aplicar estas reglas:

* Menos cards visibles.
* Menos columnas en tablas.
* Menos textos descriptivos.
* Más espacio entre bloques.
* Más jerarquía entre acciones.
* Botones principales claros.
* Acciones secundarias más discretas.
* Nada de gráficos decorativos en Inicio.
* Nada de métricas financieras en Inicio, salvo que sean necesarias para la operación diaria.
* Evitar repetir acciones.
* Evitar que haya muchos links azules compitiendo entre sí.

---

# Estructura sugerida del nuevo Inicio

Diseñar el Inicio con esta estructura:

## 1. Header operativo

Título:

**Inicio**

Subtítulo:

**Gestioná el trabajo diario del taller desde un solo lugar.**

Botón principal:

**+ Crear nueva OT**

Buscador:

**Buscar por patente, cliente u OT**

---

## 2. Cards rápidas

Mostrar solo 4 cards:

* **OTs activas**
* **Turnos de hoy**
* **Pendientes**
* **Listos para entregar**

Cada una con número grande y acción corta.

---

## 3. Zona principal

Dividir en dos columnas:

### Columna izquierda

**Agenda de hoy**

Lista simple de turnos.

Cada turno con:

* Hora.
* Patente.
* Cliente.
* Servicio.
* Acción: Ver OT / Crear OT.

### Columna derecha

**Órdenes activas**

Tabla simple con:

* OT.
* Patente.
* Cliente.
* Estado.
* Acción: Ver OT.

---

## 4. Pendientes

Debajo, mostrar una sección simple:

**Pendientes**

Con lista corta de tareas accionables.

Ejemplo:

* **2 turnos sin OT** — Crear OT
* **1 presupuesto pendiente** — Ver OT
* **1 vehículo listo para entregar** — Ver entrega

---

# No usar pop ups

No usar pop ups para acciones comunes.

No usar pop ups para:

* Crear OT.
* Crear cliente.
* Crear turno.
* Crear presupuesto.
* Validar patente.
* Ver errores simples.
* Enviar WhatsApp.
* Exportar PDF.

Todo debe resolverse dentro de la misma página o navegando a una pantalla clara.

Solo usar confirmaciones para acciones destructivas, como eliminar o salir sin guardar.

---

# Mantener la lógica central del sistema

La Orden de Trabajo sigue siendo el centro del sistema.

Todo debe girar alrededor de la OT:

* La agenda puede crear una OT.
* El cliente puede tener OTs.
* El vehículo se identifica por patente.
* El presupuesto vive dentro de la OT.
* La factura vive dentro de la OT.
* El PDF se exporta desde la OT.
* WhatsApp se envía desde la OT.

No crear flujos paralelos innecesarios.

---

# Resultado esperado

Quiero un Inicio más simple, más directo y más fácil de usar para talleristas.

Debe sentirse como una pantalla de trabajo diario, no como un dashboard complejo.

El usuario debe poder hacer rápidamente estas acciones:

* Crear una nueva OT.
* Buscar una patente.
* Ver turnos de hoy.
* Entrar a una OT activa.
* Resolver pendientes.
* Ver qué vehículos están listos para entregar.

Priorizar funcionalidad, claridad y velocidad por encima de estética decorativa o exceso de información.
