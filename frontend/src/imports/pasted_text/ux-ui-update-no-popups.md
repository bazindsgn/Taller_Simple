# Actualización UX/UI: eliminar pop ups innecesarios y validar dentro de la misma página

Modificar el flujo general para que el sistema deje de usar pop ups o modales para acciones comunes. No usar pop ups para ingresar clientes, vehículos, órdenes de trabajo o presupuestos. La experiencia debe resolverse dentro de la misma página, con cambios de estado, cards, mensajes en línea, secciones desplegables o paneles internos.

Los pop ups solo deberían usarse en casos realmente necesarios, como confirmaciones destructivas: eliminar, cancelar una operación importante o salir sin guardar cambios.

---

## Nueva regla de interacción

Cuando el usuario quiera crear una nueva OT, cliente o vehículo, no mostrar primero una pantalla separada únicamente para consultar la patente.

En su lugar, mostrar directamente el **formulario completo**, pero hacer que el primer campo obligatorio sea:

**Patente**

El sistema debe chequear la patente dentro del mismo formulario, sin abrir un modal.

---

## Flujo actualizado para Nueva OT

Cuando el usuario haga clic en:

**+ Crear nueva OT**

o

**+ Ingresar nueva OT**

Debe abrirse directamente la pantalla/formulario completo de nueva Orden de Trabajo.

La primera sección del formulario debe ser:

**Datos del vehículo**

Y el primer campo debe ser:

**Patente**

Placeholder:

**Ej: AA123BB**

Texto de ayuda:

**Ingresar sin espacios**

---

## Validación de patente dentro del formulario

Cuando el usuario ingresa la patente, el sistema debe chequear en la misma pantalla si ya existe.

Este chequeo puede activarse:

* Al terminar de escribir.
* Al salir del campo.
* O mediante una pequeña acción junto al campo: **Verificar patente**.

No abrir pop ups.

---

## Caso A: la patente no existe

Si la patente no existe, mostrar un mensaje en línea debajo del campo:

**Patente disponible. Podés continuar con el alta del vehículo y la creación de la OT.**

Después de ese mensaje, permitir que el usuario continúe completando el resto del formulario:

* Datos del vehículo.
* Datos del cliente.
* Datos de la OT.
* Presupuesto asociado, si corresponde.

El botón principal debe quedar habilitado cuando los datos obligatorios estén completos.

---

## Caso B: la patente ya existe

Si la patente ya existe, no permitir duplicar el vehículo ni crear otro cliente innecesario asociado a esa misma patente.

Mostrar una card o aviso dentro del mismo formulario, justo debajo del campo patente:

**Esta patente ya está registrada**

Mostrar los datos disponibles:

* Patente.
* Marca.
* Modelo.
* Cliente asociado.
* Datos principales del cliente, si existen.

Acciones sugeridas:

* Botón principal: **Crear OT para este vehículo**
* Botón secundario: **Ver historial de OTs**
* Botón terciario o link: **Cambiar patente**

No mostrar un pop up. No usar el botón genérico “Aceptar”.

El usuario debe entender claramente que esa patente ya pertenece a un vehículo/cliente existente y que puede continuar creando una nueva OT usando esos datos, sin volver a cargarlos.

---

## Caso C: patente con datos incompletos

Si la patente existe pero faltan datos del cliente o del vehículo, mostrar un aviso en línea:

**Encontramos esta patente, pero hay datos incompletos. Completalos para continuar con la OT.**

En ese caso, mantener el formulario en la misma pantalla y permitir completar solamente los campos faltantes.

---

## Ingreso de clientes sin pop ups

Para la sección Clientes, aplicar la misma lógica.

Cuando el usuario quiera ingresar un cliente nuevo, no abrir un modal. La misma página debe transformarse en un formulario de alta o edición.

Usar una estructura clara:

* Header de la página.
* Botón para volver al listado.
* Formulario completo.
* Mensajes de validación en línea.
* Botones fijos o visibles para guardar/cancelar.

Evitar ventanas emergentes para cargar datos.

---

## Comportamiento de la página

La página debe cambiar de estado sin sacar al usuario del contexto.

Ejemplos:

* De listado de clientes a formulario de nuevo cliente.
* De listado de OTs a formulario de nueva OT.
* De formulario vacío a formulario con datos encontrados.
* De patente existente a card con acciones.
* De patente inexistente a formulario habilitado para completar.

Todo debe suceder dentro de la misma página.

---

## Reglas visuales para los mensajes en línea

Los mensajes de validación deben ser claros, visibles y ubicados cerca del campo correspondiente.

Usar estados visuales consistentes:

* Estado neutral: antes de verificar.
* Estado verificando: mientras consulta.
* Estado correcto: patente disponible.
* Estado de advertencia: patente ya existente.
* Estado de error: formato incorrecto o dato obligatorio faltante.

Evitar mensajes genéricos. Usar textos accionables.

Ejemplos:

En vez de:

**Error**

Usar:

**La patente ya está registrada. Podés crear una OT para este vehículo existente.**

En vez de:

**Aceptar**

Usar:

**Crear OT para este vehículo**

En vez de:

**Vehículo no existe**

Usar:

**Patente disponible. Completá los datos para continuar.**

---

## Actualización del formulario de Nueva OT

La pantalla de Nueva OT debe mostrar el formulario completo desde el inicio, pero con la patente como primer paso lógico dentro del formulario.

Estructura sugerida:

1. **Datos del vehículo**

   * Patente como primer campo.
   * Validación en línea de existencia.
   * Marca, modelo, versión, año, color, chasis, motor, código de radio y código de llave.

2. **Datos del cliente**

   * Razón social.
   * Condición fiscal.
   * Teléfono.
   * Email.
   * Dirección.
   * Número.
   * Piso.
   * Departamento.
   * Provincia.
   * Localidad.
   * Código postal.

3. **Datos de la OT**

   * Fecha de ingreso.
   * KM.
   * Servicio.
   * Estado.
   * Total OT.

4. **Presupuesto**

   * Integrado dentro de la OT.
   * Nunca como presupuesto independiente.

---

## Objetivo de esta mejora

El objetivo es que el sistema se sienta más fluido y menos interrumpido.

La interfaz debe evitar depender de modales para cada acción. El usuario debe poder trabajar en una misma pantalla, entender qué está pasando y continuar sin perder contexto.

La validación de patente debe integrarse naturalmente dentro del formulario, no como un paso previo separado ni como un pop up.
