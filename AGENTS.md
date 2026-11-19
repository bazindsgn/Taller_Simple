# AGENTS.md — Taller Simple

## 1. Propósito del proyecto

**Taller Simple** es una plataforma web para la gestión integral de talleres de reparación, inicialmente orientada a talleres automotrices y extensible a otros servicios.

El sistema debe centralizar:

* Clientes.
* Vehículos.
* Turnos.
* Presupuestos.
* Órdenes de Trabajo (OT).
* Usuarios, talleres y permisos.
* Stock.
* Caja y movimientos financieros.
* Facturación.
* Comunicación con clientes.
* Portal de cliente.

La documentación funcional y de negocio se encuentra en la **Guía de Desarrollo de Taller Simple**. Esa documentación es la fuente de verdad para requisitos, flujos y decisiones ya tomadas.

---

# 2. Regla principal: no inventar requisitos

Antes de implementar una funcionalidad:

1. Buscar primero en la documentación del proyecto.
2. Revisar el código existente.
3. Revisar los tipos/interfaces del frontend si existen.
4. Identificar decisiones ya tomadas y preguntas abiertas.
5. Si existe una ambigüedad importante, **no inventar una solución como si fuera un requisito confirmado**.

Distinguir siempre entre:

* **Decisión confirmada:** puede implementarse.
* **Requisito documentado:** puede implementarse salvo contradicción posterior.
* **Propuesta/alternativa:** no asumirla como definitiva.
* **Pregunta abierta:** no decidirla unilateralmente.
* **Inferencia técnica:** puede proponerse, pero debe quedar explícita.

Si una decisión abierta bloquea correctamente la implementación, detenerse y pedir confirmación.

---

# 3. Metodología de trabajo

Trabajar siguiendo ciclos:

```text
DISEÑO → DESARROLLO → TEST → IMPLEMENTACIÓN
```

Para cada funcionalidad:

### Antes de modificar código

* Analizar el código existente.
* Identificar archivos afectados.
* Entender dependencias.
* Revisar modelos y relaciones existentes.
* Revisar endpoints y schemas relacionados.
* Revisar el frontend cuando corresponda.
* Proponer el enfoque antes de realizar cambios grandes.

### Durante la implementación

* Hacer cambios pequeños y coherentes.
* Mantener separación de responsabilidades.
* No realizar refactors no relacionados con la tarea.
* No introducir arquitectura innecesariamente compleja.

### Después

* Ejecutar tests relevantes.
* Ejecutar lint/type checking si están configurados.
* Verificar migraciones si se modificó la BD.
* Revisar errores y regresiones.
* Resumir exactamente qué se modificó.

---

# 4. Arquitectura

## 4.1 Principios

El backend debe mantenerse **desacoplado del frontend y de los canales de entrada**.

El mismo dominio debe poder ser utilizado desde:

* Portal web.
* WhatsApp.
* Futuras aplicaciones móviles.
* API pública.

Por ejemplo, la lógica para solicitar un turno debe vivir en el dominio/servicio de turnos y no dentro de un handler específico del frontend o WhatsApp.

```text
Portal ────────┐
               ├──> API / Service ──> Database
WhatsApp ──────┤
               │
App futura ────┘
```

No duplicar lógica de negocio por canal.

---

## 4.2 Arquitectura feature-first

Usar una organización por funcionalidad:

```text
app/
├── feature/
│   ├── clientes/
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── model.py
│   │   └── service.py
│   │
│   ├── vehiculos/
│   ├── turnos/
│   ├── presupuestos/
│   ├── orden_trabajo/
│   ├── stock/
│   ├── caja/
│   ├── facturacion/
│   ├── usuarios/
│   ├── talleres/
│   ├── permisos/
│   ├── auth/
│   └── ...
│
├── integrations/
│   ├── whatsapp/
│   ├── mail/
│   ├── google/
│   └── afip/
│
└── ...
```

La estructura exacta debe adaptarse al código existente.

### No implementar preventivamente

No introducir DDD, CQRS, Hexagonal Architecture, Event Sourcing u otros patrones arquitectónicos complejos únicamente por anticipación.

La guía establece explícitamente:

> No implementar DDD/CQRS/Hexagonal preventivo.

