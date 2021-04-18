# CRUD

El siguiente repositorio contiene todos los archivos necesarios para la correcta ejecución de la prueba técnica de React-PHP.

## Información relevante:

### 1. Base de datos:

Para esta pruena técnica, se creó una base de datos llamada `Konecta`, la cuál cuenta con tres tablas (users, blogs y likes). La base de datos es el archivo llamado `Konecta.sql` basta con restaurar este backup y quedará funcional nuestra base de datos.

En la primera de está se encuentra almacenada toda la información sobre los usuarios y contiene los sigueintes campos:

| Campo | Tipo | Descripción |
| ------------- | ------------- | ------------- |
| id  | bigint unsigned | Identificador del usuario |
| nombre  | varchar | Nombre completo del usuario |
| email  | varchar  | Correo electronico (Es el campo requerido para la autenticació) |
| pass  | varchar | Contraseña (Se ingresa encriptada en MD5 |
| phone  | varchar | Número de celular |
| rol  | int  | Rol del usuario (Administrador o usuario) |
| created_at  | tiemstamp | Fecha de creación del usuario |
| updated_at  | tiemstamp  | Fecha de última actualización del usuario |

En la segunda, se encuentran los blogs, las columnas son las siguientes:

| Campo | Tipo | Descripción |
| ------------- | ------------- | ------------- |
| id  | bigint unsigned | Identificador del blog |
| category_id  | varchar | Categoria del blog |
| tittle  | varchar  | Titulo |
| description  | varchar | Descripción |
| text  | varchar | Contenido del blog |
| likes  | int  | Cantidad de likes del blog |
| created_at  | tiemstamp | Fecha de creación del blog |
| updated_at  | tiemstamp  | Fecha de última actualización del blog |


La tercera tabla es la tabla de Likes, la cuál contiene los blogs que han sido likeados por cada usuario, la tabla es la siguiente:

| Campo | Tipo | Descripción |
| ------------- | ------------- | ------------- |
| id  | bigint unsigned | Identificador del like |
| user_id  | varchar | Identificador del usuario |
| blog_id  | int  | Identificador del blog |

### 2. FrontEnd:

No se encuentran creados usuarios en la base de datos, pues esto se resuelve facilmente registrandose en el sitio, sin embargo, existe un usario administrador, las credenciales `sebastian.larrea@udea.edu.co` y `konecta!`
 

### Manual de instalación:

Luego de recuperar la base de datos, es necesario tener claro en que parte deben ir las dos carpetas.

La carpeta del FrontEnd (CRUD) puede ir en cualquier parte del sistema, dado que sobre este directorio se inicia el proyecto. 

Sin embargo, la carpeta del BackEnd (php-react) se debe instalar de tal forma que la url sea `http://localhost/php-react/`. El Front se comunica con el Back a través de las sigueintes urls.


| Enfoque | Url | 
| ------------- | ------------- |
| Usuarios  | http://localhost/php-react/users.php |
| Blogs  | http://localhost/php-react/blogs.php | 
| Likes  | http://localhost/php-react/articles.php  | 
