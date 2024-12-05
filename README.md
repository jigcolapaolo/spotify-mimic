# Spotify Mimic <img src="https://github.com/user-attachments/assets/f1d078b1-2633-4208-a895-c16d41636ac2" alt="Spotify Mimic Logo" width="50" height="50" />
<br>

Spotify Mimic es una aplicación desarrollada en Astro inspirada en las funcionalidades básicas de Spotify, empezado como práctica de Astro gracias al video del clon de Spotify de Midudev.

## 🚀 Nuevas Características

- Botones para **Selección Aleatoria** de canciones, **Anterior y Siguiente canción** y **Repetición** de la ultima canción.
- Barra de búsqueda para filtrar por álbum.
- Portada de álbum de la canción actual con forma de dísco y animación según este reproduciendose.
- Cambio de fondo según se haga hover en algún álbum.
- Iconos dinámicos y animados para canción y álbum en reproducción.
- Toggler para el menú Aside.
- Nueva página de error 404.
- Tooltips para los iconos.
- Flecha para regresar a Home al clickear en un álbum.
- Diseño responsivo.

## 🛠️ Tecnologías Utilizadas

- **Framework:** Astro
- **Librerías de UI:** React y Svelte
- **Lenguaje:** TypeScript
- **Estilos:** CSS y Tailwind
- **Testing:** Playwright (end-to-end)


## 📚 Instalación y Configuración

Para instalar y ejecutar el proyecto en tu entorno local:

### Clonar el repositorio

````
git clone https://github.com/jigcolapaolo/spotify-mimic.git
````

## 🧞 Comandos de Astro


| Command                   | Action                                              |
| :------------------------ | :-----------------------------------------------    |
| `npm install`             | Instala dependencias                                |
| `npm run dev`             | Inicial el local dev server en `localhost:4321`     |
| `npm run build`           | Build de la app en produccion en `./dist/`          |
| `npm run preview`         | Preview de la build localmente, antes del deploy    |
| `npm run astro ...`       | Ejecuta comandos CLI como `astro add`, `astro check`|
| `npm run astro -- --help` | Busca ayuda usando el astro CLI                     |


## 🧪 Tests

La app incluye tests de extremo a extremo (E2E).

### Ejecutar Tests E2E con Playwright


Usa el siguiente comando para ejecutar todos los tests de Playwright:
````
npx playwright test
````
Opcional con UI:
````
npx playwright test --ui
````