La complejidad debe introducirse solamente cuando exista una necesidad real.

---

# 5. Base de datos

La base de datos prevista es relacional y debe utilizar SQLAlchemy 2.x.

## Reglas

* Usar SQLAlchemy 2.x.
* Preferir `Mapped[...]` y `mapped_column`.
* Mantener relaciones explícitas.
* Utilizar foreign keys reales.
* Crear índices cuando la consulta/uso del dominio lo justifique.
* Usar `Numeric` para dinero, **nunca `float`**.
* Usar timestamps con zona horaria (`timestamptz`) cuando corresponda.
* Las tablas operativas deben estar preparadas para multi-tenancy.

## Multi-taller

Taller Simple es **multi-taller desde el día 1**.

Las entidades operativas deben estar asociadas al taller correspondiente mediante `taller_id`.

No crear una arquitectura inicialmente mono-taller para "migrarla después".

---

# 6. Relaciones importantes

## Cliente ↔ Vehículo

La relación es **N:M real**.

Debe utilizarse:

```text
cliente
vehiculo
cliente_vehiculo
```

Un vehículo puede tener múltiples clientes vinculados:

* titular
* conductor
* autorizado
* empresa
* etc.

Un cliente también puede tener múltiples vehículos.

### Importante

`vehiculo.patente` **NO es UNIQUE**.

No asumir que una patente identifica exclusivamente a un cliente.

---

# 7. Turnos

El flujo de turnos es unificado.

No crear sistemas separados para:

* Mecánica.
* Electricidad.
* Chapa.
* Pintura.
* Gomería.

La especialidad debe modelarse mediante `tipo_turno`.

El catálogo contempla tipos como:

```text
mecánica
electricidad
chapa
pintura
presupuesto
consulta
gomería
lubricentro
otros
```

`tipo_turno` puede contener configuración como:

* `slug`
* `nombre`
* `activo`
* `orden`
* `taller_id`
* `es_mecanica_externa`
* `requiere_diagnostico_previo`
* `gravedad_default`
* `cupo_por_dia`
* `horarios_disponibles`
* `metadata JSONB`

No mover esta información a lógica hardcodeada si corresponde a configuración del taller.

---

# 8. Flujo de turnos

El portal es el canal principal.

WhatsApp funciona como canal de comunicación/notificación y eventualmente como consumidor de los mismos servicios del backend.

El backend debe permanecer agnóstico al canal.

Ejemplo:

```text
POST /turnos/solicitar
```

La lógica de negocio debe poder ser reutilizada independientemente de si la solicitud proviene del portal o de WhatsApp.

## Estados

El sistema contempla, entre otros, estados como:

```text
PENDIENTE_APROBACION
CONFIRMADO
```

No inventar nuevos estados sin necesidad.

---

# 9. Recordatorios

Los recordatorios deben ser configurables por taller.

La configuración se encuentra en:

```text
taller.recordatorio_config
```

El cliente puede tener:

```text
cliente.canal_preferente
```

El canal preferente es nullable.

El comportamiento por defecto documentado es mail T-24h.

La implementación debe permitir evolución hacia:

* Mail.
* WhatsApp.
* Otros canales futuros.

Los recordatorios son un proceso independiente y deben tener ciclo de vida propio.

---

# 10. Autenticación y autorización

Utilizar autenticación basada en JWT.

Roles base documentados:

```text
admin_sistema
admin_taller
gerente
operador
tecnico
cliente
```

La autorización no debe depender únicamente del rol.

El sistema contempla permisos granulares mediante:

```text
permiso
rol_permiso
usuario_permiso
```

Cuando exista un permiso específico para una acción, utilizar el sistema de permisos en lugar de hardcodear:

```python
if user.role == "admin":
    ...
```

No implementar controles de seguridad solamente en frontend.

Toda operación sensible debe validarse en backend.

---

# 11. Seguridad

Nunca:

* Guardar contraseñas en texto plano.
* Guardar secretos en el repositorio.
* Exponer tokens.
* Confiar en permisos enviados por el frontend.
* Usar información proporcionada por el cliente sin validarla.
* Permitir acceso a datos de otro `taller_id`.

Contraseñas:

```text
bcrypt / argon2
```

