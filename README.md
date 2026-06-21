```markdown
# backend-libreria-rocio

API backend para la aplicación "Librería Rocío", construida con Express.js y estructurada utilizando una arquitectura por capas (patrón Controlador-Servicio-Repositorio). Esta API proporciona funcionalidades para la gestión de usuarios, productos, ventas e inventario dentro de un sistema de librería.

## Características

*   **Gestión de Usuarios**: Registro, inicio de sesión, gestión de perfiles de usuario y control de acceso basado en roles.
*   **Autenticación y Autorización**: Acceso seguro a la API utilizando JWT (JSON Web Tokens) y middleware para verificación de roles.
*   **Catálogo de Productos**: Gestión de libros, categorías y detalles de productos.
*   **Gestión de Ventas**: Creación y seguimiento de ventas, incluyendo detalles de los artículos.
*   **Gestión de Inventario**: Manejo de órdenes de suministro y detalles para el seguimiento de existencias.
*   **Gestión de Proveedores**: Gestión de información sobre los proveedores de productos.
*   **Manejo de Errores**: Manejo centralizado de errores para respuestas consistentes de la API.

## Arquitectura

Este proyecto sigue una **Arquitectura por Capas** con una clara separación de responsabilidades, implementando principalmente el **patrón Controlador-Servicio-Repositorio**.

*   **Controladores**: Manejan las solicitudes HTTP entrantes, validan la entrada y delegan la lógica de negocio a los servicios. Son responsables de orquestar el flujo, pero no contienen lógica de negocio en sí mismos.
*   **Servicios**: Encapsulan la lógica de negocio de la aplicación. Interactúan con los repositorios para obtener o persistir datos y realizan cualquier transformación o validación necesaria.
*   **Repositorios**: Abstraen la lógica de acceso a datos. Interactúan directamente con la base de datos (a través del ORM Sequelize) para realizar operaciones CRUD en los modelos. Esta capa asegura que la lógica de negocio permanezca independiente de los detalles de implementación de la base de datos.
*   **Modelos**: Definen la estructura de los datos y las relaciones con la base de datos utilizando Sequelize.
*   **Middleware**: Funciones que tienen acceso a los objetos de solicitud y respuesta, y a la siguiente función de middleware en el ciclo de solicitud-respuesta de la aplicación. Se utilizan para autenticación, autorización y manejo de errores.
*   **Rutas**: Definen los puntos finales de la API y los mapean a los métodos de controlador apropiados.
*   **Configuración**: Contiene archivos de configuración para la conexión a la base de datos, secretos JWT, etc.
*   **Utilidades**: Funciones de ayuda y utilidades utilizadas en toda la aplicación.

## Tecnologías Utilizadas

*   **Node.js**: Entorno de ejecución de JavaScript.
*   **Express.js**: Framework de aplicación web para Node.js.
*   **Sequelize**: Object-Relational Mapper (ORM) para Node.js, compatible con MySQL.
*   **MySQL**: Sistema de gestión de bases de datos relacionales.
*   **JWT (JSON Web Tokens)**: Para autenticación segura.
*   **Bcrypt**: Para el hash de contraseñas.
*   **Dotenv**: Para cargar variables de entorno desde un archivo `.env`.

## Prerrequisitos

Antes de ejecutar esta aplicación, asegúrate de tener lo siguiente instalado:

*   [Node.js](https://nodejs.org/en/) (se recomienda v14 o superior)
*   [npm](https://www.npmjs.com/) (Administrador de Paquetes de Node)
*   [MySQL](https://dev.mysql.com/downloads/mysql/) instalado y en ejecución.

## Instalación

Sigue estos pasos para configurar el proyecto localmente:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/Denys392/backend-libreria-rocio.git
    cd backend-libreria-rocio
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las Variables de Entorno:**
    Crea un archivo `.env` en el directorio raíz del proyecto basado en `env`. Complétalo con tus credenciales de base de datos y el secreto JWT.

    Ejemplo de `.env`:
    ```env
    DB_HOST=localhost
    DB_USER=your_username
    DB_PASSWORD=your_password
    DB_NAME=libreria_rocio_db
    DB_DIALECT=mysql
    DB_PORT=3306
    JWT_SECRET=supersecretjwtkey
    JWT_EXPIRES_IN=1h
    REFRESH_TOKEN_SECRET=anothersecretkeyforrefresh
    REFRESH_TOKEN_EXPIRES_IN=7d
    ```

4.  **Configuración de la Base de Datos:**
    Asegúrate de que tu servidor de base de datos MySQL esté funcionando. La aplicación intentará conectar y sincronizar los modelos basándose en tu configuración de Sequelize (`models/sequelize.js` y `models/model.index.js`).

    *Nota*: Si tienes migraciones, es posible que necesites ejecutarlas explícitamente. Para una configuración típica de Sequelize con `sync`, la sincronización de modelos ocurre automáticamente al iniciar la aplicación. Si utilizas `sequelize-cli` para migraciones, ejecutarías:
    ```bash
    npx sequelize db:migrate
    ```

## Ejecutando la Aplicación

Para iniciar el servidor de desarrollo:

```bash
npm start
# o para desarrollo con nodemon
npm run dev
```

La API se ejecutará en `http://localhost:3000` (o el puerto configurado en `app.js`).

