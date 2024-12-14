# CS TINDER

Este proyecto ayuda a los suscriptores del canal de [twitch.tv/the_real_fer](https://twitch.tv/the_real_fer) a encontrar pareja para participar en el **torneo anual de suscriptores**. Consiste en dos componentes principales:

- **App (Frontend):** Una aplicación web construida con Vue.js.
- **API (Backend):** Un servidor backend desarrollado con Node.js.

Ambos están organizados dentro de este monorepo para facilitar su gestión.

---

## Tecnologías utilizadas

### App (Frontend)
- Framework: Vue.js
- Builder: Vite
- Estilos: Tailwind CSS + DaisyUI
- Lenguaje: TypeScript

### API (Backend)
- Framework: Express
- Lenguaje: JavaScript (CommonJS)
- Base de datos: Turso (basada en SQLite)
- ORM: Drizzle ORM
- Autenticación: JSON Web Tokens (JWT)

---

## Arquitectura del proyecto

### App
La aplicación se conecta con la API para autenticar usuarios y gestionar datos. El diseño es sencillo, utilizando Tailwind y DaisyUI para agilizar la creación de estilos. Además, la app incluye:
- Un archivo `Dockerfile` para contenedores.
- Configuración de `fly.toml` para despliegues en Fly.io.
- Configuración de Nginx para servir la aplicación como una SPA (Single Page Application).

### API
La API presenta una arquitectura modular:
- `api.service.js`: Gestiona las solicitudes y llamadas a los endpoints.
- `repo.service.js`: Capa de abstracción que emplea Drizzle ORM para interactuar con la base de datos.

También incluye:
- Un archivo `Dockerfile` para contenedores.
- Configuración de `fly.toml` para despliegues en Fly.io.

Esta separación facilita el cambio de la base de datos en el futuro, ya que basta con ajustar la capa de abstracción.

---

## Requisitos

- Tener Node.js instalado.
- Registrar una aplicación en [Twitch Developers](https://dev.twitch.tv/console/apps) y añadir las URLs de redirección OAuth:
  - `http://localhost:4006/auth/twitch`
  - La URL pública de la app si se publica (por ejemplo, `https://miapp.com/auth/twitch`).
- Crear una base de datos en [Turso](https://turso.tech/) y obtener:
  - La URL de la base de datos.
  - El token de autenticación.
- Configurar las credenciales de la base de datos en el archivo `.env` y luego ejecutar los siguientes comandos desde el directorio de la API para generar y aplicar las tablas en Turso:
  ```
  npm run db:generate
  npm run db:migrate
  ```

---

## Configuración del entorno

Antes de ejecutar el proyecto, asegúrate de configurar las variables de entorno necesarias. Crea un archivo `.env` en el directorio de la API copiando el contenido de `.env.example` y completándolo con los valores requeridos.

Ejemplo de `.env.example`:

```
PORT=8080
SECRET=[GENERA UN SECRET]
TOKEN_EXPIRATION=7d
APP_URL=http://localhost:4006
API_URL=http://localhost:8080
TWITCH_CLIENT_ID=[REGISTRA UNA APP EN TWITCH]
TWITCH_CLIENT_SECRET=[REGISTRA UNA APP EN TWITCH]
TWITCH_REDIRECT_URI=http://localhost:4006/auth/twitch
BROADCASTER_ID=127354723 [la id de @the_real_fer]
TURSO_DB_URL=[CREA UNA BBDD EN TURSO]
TURSO_AUTH_TOKEN=[CREA UNA BBDD EN TURSO]
```

---

## Ejecución del proyecto

### App
1. Navega al directorio de la app:
   ```
   cd app
   ```
2. Instala las dependencias:
   ```
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```
4. Accede a la app en: [http://localhost:4006](http://localhost:4006)

### API
1. Navega al directorio de la API:
   ```
   cd api
   ```
2. Instala las dependencias:
   ```
   npm install
   ```
3. Inicia el servidor:
   ```
   node index.js
   ```
4. Accede a la API en: [http://localhost:8080](http://localhost:8080)

---

## Planes futuros

- Migrar la API a TypeScript para unificar el stack de desarrollo.
- Pasar de CommonJS a ES Modules en la API.
- Mejorar el diseño de la app para ofrecer una mejor experiencia de usuario.

---

## Contribución

Si deseas contribuir a este proyecto, abre un issue o envía un pull request. ¡Toda ayuda es bienvenida!