Datos sensibles como email, teléfono y DNI/CUIT deben tratarse según los requisitos de seguridad documentados.

TLS debe utilizarse en tránsito.

Los secretos deben provenir del entorno/secret manager y no del código.

---

# 12. Modelos, schemas y servicios

Mantener responsabilidades claras:

### `model.py`

Representación persistente de la entidad y relaciones SQLAlchemy.

### `schemas.py`

Entrada/salida de API y validación mediante Pydantic.

### `service.py`

Reglas de negocio y operaciones que no deberían vivir en el router.

### `router.py`

Responsable principalmente de:

* recibir request;
* autenticar/autorización;
* validar dependencias;
* llamar al service;
* devolver response.

Evitar colocar lógica de negocio extensa dentro de los routers.

---

# 13. Endpoints

Los endpoints deben representar recursos y operaciones del dominio.

Ejemplo documentado:

```text
GET   /turnos
PATCH /turnos/{id}
POST  /turnos/solicitar
```

El endpoint no debe convertirse en un contenedor de toda la lógica de negocio.

Cuando exista una operación compleja:

```text
router → service → repository/database
```

No crear capas artificiales si no aportan valor.

---

# 14. Órdenes de Trabajo

La OT es uno de los dominios centrales del sistema.

Debe soportar el flujo general:

```text
Recepción
→ Pendiente
→ Resolución
→ Auto listo
→ Notificación
→ Espera de retiro
→ Entrega
→ Cobro
→ Cierre
```

Los estados documentados incluyen:

```text
SIN INICIAR
EN CURSO
TERCERIZADA
PAUSADA
TERMINADA
NOTIFICADA
CERRADA
```

No asumir que los estados históricos de Google Forms son necesariamente el modelo definitivo si existe una definición más nueva en la documentación.

El flujo WIP de OT debe considerarse sujeto a validación si la documentación todavía lo marca como pendiente.

---

# 15. Presupuestos

Los presupuestos deben contemplar:

* Diagnóstico.
* Ítems.
* Cantidad.
* Valor unitario.
* Valor total.
* Estado.
* Seguimiento.
* Fotos.
* Documentos.
* Relación con cliente.
* Relación con vehículo.
* Relación con OT cuando corresponda.

El seguimiento debe conservar historial.

Las fotos de diagnóstico son opcionales y pueden existir durante el ciclo de vida de cualquier OT.

---

# 16. Stock

Diferenciar:

### Artículos catalogados

Tienen:

* artículo;
* descripción;
* marca;
* cantidad;
* punto de pedido;
* precio unitario;
* proveedor.

Deben tener seguimiento de stock.

### Artículos no catalogados

Se registran como:

```text
Categoría: Varios
Descripción libre
```

No requieren tracking de inventario.

No crear stock ficticio para una compra ocasional.

---

# 17. Caja y dinero

Nunca utilizar `float` para importes monetarios.

Utilizar tipos decimales apropiados, preferentemente:

```text
Numeric / Decimal
```

Los medios de pago son configurables.

La documentación contempla:

```text
Efectivo
Transferencia / CBU
MercadoPago
Cheque
```

pero no asumir que el catálogo debe quedar hardcodeado si existe configuración.

Separar:

* ingresos;
* egresos;
* cuentas receptoras;
* categorías de ingreso;
* categorías de egreso.

El saldo debe poder calcularse a partir de los movimientos.

---

# 18. Facturación

La facturación electrónica debe integrarse de forma desacoplada mediante:

```text
integrations/afip/
```

La integración contempla:

* WSFE.
* WSFEX.
* CAE.
* Generación de PDF.
* Envío al cliente.

No mezclar lógica específica de AFIP con las entidades generales del dominio más de lo necesario.

La facturación es opcional bajo demanda al cerrar una OT.

---

# 19. Integraciones externas

Mantener integraciones aisladas:

```text
app/integrations/
├── whatsapp/
├── mail/
├── google/
└── afip/
```

Las integraciones externas no deben contaminar innecesariamente la lógica del dominio.

Por ejemplo:

```text
turnos.service
      ↓
notification service
      ↓
mail / whatsapp
```

y no:

```text
turnos.service → requests.post("whatsapp-api...")
```

directamente en toda la lógica de negocio.

