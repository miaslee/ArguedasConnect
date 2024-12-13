# ArguedasConnect
##LINK EN HOSTING
https://homeapps.lol/

## Aviso
El proyecto lo hize sin saber pasar variables desde otro componente, sin saber llamar funciones desde otros compentenes, por eso al principio hay funciones iguales en direferentes componentes, y la misma variable en más de un componente, si hubiese sabido pasar variables usando servicios desde el inicio, el codigo estuviese más optimizado, Ahora que terminé el proyecto aprendí a llamar funciones de otras clases desde servicios, Si tendria que hacer de nuevo el proyecto lo haria mejor usando servicios para las funciones y pasar variables.

## Descripción
ArguedasConnect es una red social diseñada exclusivamente para los alumnos de la **UNAJMA – Universidad Nacional José María Arguedas**. Permite a los estudiantes interactuar, compartir publicaciones, comentar y gestionar su perfil personal de manera sencilla y eficiente. 

## Funcionalidades

### 1. **Página de Inicio (Feed)**
El feed principal muestra las publicaciones más recientes de los estudiantes. Cada publicación incluye opciones para comentar y reaccionar.

![Página de Inicio](https://devmiasx.com/uploads/GitImage/feed.jpg)

---

### 2. **Publicar Contenido**
Los usuarios pueden crear publicaciones con texto e imágenes para compartir con sus compañeros.

![Crear Publicación](https://devmiasx.com/uploads/GitImage/crearPost.jpg)

---

### 3. **Sistema de Comentarios**
Permite a los usuarios interactuar con las publicaciones dejando comentarios.

![Comentarios](https://devmiasx.com/uploads/GitImage/comentarios.jpg)

---

### 4. **Registro e Inicio de Sesión**
Nuevos usuarios pueden registrarse fácilmente proporcionando su correo universitario y contraseña utilizando Firebase Authentication. También pueden iniciar sesión con sus credenciales de manera segura.

- **Registro**  
![Registro](https://devmiasx.com/uploads/GitImage/registro.jpg)

- **Inicio de Sesión**  
![Inicio de Sesión](https://devmiasx.com/uploads/GitImage/login.jpg)

---

### 5. **Gestión del Perfil**
Los usuarios pueden personalizar su perfil, editar su información personal y ajustar la privacidad de su cuenta (perfil público o privado).

- **Mi Perfil**  
![Mi Perfil](https://devmiasx.com/uploads/GitImage/miPerfil.jpg)

- **Editar Perfil**  
![Editar Perfil](https://devmiasx.com/uploads/GitImage/perfilEdit.jpg)

- **Perfil Público**  
![Perfil Público](https://devmiasx.com/uploads/GitImage/perfilPublico.jpg)

- **Perfil Privado**  
![Perfil Privado](https://devmiasx.com/uploads/GitImage/perfilPrivado.jpg)

---

### 6. **Recuperación de Contraseña**
En caso de olvidar la contraseña, los usuarios pueden solicitar un enlace de recuperación para establecer una nueva contraseña utilizando Firebase Authentication.

![Recuperar Contraseña](https://devmiasx.com/uploads/GitImage/pass.jpg)

---

## Tecnologías Utilizadas

- **Frontend**: Angular
- **Base de Datos**: Firebase
- **Autenticación**: Firebase Authentication
- **Hosting de Imágenes**: Servidor externo (`https://devmiasx.com/uploads/`)

## Cómo Ejecutar el Proyecto

1. Clona este repositorio:
   ```bash
   git clone https://github.com/miaslee/ArguedasConnect.git
