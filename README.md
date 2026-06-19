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

## Puntos de Acceso (API Endpoints)

### Autenticación
*   `POST /api/auth/register`: Registra un nuevo usuario.
*   `POST /api/auth/login`: Autentica al usuario y obtiene JWT y Token de Refresco.
*   `POST /api/auth/refresh-token`: Obtiene un nuevo token de acceso usando un token de refresco.
*   `POST /api/auth/logout`: Invalida el token de refresco.

### Usuarios (Requiere Autenticación y Autorización)
*   `GET /api/users`: Obtiene todos los usuarios.
*   `GET /api/users/:id`: Obtiene usuario por ID.
*   `PUT /api/users/:id`: Actualiza usuario por ID.
*   `DELETE /api/users/:id`: Elimina usuario por ID.

### Productos (Requiere Autenticación y Autorización)
*   `GET /api/products`: Obtiene todos los productos.
*   `POST /api/products`: Crea un nuevo producto.
*   `GET /api/products/:id`: Obtiene producto por ID.
*   `PUT /api/products/:id`: Actualiza producto por ID.
*   `DELETE /api/products/:id`: Elimina producto por ID.

## Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.
```