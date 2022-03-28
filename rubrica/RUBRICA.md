# Estructura final de la web

1. Código prolijo

    - Consistencia entre la estructura HTML de diferentes páginas. √
    - Tabulaciones correctas y consistentes. √

2. Tags HTML

    - El nesting es óptimo, usando la menor cantidad de tags posibles. Uso de tags semánticos correcto y estructuración de la página desde el HTML. √
    - El alt de las imágenes es pertinente y descriptivo. √
    - Uso de etiquetas semánticas. √
    - Uso óptimo de etiquetas, evitando crear por demás. √

3. Estilo en el HTML

    - Nombres de clases consistentes y en kebab-case. √
    - Linkea correctamente a el/los archivos de CSS que son generados por el SCSS. √
    - El nombre del archivo generado por el SCSS es apropiado y no de prueba. √

4. Funcionalidad

    - Las páginas tienen enlaces funcionales. √ (Aquí hago la salvedad respecto a los vínculos de las redes sociales en el footer.)
    - Las imágenes tienen rutas relativas y correctas. √
    - Las páginas están interconectadas correctamente. √
    - Todas las imágenes son pertinentes al contenido y no hay placeholders. √

5. Contenido

    - La información está correctamente estructurada, usando los tags correctos para cada tipo de contenido, ya sean tablas, listas, titulares, párrafos o imágenes. √
    - El contenido no está distribuido monótonamente y tiene varios niveles de lectura, lo que genera diferentes centros de interés visual y peso. √
    - Uso del srcset para usar imágenes diferentes en los diferentes viewport/queries. √

# Estilo final de la web

1. Código limpio y prolijo

    - Nesting bien estructurado en el SCSS. √
    - Tabulaciones correctas para estructurar el selector. √
    - Uso de & para realizar selectores óptimos con pocas repeticiones. √

2. Entendimiento del CSS

    - Expande sobre elementos que ya había creado con clases que los modifican. √
    - Genera estilos que son fáciles de cambiar o transformar para diferentes tamaños de dispositivo. √

3. Entendimiento de SCSS/SASS

    - Utiliza variables para no tener que repetir valores como colores y tamaños de tipografías. √
    - Divide la lógica en diferentes archivos de SASS haciendo uso luego del @import en uno solo para unirlos. √

4. Código de la estructura visual o layout 

    - Utilización de flex y grid pertinente al tipo de layout a generar. √
    - No fuerza flex o grid para elementos que no lo necesitan y se resuelven con box-modelling. √

5. Diseño de la  estructura visual o layout

    - No se conforma con los layouts clásicos y genera una estructura propia o poco convencional para el diseño web, pero aún así es navegable e intuitiva. √ (Entiendo que este es aún un punto de mejora en el desarrollo.)

6. Utilización de Frameworks

    - Personaliza el framework haciendo uso de las variables del mismo sin superponer las clases con cascada. √
    - Utiliza un framework no visto en clase de forma óptima. x (Solo utilizo Bootstrap en el desarrollo.)
    - Inserta sólo los módulos que desea de su framework. x
    - Inserta la librería desde SASS. x

7. Diseño web atractivo

    - Hay una paleta de colores y se respeta a lo largo de las páginas del sitio web. √
    - Los textos tienen varios niveles de lectura, volviendo dinámica la lectura/escaneo visual del contenido. √
    - Transiciones apropiadas y decorativas usándose con elementos que merecen la atención del usuario. √

8. Media queries & Responsive

    - Uso de unidad rem a lo largo de los tamaños tipográficos para hacer luego cambiar el tamaño de forma pareja desde  :root. √
    - El sitio web cuenta con una buena navegación en numerosos tamaños, en particular en mobile, laptop y desktop. √
    - Elementos irrelevantes para los tamaños más chicos son removidos en favor de favorecer la lectura del resto. √

# Subida al servidor

1. Entendimiento del sistema de subida de archivos

    - El sitio web es una copia fiel a lo que el estudiante estaba trabajando de forma local. √
    - Las URLs del sitio web online son amigables. √
    - Página 404 personalizada y funcional. √

2. Entendimiento del servicio de hosting

    - Se entrega el trabajo subido a la web designada y se hace uso de las herramientas que provee el servicio para subir los archivos. √
    - El estudiante aplica lo aprendido para subir su sitio web a un servicio de hosting propio o que considero más apropiado para su trabajo. √

# Repositorio en GitHub

1. Utilización de git

    - Realiza cambios pertinentes a un grupo de mejoras y las commitea. √
    - Genera branches en caso de tener que testear algo experimental y luego hace el merge a master. √ 
    - Utiliza .gitignore para no versionar los archivos o directorios que no son requeridos como node_modules. √

2. Uso de GitHub

    - Hay un readme.md con toda la información pertinente al proyecto y al estudiante. √
    - Usa las clave SSH para conectarse con Github desde su computadora. √
    - Utiliza Github Pages para su trabajo. √