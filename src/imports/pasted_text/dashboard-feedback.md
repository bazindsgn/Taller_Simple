Está bastante bien encaminado. Este dashboard ya tomó muchas de las mejores ideas que veníamos hablando: **OT como acción principal, agenda visible, métricas accionables, alertas y navegación lateral clara**. No lo cambiaría desde cero; lo ajustaría para que sea todavía más operativo.

## Lo que está muy bien

El botón **“Ingresar nueva OT”** en el sidebar y **“Crear nueva OT”** arriba a la derecha están perfectos. La acción principal aparece temprano y con jerarquía.

La estructura del dashboard funciona bien:

**Resumen superior → métricas → agenda → alertas → datos secundarios**

Eso es correcto para un taller, porque el usuario entra y entiende rápido qué tiene que hacer.

También está bien que la agenda tenga acciones como **“+ Crear OT”** directamente desde un turno. Eso refuerza el flujo:

**Turno → Patente → Cliente/Vehículo → OT**

La sección **“Requiere atención”** es una muy buena decisión. Es más útil que un gráfico decorativo, porque le dice al usuario qué resolver.

---

## Lo que mejoraría

### 1. Subir “Órdenes de trabajo activas”

Veo que la sección **Órdenes de trabajo activas** queda apenas cortada abajo. Para mí debería estar más arriba o más visible, porque junto con la agenda es lo más importante del dashboard.

El orden ideal sería:

1. Header + buscador + crear OT.
2. Métricas rápidas.
3. Agenda de hoy.
4. Órdenes activas.
5. Requiere atención.
6. Métricas secundarias como ingresos, stock, OTs cerradas.

Ahora mismo “Requiere atención” tiene mucho espacio central y las OTs activas quedan debajo del fold. Yo haría que **Agenda de hoy** y **Órdenes activas** sean los dos bloques principales.

---

### 2. Hacer las cards más accionables

Las cards están bien, pero deberían sentirse clickeables. Por ejemplo:

* **OTs en proceso** → abrir listado filtrado de OTs en proceso.
* **Presupuestos pendientes** → abrir OTs con presupuesto pendiente.
* **Turnos de hoy** → abrir calendario filtrado al día actual.
* **Stock bajo mínimo** → abrir repuestos con stock bajo.

Podrían tener un pequeño texto tipo:

**Ver órdenes →**
**Ver presupuestos →**
**Ver agenda →**

---

### 3. Mejorar “Requiere atención”

Está muy bien, pero lo haría más concreto y orientado a acción.

Ejemplo:

**1 presupuesto en espera**
Pendiente de aprobación del cliente
Botón: **Ver OT**

**2 turnos sin OT creada**
Hay turnos de hoy sin orden de trabajo
Botón: **Crear OT desde turno**

Ahora dice “Ver presupuestos” y “Crear OT”, pero como la lógica es que todo gire alrededor de la OT, conviene que la acción sea más específica:

**Ver OT relacionada**
**Crear OT desde turno**

---

### 4. Agregar estado de Google Calendar

Como necesitás calendario asociado a Google, agregaría en la card de agenda o arriba del bloque un indicador sutil:

**Google Calendar conectado**

o, si no está conectado:

**Conectar Google Calendar**

También sumaría un botón secundario:

**Sincronizar**

No tiene que ser protagonista, pero sí estar visible para que el usuario entienda que la agenda está conectada.

---

### 5. Unificar “Presupuestos” con OT

En el sidebar aparece **Presupuestos** como sección propia. Está bien que exista como consulta, pero visualmente la dejaría menos protagónica que **Órdenes de Trabajo**.

En el dashboard, donde dice **Presupuestos pendientes**, debería quedar claro que son presupuestos asociados a OTs.

Podría decir:

**Presupuestos pendientes**
**2 OTs sin aprobar**

o

**2 presupuestos asociados a OTs**

---

### 6. Ajustar jerarquía de la columna derecha

La columna derecha tiene:

* Ingresos del mes.
* OTs cerradas este mes.
* Stock bajo mínimo.

Está bien, pero son datos más secundarios que las OTs activas. Si falta espacio, priorizaría:

1. Agenda de hoy.
2. OTs activas.
3. Requiere atención.
4. Stock bajo.
5. Ingresos / cobranzas.

Porque el usuario primero necesita operar el taller, después revisar performance.

---

## Prompt corto para aplicar mejoras sobre este dashboard

Podés pasárselo así a Figma Make:

```text
Tomar este dashboard actual como base y no rediseñarlo desde cero. La estructura general está bien: sidebar fijo, CTA principal, buscador, cards de métricas, agenda de hoy y sección de requiere atención.

Mejorar el dashboard para que sea todavía más operativo y centrado en la Orden de Trabajo.

Mantener:
- Sidebar actual.
- Botón principal “Ingresar nueva OT”.
- Header “Panel del taller”.
- Buscador por patente, cliente u OT.
- Cards de métricas.
- Agenda de hoy.
- Requiere atención.
- Estética limpia, blanca, con violeta como color principal.

Cambios a realizar:

1. Dar más visibilidad a “Órdenes de trabajo activas”.
Actualmente queda demasiado abajo. Subirla para que aparezca dentro del primer scroll o cerca de Agenda de hoy. Las OTs activas deben ser uno de los bloques principales del dashboard.

2. Hacer que todas las cards sean accionables.
Cada card debe llevar a una vista filtrada:
- OTs en proceso → listado de OTs en proceso.
- OTs ingresadas hoy → listado filtrado del día.
- Presupuestos pendientes → OTs con presupuesto pendiente.
- Turnos de hoy → calendario del día.
- Listos para entregar → OTs listas para entrega.
- Stock bajo → repuestos con stock bajo.

3. Mejorar “Requiere atención”.
Cada alerta debe tener una acción concreta vinculada a una OT:
- “Ver OT”
- “Crear OT desde turno”
- “Completar datos”
- “Ver presupuesto asociado”

Evitar acciones genéricas como “Ver presupuestos” si no queda claro que pertenecen a una OT.

4. Agregar estado de Google Calendar dentro del bloque Agenda de hoy.
Mostrar:
- “Google Calendar conectado”
o
- “Conectar Google Calendar”

Agregar acción secundaria:
- “Sincronizar”

5. En Agenda de hoy, mantener los turnos con hora, patente, cliente y servicio.
Si el turno ya tiene OT, mostrar acción “Ver OT”.
Si todavía no tiene OT, mostrar acción “Crear OT desde turno”.

6. Aclarar que los presupuestos siempre están asociados a OTs.
Donde diga “Presupuestos pendientes”, usar microcopy como:
“2 OTs con presupuesto pendiente”
o
“2 presupuestos asociados a OTs sin aprobar”.

7. Mantener el dashboard como pantalla operativa, no decorativa.
Priorizar:
- Crear nueva OT.
- Ver agenda.
- Ver OTs activas.
- Resolver pendientes.
- Acceder rápido a clientes, vehículos, presupuestos y stock.

No agregar pop ups. Todas las acciones deben abrir secciones, páginas o estados dentro de la interfaz.
```

En resumen: **el dashboard ya está bueno**. Lo más importante ahora es subir la presencia de **Órdenes activas**, hacer todo más clickeable y dejar más clara la conexión **Agenda → OT → Presupuesto / Factura / WhatsApp**.