Las integraciones pueden estar deshabilitadas mediante feature flags cuando corresponda.

---

# 20. Feature flags

El sistema utiliza:

```text
taller.feature_flags_global
```

Los flags globales por taller son controlados por `admin_sistema`.

Las funcionalidades protegidas por feature flag deben pasar por un mecanismo equivalente a:

```text
require_feature
```

No ocultar solamente la UI.

Si una feature está deshabilitada, el backend también debe impedir su utilización.

---

# 21. Frontend

El frontend ya contiene una implementación visual avanzada y debe tratarse como fuente importante para entender:

* estructuras de datos;
* formularios;
* estados;
* flujos;
* nombres de campos;
* interacciones.

Antes de cambiar contratos API:

1. Revisar los componentes que consumen el endpoint.
2. Revisar interfaces/types de TypeScript.
3. Revisar mock data.
4. Revisar formularios.
5. Mantener compatibilidad cuando sea posible.

No reemplazar el diseño del frontend por una interpretación propia.

---

# 22. API y frontend

Mantener contratos explícitos.

Cuando se modifique un schema:

* buscar consumidores;
* buscar tipos TypeScript correspondientes;
* buscar mocks;
* buscar formularios;
* buscar llamadas HTTP;
* actualizar tests.

No cambiar silenciosamente:

```text
nombre de campo
tipo
estado
estructura JSON
```

si eso rompe el contrato existente.

---

# 23. Tests

Los tests deben desarrollarse junto con la funcionalidad.

Priorizar:

### Unit tests

Para:

* reglas de negocio;
* validaciones;
* cálculos;
* transiciones de estado;
* permisos.

### Integration tests

Para:

* endpoints;
* autenticación;
* autorización;
* base de datos;
* relaciones;
* aislamiento por `taller_id`.

### Regression tests

Cuando se corrige un bug, agregar un test que reproduzca el problema cuando tenga sentido.

No eliminar tests simplemente porque fallen después de un cambio.

Primero determinar si:

* el código está incorrecto;
* el test quedó obsoleto;
* el requisito cambió.

---

# 24. Migraciones

Toda modificación estructural de la base de datos debe tener migración.

No modificar manualmente producción sin una migración reproducible.

Antes de crear una migración:

1. Revisar el modelo actual.
2. Revisar migraciones anteriores.
3. Confirmar que el cambio sea necesario.
4. Generar/revisar la migración.
5. Verificar upgrade/downgrade cuando corresponda.

Nunca asumir que la base de datos está vacía.

---

# 25. Multi-tenancy

Este punto es crítico.

Una consulta sobre entidades operativas debe respetar siempre el contexto del taller.

Evitar:

```python
session.get(Cliente, cliente_id)
```

cuando el acceso debe estar limitado por tenant.

Preferir una consulta que compruebe el contexto correspondiente.

Nunca permitir:

```text
taller A → acceder/modificar datos de taller B
```

mediante manipulación de IDs.

Los permisos y filtros de tenant deben aplicarse en backend.

---

# 26. Auditoría

Las acciones administrativas y sensibles deben poder auditarse cuando el dominio lo requiera.

Existe el concepto:

```text
taller_auditoria
```

No implementar un sistema de auditoría gigante preventivamente.

Agregar auditoría donde exista una necesidad funcional, legal o administrativa documentada.

---

# 27. PDFs y documentos

El sistema contempla generación de:

* OT.
* Sub-OT.
* Presupuesto.
* Factura.

La documentación establece que no existe obligación de impresión física.

Priorizar generación digital.

---

# 28. No utilizar los sistemas históricos en producción

Los siguientes elementos pertenecen al relevamiento/prototipo histórico:

* Google Forms.
* Google Sheets.
* Google Calendar como fuente principal.
* Google Sites.
* procesos manuales heredados.

Deben utilizarse únicamente como referencia funcional.

No crear nuevas funcionalidades productivas que dependan directamente de ellos cuando exista una implementación propia de Taller Simple.

Google Calendar puede permanecer como integración opcional.

---

# 29. Preguntas abiertas

Hay decisiones que la documentación marca explícitamente como abiertas o parcialmente decididas.

Entre ellas:

* Q-16: onboarding SaaS / registro y activación de talleres.
* Q-17.
* Q-UI-01.

