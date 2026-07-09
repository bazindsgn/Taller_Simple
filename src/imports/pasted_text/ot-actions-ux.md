# Acciones principales dentro de la Orden de Trabajo

Dentro de cada Orden de Trabajo deben estar disponibles las acciones principales del flujo del taller. La OT debe funcionar como el centro desde donde se arma, se revisa, se exporta y se envía toda la documentación asociada.

Agregar dentro de la pantalla de OT una zona clara de acciones, preferentemente en el header de la OT o en una barra lateral/resumen fijo.

Las acciones principales deben ser:

* **Armar presupuesto**
* **Armar factura**
* **Exportar PDF**
* **Enviar por WhatsApp al cliente**

Estas acciones no deben abrir pop ups innecesarios. Deben resolverse dentro de la misma página, usando pestañas, secciones internas, paneles dentro de la OT o cambios de estado en el contenido.

---

## Ubicación sugerida

En la pantalla de detalle de una OT, crear un header operativo con:

**OT #0000 — Patente — Cliente**

Debajo o a la derecha, mostrar acciones rápidas:

**Armar presupuesto**
**Armar factura**
**Exportar PDF**
**Enviar por WhatsApp**

Estas acciones deben estar visibles y ser fáciles de encontrar, porque forman parte del trabajo diario del taller.

---

## Presupuesto dentro de la OT

La acción **Armar presupuesto** debe abrir o activar la sección interna de presupuesto dentro de la misma OT.

No debe existir presupuesto independiente.

El presupuesto debe estar asociado obligatoriamente a esa OT.

Si la OT todavía no tiene presupuesto, mostrar un estado vacío claro:

**Esta OT todavía no tiene presupuesto.**

Acción principal:

**Armar presupuesto para esta OT**

Si ya tiene presupuesto, mostrar:

* Estado del presupuesto.
* Ítems o conceptos cargados, si ya existen en el sistema.
* Total.
* Acciones para editar, exportar o enviar.

No crear campos nuevos si no existen. Reorganizar las opciones actuales del presupuesto dentro de la OT.

---

## Factura dentro de la OT

Agregar la acción:

**Armar factura**

La factura también debe estar asociada a la OT. No debe sentirse como un módulo suelto separado.

Si todavía no hay factura, mostrar dentro de la OT:

**Esta OT todavía no tiene factura generada.**

Acción principal:

**Armar factura para esta OT**

Si ya existe factura, mostrar un resumen dentro de la OT y permitir acceder a sus acciones.

No inventar lógica fiscal nueva. Diseñar la experiencia visual y el flujo de armado usando los datos disponibles del cliente, vehículo, OT y presupuesto.

---

## Exportar PDF

Agregar acción:

**Exportar PDF**

Esta acción debe permitir exportar la documentación asociada a la OT.

Diseñar la experiencia para que el usuario pueda exportar, según corresponda:

* OT completa.
* Presupuesto.
* Factura.
* Resumen de trabajo.

No usar pop up genérico. Si hace falta elegir qué exportar, mostrar opciones dentro de un panel o sección interna de la misma OT.

Ejemplo:

**Exportar PDF**

Opciones:

* **Exportar OT**
* **Exportar presupuesto**
* **Exportar factura**

Usar microcopy claro. Evitar botones genéricos como “Aceptar”.

---

## Enviar por WhatsApp al cliente

Agregar acción:

**Enviar por WhatsApp**

o

**Enviar por WhatsApp al cliente**

Esta acción debe usar el teléfono del cliente asociado a la OT.

Si el cliente tiene teléfono cargado, mostrar una acción clara:

**Enviar presupuesto por WhatsApp**

o

**Enviar documentación por WhatsApp**

Si el cliente no tiene teléfono cargado, mostrar un aviso en línea dentro de la OT:

**Este cliente no tiene teléfono cargado. Agregá un teléfono para poder enviar por WhatsApp.**

No abrir pop ups. Permitir completar o corregir el dato dentro de la misma pantalla.

---

## Barra de acciones de la OT

Diseñar una barra de acciones clara dentro de la OT.

Ejemplo de jerarquía:

Acción principal según estado:

* Si no hay presupuesto: **Armar presupuesto**
* Si hay presupuesto aprobado: **Armar factura**
* Si hay documentación lista: **Exportar PDF**
* Si hay teléfono del cliente: **Enviar por WhatsApp**

Acciones secundarias:

* Editar datos.
* Ver historial.
* Cambiar estado.
* Volver al listado.

La interfaz debe ayudar al usuario a entender cuál es el próximo paso lógico dentro de la OT.

---

## Estados sugeridos dentro de la OT

Mostrar estados visuales simples para entender el avance:

* **Sin presupuesto**
* **Presupuesto en armado**
* **Presupuesto enviado**
* **Presupuesto aprobado**
* **Factura pendiente**
* **Factura generada**
* **PDF exportado**
* **Enviado por WhatsApp**

Usar estos estados solo como referencia visual si encajan con el sistema actual. No inventar lógica compleja si no está implementada.

---

## Regla UX

Todas las acciones importantes deben vivir dentro de la Orden de Trabajo.

La OT debe ser el lugar desde donde el usuario puede:

* Completar datos del vehículo.
* Completar datos del cliente.
* Cargar el trabajo.
* Armar presupuesto.
* Armar factura.
* Exportar PDF.
* Enviar documentación por WhatsApp.
* Ver el estado general del proceso.

No usar pop ups para estas acciones. Mantener todo dentro de la misma página, con secciones internas, cards, validaciones en línea y botones claros.
