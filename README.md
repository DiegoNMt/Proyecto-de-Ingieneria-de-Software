# Actividad 15. Prueba de estrés al sitio web

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