No resolverlas unilateralmente si la implementación depende de una decisión funcional.

Si es necesario avanzar parcialmente, implementar únicamente la parte que esté confirmada y dejar aislado el punto pendiente.

---

# 30. Priorización

No intentar construir todo el sistema simultáneamente.

La implementación debe avanzar incrementalmente por prioridad.

Áreas principales documentadas:

1. Clientes.
2. Vehículos.
3. Turnos.
4. Presupuestos.
5. Órdenes de Trabajo.
6. Usuarios/Auth.
7. Caja.
8. Stock.
9. Facturación.
10. Integraciones.
11. Portal cliente.
12. Funcionalidades avanzadas.

La prioridad real puede modificarse según el planning actual del proyecto.

---

# 31. Regla contra el sobre-ingeniería

No crear:

* abstracciones innecesarias;
* repositorios genéricos sin necesidad;
* interfaces para una única implementación;
* factories innecesarias;
* servicios de servicios;
* capas vacías;
* patrones arquitectónicos solamente "porque podrían servir en el futuro".

Preferir:

```text
código simple
+ responsabilidades claras
+ tests
+ posibilidad de evolución
```

sobre:

```text
arquitectura compleja
+ abstracciones preventivas
+ código difícil de seguir
```

---

# 32. Cambios de código

Antes de modificar una funcionalidad existente:

* Leer primero el código relevante.
* Identificar el comportamiento actual.
* Determinar qué parte debe cambiar.
* Mantener el comportamiento no relacionado.
* Evitar refactors masivos.

Si una tarea requiere modificar muchos archivos, explicar primero:

```text
Archivos afectados
Motivo
Cambios previstos
Riesgos
Tests necesarios
```

Luego implementar.

---

# 33. Reglas de Git

No crear commits automáticamente salvo que se solicite explícitamente.

Antes de considerar terminado un cambio:

```text
git diff
git status
tests
```

Revisar que:

* no haya archivos temporales;
* no haya secretos;
* no haya cambios accidentales;
* no haya archivos generados innecesarios.

El diff debe corresponder con la tarea solicitada.

---

# 34. Qué hacer ante una ambigüedad

Si encontrás algo como:

```text
La documentación dice A
pero el código actual implementa B
```

no asumir automáticamente que A debe reemplazar B.

Primero determinar:

1. ¿El código actual es una implementación posterior?
2. ¿La documentación fue actualizada?
3. ¿Existe otra documentación más reciente?
4. ¿El frontend depende de B?
5. ¿El cambio requiere una decisión funcional?

Si no puede determinarse, informar la discrepancia antes de realizar un cambio destructivo.

---

# 35. Qué hacer cuando una tarea es demasiado grande

Dividirla.

Ejemplo:

```text
1. Modelo de datos
2. Migración
3. Schemas
4. Service
5. Router
6. Tests
7. Integración frontend
```

No intentar modificar todo el sistema en una única operación si aumenta innecesariamente el riesgo.

---

# 36. Criterio de finalización

Una tarea se considera terminada cuando:

* La implementación cumple el requisito.
* Respeta la arquitectura existente.
* Respeta multi-tenancy.
* Respeta permisos/autenticación.
* No introduce regresiones conocidas.
* Los tests relevantes pasan.
* Las migraciones necesarias existen.
* El código no contiene cambios no relacionados.
* El contrato frontend/backend permanece consistente.
* Las decisiones tomadas quedan reflejadas donde corresponda.

Al finalizar, informar:

```text
## Implementado
- ...

## Archivos modificados
- ...

## Tests
- ...

## Migraciones
- ...

## Pendientes / decisiones
- ...
```

---

# 37. Regla final para OpenCode

**No seas solamente un generador de código. Actuá como desarrollador del proyecto.**

Antes de escribir:

```text
leer → entender → planificar → implementar → testear → revisar
```

La documentación de Taller Simple define el negocio y las decisiones funcionales.

El código existente define el estado actual de implementación.

El frontend define parte importante del contrato de interacción y datos.

Cuando exista conflicto entre ellos, **no ocultarlo ni resolverlo arbitrariamente**: identificarlo y solicitar una decisión cuando sea necesario.
