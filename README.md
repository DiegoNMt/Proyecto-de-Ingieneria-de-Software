# Fase 5 

## Actividad 14. Configurar sitio local o remoto

    Estás entrando a la última etapa del proyecto: web interface. La cual está dividida en dos actividades que generarán la interfaz con la que va a interactuar el motor de búsqueda.

Para esta actividad vas a investigar lo necesario para montar un sitio local o remoto en el que puedas hacer llamadas CGI-BIN. Dependiendo en qué plataforma hayas desarrollado tu solución podrá ser Linux/Unix o Windows, además, configurarás el servidor local o remoto.

### Team Foundation Server

    1. Reúnete con tu equipo scrum.
    2. Configuren el ambiente de TFS para que puedan utilizarlo.
    3. De las 13 historias de usuario que ya fueron completadas, asígnenles los puntos y tiempos que tienen en sus registros.
    4. Utilicen la plantilla de Excel o HP Agile Manager que realizaron en actividades anteriores para que los tiempos sean iguales.

### Configurar sitio local o remoto para CGI

    5. Investiguen qué tipo de servidor hay que montar para hacer las llamadas CGI. Ya sea Apache o IIS en Linux/Unix o Windows.
    6. Configuren el sitio y creen un sitio básico tipo Hola Mundo. Este sitio puede ser local o remoto.


## Actividad 15. Prueba de estrés al sitio web

En esta actividad es necesario que tengas el sitio web totalmente funcional, ya que vas a grabar la búsqueda de alguna palabra y la reproducirás con diferente número de usuarios, hasta que se haga lenta o deje de responder.

1. Reúnete con tu equipo scrum.
2. Creen un nuevo proyecto de pruebas en Visual Studio y un nuevo Web Performance Test.
3. La página deberá tener un cuadro de texto como el que se muestra en la siguiente figura.

<img width="606" height="299" alt="imagen" src="https://github.com/user-attachments/assets/145f7919-14aa-4c83-a2dd-4b24843d4863" />

4. Cuando Visual Studio comience a grabar la prueba, abran la página del motor de búsqueda.
5. Escriban como entrada la palabra uno.
6. La siguiente figura muestra un resultado similar al que deberá entregar el motor de búsqueda.

<img width="619" height="335" alt="imagen" src="https://github.com/user-attachments/assets/845093e4-b22c-4107-9452-a1007ff9cd99" />

7. Cuando el motor arroja el resultado de la búsqueda, mostrará tres cosas básicas:

    El nombre de la página en donde se encontró la palabra.
    El hipervínculo hacia la página deberá ser funcional.
    El ranking obtenido por cada página. Nota que los resultados están ordenados por relevancia o ranking.

8. Detengan la grabación de la prueba que están haciendo con Visual Studio.
9. Agreguen una prueba load test, como la mostrada en el tema.
10. La configuración que seleccionen para el load test es la siguiente:
  
        Duración de la prueba: 15 minutos
        Tiempo entre cada iteración: 0 segundos
        Número de usuarios: 25
        Navegador: Internet Explorer 9
        Test mix: Vacío (selecciona el creado)
        Response Time de la prueba: 2 segundos (esto indica que cada búsqueda deberá tardar máximo 2 segundos)
11. Generen las combinaciones necesarias hasta que el CPU o el I/O del servidor que hospeda la solución sea del 100%.

# Evidencia 2 - Instrucciones y rúbrica de evaluación

1. Pare realizar esta evidencia reúnanse con su equipo scrum.
2. Recopilen los documentos y archivos de las fases weight tokens, query y web interfaz.
3. Incluyan los siguientes elementos scrum:

        Historias de usuario generadas al inicio de cada Sprint.
        Lista de historias en el product backlog antes y después de cada sprint.
        Casos de prueba creados a lo largo de cada sprint.
        Gráfica con la velocidad del equipo en cada sprint.
        Backlog con todas las fases e historias de usuario en TFS.

4. Agreguen los siguientes elementos funcionales en el programa:


        Comprobar que su programa elimine los stopwords, ponga los tokens en minúsculas y los tokens tengan un tamaño máximo definido.
        El buscador debe enlistar el top 10 de los documentos con un rank y el link funcional para cada documento.
        El programa no debe cargar el índice o diccionario en memoria, debe accederlo directamente en disco.
        Demostrar que la interfaz de la página web realiza llamadas CGI o equivalentes al momento de realizar la búsqueda.

5. Incluyan la dirección de su buscador web para que sea probado localmente.
6. Realicen las impresiones de pantalla y las búsquedas de cada una de las siguientes consultas:

    
        exploitation
        hygiene
        exploitation hygiene
        Arkansas
        gift!! Person?
        the
        elephants
        Gauch
        20
  
8. Realicen el diagrama de flujo del programa.
9. Presenten los resultados de pruebas de carga en TFS.