## Documentación interactiva (Swagger)

La API cuenta con documentación interactiva generada con Swagger/OpenAPI. Con el servidor en ejecución, puedes explorar y probar todos los endpoints desde:

*   **Local:** `http://localhost:3000/api-docs`
*   **Producción:** `https://libreriarocio.api.denyschafloque.space/api-docs`

## Puntos de Acceso (API Endpoints)

> Nota: ninguna ruta usa el prefijo `/api`; se montan directamente sobre la raíz (por ejemplo `/auth/login`, `/products`, etc.). Consulta `/api-docs` para ver el detalle completo de cada endpoint (parámetros, body, respuestas y roles requeridos).

### Autenticación (`/auth`)
*   `POST /auth/register`: Registro público de clientes (rol CLIENT automático).
*   `POST /auth/login`: Inicia sesión y devuelve un Access Token (el Refresh Token se entrega como cookie HTTP-Only).
*   `POST /auth/refresh`: Renueva el Access Token usando la cookie de refresco.
*   `POST /auth/logout`: Cierra sesión e invalida el Refresh Token.
*   `POST /auth/register/user`: Crea usuarios con un rol específico (solo OWNER, ADMIN o DEV).

### Usuarios (`/users`)
*   `GET /users/profile`: Obtiene el perfil del usuario autenticado.
*   `GET /users/profile/image/:filename`: Sirve la imagen de perfil pública.
*   `GET /users/management`: Lista todos los usuarios, paginado (solo OWNER, ADMIN, DEV).
*   `PUT /users/:id`: Actualiza un usuario (reglas distintas si te editas a ti mismo o eres staff).
*   `DELETE /users/:id`: Elimina un usuario (solo OWNER, ADMIN, DEV).

### Categorías (`/categories`)
*   `GET /categories`: Lista todas las categorías (público).
*   `GET /categories/:id`: Obtiene una categoría por ID (público).
*   `POST /categories`: Crea una categoría (solo OWNER, ADMIN, DEV).
*   `PUT /categories/:id`: Actualiza una categoría (solo OWNER, ADMIN, DEV).
*   `DELETE /categories/:id`: Elimina una categoría (solo OWNER, ADMIN, DEV).

### Proveedores (`/providers`, solo OWNER, ADMIN, DEV)
*   `GET /providers`: Lista todos los proveedores.
*   `GET /providers/:id`: Obtiene un proveedor por ID.
*   `GET /providers/document/:identifier`: Busca un proveedor por RUC o DNI.
*   `POST /providers`: Crea un proveedor.
*   `PUT /providers/:id`: Actualiza un proveedor.
*   `DELETE /providers/:id`: Elimina un proveedor.

### Productos (`/products`)
*   `GET /products`: Catálogo público de productos, paginado.
*   `GET /products/catalog-by-categories`: Catálogo agrupado por categoría (público).
*   `GET /products/:id`: Obtiene un producto publicado por ID (público).
*   `GET /products/model`: Lista todos los productos, incluidos los no publicados (solo OWNER, ADMIN, DEV).
*   `GET /products/category/:categoryId`: Productos públicos de una categoría.
*   `GET /products/model/category/:categoryId`: Todos los productos de una categoría (solo OWNER, ADMIN, DEV).
*   `GET /products/provider/:providerId`: Productos de un proveedor (solo OWNER, ADMIN, DEV).
*   `GET /products/model/:id`: Obtiene cualquier producto por ID (solo OWNER, ADMIN, DEV).
*   `POST /products`: Crea un producto (solo OWNER, ADMIN, DEV).
*   `PUT /products/:id`: Actualiza un producto (solo OWNER, ADMIN, DEV).
*   `DELETE /products/:id`: Elimina un producto (solo OWNER, ADMIN, DEV).

### Suministros (`/supplies`, solo OWNER, ADMIN, DEV)
*   `POST /supplies`: Registra una orden de abastecimiento y actualiza el stock.
*   `GET /supplies`: Lista todas las órdenes de suministro.

### Ventas (`/sales`)
*   `POST /sales`: Registra una venta (CLIENT, ADMIN, DEV, SELLER).
*   `GET /sales`: Lista todas las ventas, paginado (OWNER, ADMIN, DEV, SELLER).
*   `GET /sales/my-purchases`: Lista las compras del usuario autenticado (CLIENT, ADMIN).
*   `GET /sales/:id`: Detalle de una venta (staff o el propio comprador).

### Reportes (`/reports`)
*   `GET /reports/dashboard`: Resumen financiero, top de productos y tendencia de ventas (OWNER, ADMIN, DEV, MANAGER).
*   `GET /reports/low-stock`: Productos con stock bajo (OWNER, ADMIN, DEV, MANAGER).
*   `GET /reports/sales-by-document`: Ventas agrupadas por tipo de comprobante (OWNER, ADMIN, DEV).
*   `GET /reports/top-customers`: Clientes con mayor gasto acumulado (OWNER, ADMIN, DEV).
*   `GET /reports/category-performance`: Rendimiento de ventas por categoría (OWNER, ADMIN, DEV).

## Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.
```