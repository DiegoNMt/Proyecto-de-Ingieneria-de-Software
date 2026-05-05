// Updated Aug 28, 2019
// In Google Analytics you'll need to set up custom dimensions as follows
// Custom Dimension 1 = Canvas User ID --- Scope = User
// Custom Dimension 2 = Archived --- Scope = User
// Custom Dimension 3 = Canvas User Role --- Scope = User
// Custom Dimension 4 = Canvas Course ID --- Scope = Hit
// Custom Dimension 5 = Canvas Course Name --- Scope = Hit
// Custom Dimension 6 = Canvas Sub-Account ID --- Scope = Hit
// Custom Dimension 7 = Canvas Term ID --- = Scope = Hit
// Custom Dimension 8 = Canvas Course Role --- Scope = Hit

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'custom_ga');

function removeStorage(key) {
    try {
        localStorage.removeItem(key);
        localStorage.removeItem(key + '_expiresIn');
    } catch (e) {
        console.log('removeStorage: Error removing key [' + key + '] from localStorage: ' + JSON.stringify(e));
        return false;
    }
    return true;
}

function getStorage(key) {
    var now = Date.now(); //epoch time, lets deal only with integer
    // set expiration for storage
    var expiresIn = localStorage.getItem(key + '_expiresIn');
    if (expiresIn === undefined || expiresIn === null) {
        expiresIn = 0;
    }

    if (expiresIn < now) { // Expired
        removeStorage(key);
        return null;
    } else {
        try {
            var value = localStorage.getItem(key);
            return value;
        } catch (e) {
            console.log('getStorage: Error reading key [' + key + '] from localStorage: ' + JSON.stringify(e));
            return null;
        }
    }
}

function setStorage(key, value, expires) {
    if (expires === undefined || expires === null) {
        expires = (24 * 60 * 60); // default: seconds for 6 hours (6*60*60)
    } else {
        expires = Math.abs(expires); //make sure it's positive
    }

    var now = Date.now(); //millisecs since epoch time, lets deal only with integer
    var schedule = now + expires * 1000;
    try {
        localStorage.setItem(key, value);
        localStorage.setItem(key + '_expiresIn', schedule);
    } catch (e) {
        console.log('setStorage: Error setting key [' + key + '] in localStorage: ' + JSON.stringify(e));
        return false;
    }
    return true;
}

async function coursesRequest(courseId) {
    // 
    let response = await fetch('/api/v1/users/self/courses?per_page=100');
    let data = await response.text();
    data = data.substr(9);
    data = JSON.parse(data)
    var stringData = JSON.stringify(data)
    setStorage('ga_enrollments', stringData, null)
    var course = parseCourses(courseId, stringData)
    return course
};

function parseCourses(courseId, courseData) {
    if (courseData != undefined) {
        let data = JSON.parse(courseData);
        //console.log(data)
        for (var i = 0; i < data.length; i++) {
            // console.log(data[i]['id'] + " " + courseId)
            if (data[i]['id'] == courseId) {
                return data[i]
            }
        }
    }
    return null
}

function gaCourseDimensions(course) {
    gtag('set', 'Course_ID', course['id']);
    gtag('set', 'Course_Name', course['name']);
    gtag('set', 'Sub_Account_ID', course['account_id']);
    gtag('set', 'Term_ID', course['enrollment_term_id']);
    gtag('set', 'Course_Role', course['enrollments'][0]['type']);
    return
}

function googleAnalyticsCode(trackingID) {
    var userId, userRoles, attempts, courseId;
    gtag('create', trackingID, 'auto');
    userId = ENV["current_user_id"];
    userRoles = ENV['current_user_roles'];
    gtag('set', 'userId', userId);
    gtag('set', 'User_ID', userId);
    gtag('set', 'User_Roles', userRoles);
    courseId = window.location.pathname.match(/\/courses\/(\d+)/);
    if (courseId) {
        courseId = courseId[1];
        attempts = 0;
        try {
            let courses = getStorage('ga_enrollments')
            if (courses != null) {
                var course = parseCourses(courseId, courses);
                if (course === null) {
                    // console.log("course_id not found in cache, retrieving...")
                    coursesRequest(courseId).then(course => {
                        if (course === null) {
                            // console.log("course data not found")
                            gtag('set', 'Course_ID', courseId);
                        } else {
                            gaCourseDimensions(course)
                        }
                    });
                } else {
                    // console.log("course found in cache")
                    gaCourseDimensions(course)
                }
            } else {
                // console.log("cache not found, retrieving cache data")
                coursesRequest(courseId).then(course => {
                    if (course === null) {
                        // console.log("course data not found")
                        gtag('set', 'Course_ID', courseId);
                    } else {
                        gaCourseDimensions(course)
                    }
                });
            }
        } catch (err) {
            attempts += 1;
            if (attempts > 5) {
                gtag('set', 'Course_ID', courseId);
                return;
            };
        };
    } else {

    };
};

$.ajax({
	url: 'https://www.googletagmanager.com/gtag/js?id=G-GT2WB1RRYP',
	dataType: 'script',
	cache: true,
	})

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-GT2WB1RRYP');



// ----------------------------------------
// Código para el desarrollo "Plataforma de Medición"
// ----------------------------------------


var imageSource = 'https://cursos.tecmilenio.mx/courses/139/files/9380835/preview';
var urlRecepcionDatos = 'https://apoyame.tecmilenio.mx/FormularioIncidente/RecibeDatosNavegacion';
var urlPM = 'https://apoyame.tecmilenio.mx/FormularioIncidente/Cargando';
var  idExternalTool = 237;

var nameStorage = "LTIPM";


$(document).ready(function() {
	
	

	window.addEventListener('message', function(e) {
	  try {
		// IE 8 & 9 only support string data, so parse the string.
		var message = JSON.parse(e.data);
		switch (message.subject) {
		  case 'lti.frameResize':
			var height = message.height;
			var $iframe = jQuery('#' + message.iframe_resize_id);
			if ($iframe.length == 1 && $iframe.hasClass('resizable')) {
			  var height = message.height;
			  if (height <= 0) height = 1;
			  $iframe.css('height', height + 'px');
			}
			break;

		  case 'lti.showModuleNavigation':
			if(message.show === true || message.show === false){
			  $('.module-sequence-footer').toggle(message.show);
			}
			break;

		  case 'lti.scrollToTop':
			$('html,body').animate({
			   scrollTop: $('.tool_content_wrapper').offset().top
			 }, 'fast');
			break;

		  case 'lti.setUnloadMessage':
		  console.log("Recibe mensaje")
			setUnloadMessage(message.message);
			break;

		  case 'lti.removeUnloadMessage':
			removeUnloadMessage();
			break;

		  case 'lti.screenReaderAlert':
			$.screenReaderFlashMessageExclusive(message.body)
			break;

		  case 'lti.pageRefresh':
			location.reload(true);
			break;
		}
	  } catch(err) {
		(console.error || console.log).call(console, 'invalid message received from');
	  }
	}); 
 
	

	if(window.location.pathname.indexOf( '/external_tools/' + idExternalTool )>-1){
		 $('#mobile-header').hide();
		 //$('#left-side').hide();
		 
		 $('#left-side').css("display","none");
		 $('#header').css("display","none");
		 $('#wrapper').css("margin-left","0");
		 $('#main').css("margin-left","0");
		 $('#main').css("margin-left","0");		 
		 $('.ic-app-nav-toggle-and-crumbs.no-print').css("display","none");	
		 $('body').css("overflow-y","hidden");
		

	}
	
	var agregarBoton = false;
	
	if (window.location.pathname.indexOf('/courses') > -1 &&  
	    window.location.pathname.indexOf('/external_tools/' + idExternalTool) < 0 &&
		window.location.pathname.indexOf('/speed_grader' ) < 0) {

		agregarBoton = true;
		if(window.location.pathname.indexOf('/submissions' ) > 0 ){
			var param  = window.location.search;
			if(param.indexOf('preview' ) > 0){
				agregarBoton = false;
			}

		}
		
		
	}
	
	if(agregarBoton){
		var divButton = '<div  align="right"  style = "width:100%; display: inline-block;">'
						+ 	'<input id="mejora" type="image"  src= '+ imageSource +'   value="Incidentes" width="50" height="50" style="margin: 10px 0px">'
						+'</div>'
		
        $("#content").prepend(divButton);
		$("#mejora").click(enviarAPM);
		localStorage.removeItem("URLS");	
		
	}

		

	
	
	
	
});

		
var beforeUnloadHandler;
function setUnloadMessage(msg) {
  procesarMensaje(msg);
  removeUnloadMessage();

  beforeUnloadHandler = function(e) {
    return (e.returnValue = msg || "");
  }
  window.addEventListener('beforeunload', beforeUnloadHandler);
}

function removeUnloadMessage() {
  if (beforeUnloadHandler) {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    beforeUnloadHandler = null;
  }
}			
	




function procesarMensaje(msg){

	console.log("Procesa mensaje" + msg)
	var imagen;
	var res = msg.split("|");
	var x = res.length;
	//var guardarCaptura;
	var token;
	if(x == 2){
		token = res[0];
		guardarCaptura = (res[1] === 'true');
		
		if(token==='URL'){
			var urlCurso = res[1];
			console.log("Menseje URL" + urlCurso);
			localStorage.setItem("URLS",urlCurso);				
			
		}		
		else{
			
			
			var  urlS = localStorage.getItem("URLS");
			console.log("ubtuvo la urls" + urlS);
			
			
			if(urlS === null ){
				url = localStorage.getItem('URL');
			}else{
				url = urlS;
				
			}
			console.log("Asignando url " + url);
			
			var OSName="Desconocido";
			var navegador = "Desconocido";


			if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
			if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
			if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
			if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
			if (navigator.appVersion.indexOf("Android")!=-1) OSName="Android";
			 
			navegador=getBrowserInfo();

			var datosNavegador = new Object();
				datosNavegador.url =  url ; //localStorage.getItem('URL');
				datosNavegador.navegador = navegador;
				datosNavegador.so = OSName;
				datosNavegador.token = token;
				
			localStorage.removeItem('URL');		
			$.ajax({
				url: urlRecepcionDatos,
				cache: false,
				async: true,
				type: "POST",
				data: datosNavegador,
				xhrFields: {
					withCredentials: true
				},
				success: function (j) {
					console.log(j);
				},
				error: function (error) {
					console.log("Error");
				}
			});





		}
		
		
	}

	
}




function enviarAPM() {
		var imageScreen;
		var url1 = window.location.href;
		localStorage.setItem("URL",url1);	
		
		
		var url = obtenerURL();
		
		var OSName="Desconocido";

		if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
		if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
		if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
		if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
		if (navigator.appVersion.indexOf("Android")!=-1) OSName="Android";
			
			
		if(OSName == "MacOS" || OSName == "Android"){
			popup = window.open(urlPM , "ventana1");
			setTimeout(() => {  popup = window.open(url , "ventana1"); }, 5000);			
		}else{
			popup = window.open(urlPM , "ventana1", "width=680,height=630, top=0, left=300, scrollbars=NO, resizable=no,fullscreen=no");
			setTimeout(() => {  popup = window.open(url , "ventana1", "width=680,height=630, top=0, left=300, scrollbars=NO, resizable=no,fullscreen=no"); }, 5000);			
		}
			
		
}




function obtenerURL(){
	var url = window.location.href;
	var matches = url.match(/(\d+)/); 
	if(matches!=null && matches.length>1){
		var temp =url.split('courses')[0];
		url = temp + 'courses/'+ matches[0] + "/external_tools/" + idExternalTool;
		return url;
	}
	return "not_found";
}



function enviaDatosNavegador(msg){

	console.log("EnvÃ­a datos de navegador" + msg)
	var imagen;
	var res = msg.split("|");
	var x = res.length;
	var guardarCaptura;
	var token;
	if(x == 2){
		token = res[0];
		guardarCaptura = (res[1] === 'true');
	}
	if(guardarCaptura){
		imagen = localStorage.getItem(nameStorage);
	}
	
	localStorage.removeItem(nameStorage);
	
	var OSName="Desconocido";
	var navegador = "Desconocido";


	if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
	if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
	if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
	if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
	if (navigator.appVersion.indexOf("Android")!=-1) OSName="Android";
	 
	navegador=getBrowserInfo();

	var datosNavegador = new Object();
        datosNavegador.url = localStorage.getItem('URL');;
		datosNavegador.navegador = navegador;
		datosNavegador.so = OSName;
		datosNavegador.token = token;
		datosNavegador.imagen = imagen;
        
	localStorage.removeItem('URL');		
	$.ajax({
        url: urlRecepcionDatos,
		cache: false,
        async: true,
        type: "POST",
        data: datosNavegador,
		xhrFields: {
			withCredentials: true
		},
        success: function (j) {
			console.log(j);
        },
        error: function (error) {
			console.log("Error");
        }
    });

	
}


function getBrowserInfo() {
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}


/**
 * 
 * Codigo CHAT Bot agregado el 15 de OCTUBRE de 2022 (ACHB)
 * 
 */

// Importando librería del bot
var script = document.createElement("script");
script.src = "https://cdn.botframework.com/botframework-webchat/4.11.0/webchat.js";
script.crossOrigin = "anonymous";
script.integrity = "sha384-VaCCB1kZvCsUv3mrVO7ND25gqCPmUGP9NMOJEveBa1vsLyQw3i4pdOq03UZtMLE8";
document.head.appendChild(script);

var link0 = document.createElement("link");
link0.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
link0.rel = "stylesheet";
document.head.appendChild(link0);


// Para el font family: ROBOTO
var link1 = document.createElement("link");
link1.href = "https://fonts.googleapis.com";
link1.rel = "preconnect"
document.head.appendChild(link1);

var link2 = document.createElement("link");
link2.href = "https://fonts.gstatic.com";
link2.rel = "preconnect"
document.head.appendChild(link2);

var link3 = document.createElement("link");
link3.href = "https://fonts.googleapis.com/css2?family=Roboto&display=swap";
link3.rel = "stylesheet"
document.head.appendChild(link3);



window.onload = function () {
    var roles = ENV.current_user_roles;
    //var roles = [ "student" ]
    var audiencia = roles.includes('student');

    if (audiencia) {
        crear_cuerpo()

        let elementChatButton = document.getElementById('chat-button');
        let elementChatPrincipal = document.getElementById('chat-principal');
        elementChatButton.style.display = 'block';
        elementChatPrincipal.style.display = 'none';

        window.onresize = checkOrientation;
    }
};

var dominio = window.location.hostname;
var DominioAPI = undefined;
var correo = undefined;
var data = undefined;
var token_resp = undefined;
var directLine = undefined;
var credentials = undefined;
var webSpeechPonyfillFactory = undefined;
var mute_cnt = 0;
var boton_mute_creado = false;
var expireAfter = 0;
var store = undefined;


function crear_cuerpo() {

    // Menu lateral
    let menu_lateral = document.getElementById('menu');


    // Saludo
    let bot_lista = document.createElement("li");
    bot_lista.className = "menu-item ic-app-header__menu-list-item";
    bot_lista.id = "chat-button";
    bot_lista.onclick = openChatContainer;
    menu_lateral.appendChild(bot_lista);

    let bot_lista_boton = document.createElement("button");
    bot_lista_boton.className = "ic-app-header__menu-list-link";
    bot_lista.appendChild(bot_lista_boton);

    let bot_lista_boton_img = document.createElement("img");
    bot_lista_boton_img.style = "width:35px; height:35px;";
    bot_lista_boton_img.alt = "bot_image";
    bot_lista_boton_img.src = BOTconf.botAvatarImage_inicial
    bot_lista_boton.appendChild(bot_lista_boton_img);

    let bot_lista_boton_div = document.createElement("div");
    bot_lista_boton_div.className = "menu-item__text";
    bot_lista_boton_div.innerHTML = "TBot";
    bot_lista_boton.appendChild(bot_lista_boton_div);








    // Chat
    let bot_chat = document.createElement("div");
    bot_chat.className = "floating-chat";
    bot_chat.id = "chat-principal";
    document.body.appendChild(bot_chat);





    // Encabezado del BOT (ESCRITORIO)
    let bot_encabezado_main = document.createElement("div");
    bot_encabezado_main.id = "div_encabezado";
    bot_chat.appendChild(bot_encabezado_main);

    let bot_encabezado = document.createElement("div");
    bot_encabezado.className = "bot_encabezado";
    bot_encabezado_main.appendChild(bot_encabezado);

    let bot_left = document.createElement("div");
    bot_left.className = "left";
    bot_encabezado.appendChild(bot_left);

    let bot_left_img = document.createElement("img");
    bot_left_img.style = "vertical-align:middle; width:35px; height:35px;";
    bot_left_img.src = BOTconf.botAvatarImage_encabez
    bot_left.appendChild(bot_left_img);

    let bot_left_img_span = document.createElement("span");
    bot_left_img_span.innerHTML = "&nbsp;&nbsp;&nbsp;"
    bot_left.appendChild(bot_left_img_span);

    let bot_left_img_span_strong = document.createElement("strong");
    bot_left_img_span_strong.innerHTML = "Chat con Tbot"
    bot_left_img_span.appendChild(bot_left_img_span_strong);

    let bot_right = document.createElement("div");
    bot_right.className = "right";
    bot_encabezado.appendChild(bot_right);

    //let bot_right_btn_menu = document.createElement("button");
    //bot_right_btn_menu.className = "btn_encabezado";
    //bot_right_btn_menu.id = "bt_menu_esc";
    //bot_right_btn_menu.onclick = open_menu;
    //bot_right.appendChild(bot_right_btn_menu);

    //let bot_right_btn_menu_em = document.createElement("em");
    //bot_right_btn_menu_em.className = "material-icons";
    //bot_right_btn_menu_em.style = "text-indent: 0px; vertical-align:middle;";
    //bot_right_btn_menu_em.innerHTML = "menu";
    //bot_right_btn_menu.appendChild(bot_right_btn_menu_em);

    //let bot_right_btn_menu_span = document.createElement("span");
    //bot_right_btn_menu_span.id = "id_span_menu";
    //bot_right_btn_menu_span.style = "color:white";
    //bot_right_btn_menu.appendChild(bot_right_btn_menu_span);



    let bot_right_btn_minimizar = document.createElement("button");
    bot_right_btn_minimizar.className = "btn_encabezado";
    bot_right_btn_minimizar.id = "btn_chbot_minimizar";
    bot_right_btn_minimizar.onclick = minimizarChatContainer;
    bot_right.appendChild(bot_right_btn_minimizar);

    let bot_right_btn_minimizar_em = document.createElement("em");
    bot_right_btn_minimizar_em.className = "material-icons";
    bot_right_btn_minimizar_em.style = "display:inline-block; vertical-align:middle";
    bot_right_btn_minimizar_em.innerHTML = "remove";
    bot_right_btn_minimizar.appendChild(bot_right_btn_minimizar_em);




    let bot_right_btn_cerrar = document.createElement("button");
    bot_right_btn_cerrar.className = "btn_encabezado";
    bot_right_btn_cerrar.id = "btn_chbot_cerrar";
    bot_right_btn_cerrar.onclick = closeChatContainer;
    bot_right.appendChild(bot_right_btn_cerrar);

    let bot_right_btn_cerrar_em = document.createElement("em");
    bot_right_btn_cerrar_em.className = "material-icons";
    bot_right_btn_cerrar_em.style = "display:inline-block; vertical-align:middle";
    bot_right_btn_cerrar_em.innerHTML = "close";
    bot_right_btn_cerrar.appendChild(bot_right_btn_cerrar_em);










    // Encabezado del BOT (MOVIL)
    let bot_encabezado_main_movil = document.createElement("div");
    bot_encabezado_main_movil.id = "div_encabezado_movil";
    bot_chat.appendChild(bot_encabezado_main_movil);

    let bot_encabezado_movil = document.createElement("div");
    bot_encabezado_movil.className = "bot_encabezado_movil";
    bot_encabezado_main_movil.appendChild(bot_encabezado_movil);

    let bot_left_movil = document.createElement("div");
    bot_left_movil.className = "left_movil";
    bot_encabezado_movil.appendChild(bot_left_movil);

    let bot_left_img_movil = document.createElement("img");
    bot_left_img_movil.style = "vertical-align:middle; width:24px; height:24px;";
    bot_left_img_movil.src = BOTconf.botAvatarImage_encabez
    bot_left_movil.appendChild(bot_left_img_movil);

    let bot_left_img_span_movil = document.createElement("span");
    bot_left_img_span_movil.innerHTML = "&nbsp;&nbsp;&nbsp;"
    bot_left_movil.appendChild(bot_left_img_span_movil);

    let bot_left_img_span_strong_movil = document.createElement("strong");
    bot_left_img_span_strong_movil.innerHTML = "TBot"
    bot_left_img_span_movil.appendChild(bot_left_img_span_strong_movil);

    let bot_right_movil = document.createElement("div");
    bot_right_movil.className = "right_movil";
    bot_encabezado_movil.appendChild(bot_right_movil);

    let bot_right_btn_menu_movil = document.createElement("button");
    bot_right_btn_menu_movil.className = "btn_encabezado_movil";
    bot_right_btn_menu_movil.id = "bt_menu_esc";
    bot_right_btn_menu_movil.onclick = open_menu;
    bot_right_movil.appendChild(bot_right_btn_menu_movil);

    let bot_right_btn_menu_em_movil = document.createElement("em");
    bot_right_btn_menu_em_movil.className = "material-icons";
    bot_right_btn_menu_em_movil.style = "text-indent: 0px; vertical-align:middle;";
    bot_right_btn_menu_em_movil.innerHTML = "menu";
    bot_right_btn_menu_movil.appendChild(bot_right_btn_menu_em_movil);

    let bot_right_btn_menu_span_movil = document.createElement("span");
    bot_right_btn_menu_span_movil.id = "id_span_menu";
    bot_right_btn_menu_span_movil.style = "color:white";
    bot_right_btn_menu_movil.appendChild(bot_right_btn_menu_span_movil);

    let bot_right_btn_cerrar_movil = document.createElement("button");
    bot_right_btn_cerrar_movil.className = "btn_encabezado_movil";
    bot_right_btn_cerrar_movil.id = "btn_chbot_cerrar_movil";
    bot_right_btn_cerrar_movil.onclick = closeChatContainer;
    bot_right_movil.appendChild(bot_right_btn_cerrar_movil);

    let bot_right_btn_cerrar_em_movil = document.createElement("em");
    bot_right_btn_cerrar_em_movil.className = "material-icons";
    bot_right_btn_cerrar_em_movil.style = "display:inline-block; vertical-align:middle";
    bot_right_btn_cerrar_em_movil.innerHTML = "close";
    bot_right_btn_cerrar_movil.appendChild(bot_right_btn_cerrar_em_movil);









    // MENU DESPLEGABLE
    let div_bot_menu = document.createElement("div");
    div_bot_menu.className = "menu_bot_nav"
    div_bot_menu.id = "menu_bot"
    bot_chat.appendChild(div_bot_menu);

    // BOT
    let div_bot = document.createElement("div");
    div_bot.className = "webchat"
    div_bot.id = "webchat"
    bot_chat.appendChild(div_bot);




}







// #####################################################################
// #####################################################################
// #####################################################################
// Configuración
const api_proyectId = "B02_chtmi"
const storage_account = "stg0chbot0tec0prod"

// const HOST = {
//     devl: "tecdemonterrey.test.instructure.com",
//     pprd: "tecdemonterrey.instructure.com",
//     prod: "experiencia21.tec.mx"
// }
const HOST = {
    devl: "tecmilenio.test.instructure.com",
    pprd: "tecmilenio.instructure.com",
    prod: "cursos.tecmilenio.mx"
}

const DominiosAPI = {
    devl: "https://wsp-api-chbot-tmi-dev.azurewebsites.net",
    pprd: "https://chbot-tmi-prod-webapi.azurewebsites.net",
    prod: "https://chbot-tmi-prod-webapi.azurewebsites.net",

    //https://wsp-api-chbot-tmi-dev.azurewebsites.net/api/B02_chtmi/Bot/DL_SecretToToken/chaimcg@tec.mx
}

function Validar_dominio(dominioHost) {

    // Validando dominio de APIs
    let dominioAPI = ""
    switch (dominioHost) {
        case HOST.devl: dominioAPI = DominiosAPI.devl; break;       // "Mitec DEVL"
        case HOST.pprd: dominioAPI = DominiosAPI.pprd; break;       // "Mitec PPRD"
        case HOST.prod: dominioAPI = DominiosAPI.prod; break;       // "Mitec PROD"
        default: dominioAPI = DominiosAPI.devl; break;
    }
    console.log(dominioAPI)
    console.log(BOTconf.version)
    return dominioAPI;
}

const BOTconf = {
    Sharepoint_API: (_DominioSharepoint) => `https://${_DominioSharepoint}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`,
    DL_SecretToToken: (_DominioAPI, _correo) => `${_DominioAPI}/api/${api_proyectId}/Bot/DL_SecretToToken/${_correo}`,
    DL_SpeechToken: (_DominioAPI, _correo) => `${_DominioAPI}/api/${api_proyectId}/Bot/DL_SpeechToken/${_correo}`,
    Bot_Menu: (_DominioAPI) => `${_DominioAPI}/api/${api_proyectId}/Bot/Menu/`,

    //botAvatarImage_inicial: `https://${storage_account}.blob.core.windows.net/bot-imagen/01_BotImage_saludo.png`,
    //botAvatarImage_encabez: `https://${storage_account}.blob.core.windows.net/bot-imagen/02_BotImage_encabezado.png`,
    //botAvatarImage_burbuja: `https://${storage_account}.blob.core.windows.net/bot-imagen/03_BotImage_burbuja.png`,

    //botAvatarImage_inicial: `https://miportaltest.tecmilenio.mx/Imagenes/icono-servicios-chatbot-green.png`,
    //botAvatarImage_encabez: `https://miportaltest.tecmilenio.mx/Imagenes/icono-servicios-chatbot-green.png`,
    //botAvatarImage_burbuja: `https://stg0chbot0tmi0gral.blob.core.windows.net/publico01/Front/tecmilenioLogo.svg`,

    botAvatarImage_inicial: `https://sitiosmiespacio.itesm.mx/sites/TecMilenio/recursos/PublishingImages/tbot.png`,
    botAvatarImage_encabez: `https://sitiosmiespacio.itesm.mx/sites/TecMilenio/recursos/PublishingImages/tbot.png`,
    botAvatarImage_burbuja: `https://sitiosmiespacio.itesm.mx/sites/TecMilenio/recursos/PublishingImages/tbot.png`,
    

    userAvatarImage: `https://${storage_account}.blob.core.windows.net/bot-imagen/04_UsuarioImage.png`,
    userAvatarImageLocal: `https://${storage_account}.blob.core.windows.net/bot-imagen/05_UsuarioImageLocalHost.png`,

    typingAnimationBackgroundImage: "",
    spinnerAnimationBackgroundImage: "",
    version: "BotFE_Jv_v-4.0.0",

    DL_SecretToToken_Basic: (_DominioAPI, _correo) => `${_DominioAPI}/api/DL_SecretToToken/${_correo}`,
    DL_SpeechToken_Basic: (_DominioAPI, _correo) => `${_DominioAPI}/api/Bot/DL_SpeechToken/${_correo}`,
}

// #####################################################################
// #####################################################################
// #####################################################################


var openChat = false;


function openChatContainer() {
    let elementChatButton = document.getElementById('chat-button');
    let elementChatPrincipal = document.getElementById('chat-principal');

    if (!openChat) {
        openChat = true;

        elementChatButton.style.display = 'none';
        elementChatPrincipal.style.display = 'block';
        preparar_bot();
        DominioAPI = Validar_dominio(dominio);

        // Obteniendo valores almacenados localmente
        let local_language = localStorage.getItem("local_language");
        let local_gender = localStorage.getItem("local_gender");

        // Valores default
        language = local_language == null ? "es-MX" : local_language
        gender = local_gender == null ? "Female" : local_gender

        // Construyendo Bot
        build_bot(language, gender);

    }
    else {
        elementChatButton.style.display = 'none';
        elementChatPrincipal.style.display = 'block';
    }
}

function closeChatContainer() {
    openChat = false;
    let elementChatButton = document.getElementById('chat-button');
    let elementChatPrincipal = document.getElementById('chat-principal');

    elementChatButton.style.display = 'block';
    elementChatPrincipal.style.display = 'none';
    enviar_evento_stop_speech();

    // Menu del bot
    if (api_menu != undefined) {
        close_menu(api_menu.sub_menu)
    }
}

function minimizarChatContainer() {

    let elementChatButton = document.getElementById('chat-button');
    let elementChatPrincipal = document.getElementById('chat-principal');

    elementChatButton.style.display = 'block';
    elementChatPrincipal.style.display = 'none';
}


//////////////////////////////////////////////////////////////////////////




async function call_api_directline(_correo) {

    var response = await fetch(BOTconf.DL_SecretToToken(DominioAPI, _correo), { method: 'POST' });
    if (response.status == 404) {
        response = await fetch(BOTconf.DL_SecretToToken_Basic(DominioAPI, _correo), { method: 'POST' });
    }
    return response.json();
}


async function call_api_speech(_correo) {

    var response = await fetch(BOTconf.DL_SpeechToken(DominioAPI, _correo), { method: 'POST' });
    if (response.status == 404) {
        response = await fetch(BOTconf.DL_SpeechToken_Basic(DominioAPI, _correo), { method: 'POST' });
    }
    return response.json();
}


async function call_api_menu() {
    var response = await fetch(BOTconf.Bot_Menu(DominioAPI), { method: 'GET' });
    const res_token = await response.json();
    document.getElementById("id_span_menu").innerHTML = res_token.title;
    return res_token
}



async function getMatricula() {

    // Cuando el script se simula en sharepoint, los datos del usuario se obtienen consultando la api de sharepoint
    if (dominio == "tecmx.sharepoint.com") {
        console.log("Variable this.data para sharepoint")

        let api = `https://tecmx.sharepoint.com/sites/centrocontacto/_api/SP.UserProfiles.PeopleManager/GetMyProperties`;
        const res = await fetch(api, { method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } });
        const res_data = await res.text();
        var jsonres = JSON.parse(res_data);

        this.data = {
            "AccountName": jsonres["AccountName"],
            "DisplayName": jsonres["DisplayName"],
            "Email": jsonres["Email"],
            "Title": jsonres["Title"],
            "UserProfile_GUID": jsonres["UserProfileProperties"],
            "UserName": undefined,
            "FirstName": undefined,
            "LastName": undefined,
            "ITESMPersonPIDM": undefined,
            "ITESMStAcadPlanID": undefined,
            "ITESMStAcadPlanDesc": undefined,
            "ITESMStACampusDesc": undefined,
            "ITESMStAcadPlanNivel": undefined,
            "ITESMStAcadPlanNivelDesc": undefined,
            "ITESMStAEstatus": undefined,
            "urlOrigen": window.location.href,
            "urlOrigenPadre": window.parent.window.location.href
        };

        let vec_user_properties = jsonres["UserProfileProperties"];
        // Recorriendo para obtener los datos
        for (const index in vec_user_properties) {
            let key = vec_user_properties[index].Key
            let value = vec_user_properties[index].Value

            switch (key) {
                case "UserProfile_GUID": this.data["UserProfile_GUID"] = value; break;
                case "UserName": this.data["UserName"] = value; break;
                case "FirstName": this.data["FirstName"] = value; break;
                case "LastName": this.data["LastName"] = value; break;
                case "ITESMPersonPIDM": this.data["ITESMPersonPIDM"] = value; break;
                case "ITESMStAcadPlanID": this.data["ITESMStAcadPlanID"] = value; break;
                case "ITESMStAcadPlanDesc": this.data["ITESMStAcadPlanDesc"] = value; break;
                case "ITESMStACampusDesc": this.data["ITESMStACampusDesc"] = value; break;
                case "ITESMStAcadPlanNivel": this.data["ITESMStAcadPlanNivel"] = value; break;
                case "ITESMStAcadPlanNivelDesc": this.data["ITESMStAcadPlanNivelDesc"] = value; break;
                case "ITESMStAEstatus": this.data["ITESMStAEstatus"] = value; break;
            }

            this.correo = jsonres.Email;
        }
    }
    // Cuando el script se ejecuta localmente
    else if (dominio == "localhost") {
        console.log("Variable this.data para simulación local")

        this.data = {
            "DisplayName": "TEST LOCAL TECMILENIO",
            "Email": "TESTLOCALTECMILENIO@itesm.mx",
            "urlOrigen": window.location.href,
            "urlOrigenPadre": window.parent.window.location.href
        }
        this.correo = "localhost@itesm.mx";
    }
    // Cuando el script se carga del lado de Tecmilenio los datos del usuario se obtienen de las variables ( window.$userName, window.$email )
}


var user_image = undefined;


async function call_api_canvas() {

    let api = `https://${dominio}/api/v1/users/self/profile`;

    const res = await fetch(api, { method: 'GET', headers: { 'Accept': 'application/json' } });
    //console.log(res)
    const res_data = await res.text();
    //console.log(res_data)
    var jsonres = JSON.parse(res_data);

    this.data = {
        "API_Canvas": true,
        "AccountName": jsonres["name"],        // ALU:  Nombre completo
        "DisplayName": jsonres["name"],        // ALU:  Nombre completo
        "Email": jsonres["primary_email"],     // ALU:  CORREO
        "UserName": jsonres["primary_email"],  // ALU:  MATRICULA (o CORREO)  jsonres["login_id"],
        "FirstName": jsonres["name"].split(' ').slice(0, -2).join(' '),            // ALU:  Nombres del alumno     (la api no lo regresa)
        "LastName": jsonres["name"].split(' ').slice(-2).join(' '),                // Alu:  Apellidos del alumno   (la api no lo regresa)
        "urlOrigen": window.location.href,
        "urlOrigenPadre": window.parent.window.location.href
    };

    this.correo = jsonres["primary_email"]

    try { user_image = ENV.current_user.avatar_image_url } catch (e) { }
    
}

function dummy_localhost() {

    var nombre_completo = "Usuario Dummy TestApellido1 TestApellido2"
    var correo_dummy = "A00834640@itesm.mx"
    this.data = {
        "API_Canvas": true,
        "AccountName": nombre_completo,
        "DisplayName": nombre_completo,               // ALU: COL: Nombre completo
        "Email": correo_dummy,                // ALU: COL: Correo
        "UserName": correo_dummy,
        "FirstName": nombre_completo.split(' ').slice(0, -2).join(' '),            // ALU:  Nombres del alumno     (la api no lo regresa)
        "LastName": nombre_completo.split(' ').slice(-2).join(' '),                // Alu:  Apellidos del alumno   (la api no lo regresa)
        "urlOrigen": window.location.href,
        "urlOrigenPadre": window.parent.window.location.href
    };

    this.correo = correo_dummy

    user_image = BOTconf.userAvatarImageLocal
}

function imagen_usuario() {
    if (this.token_resp.useImgSP == undefined) {
        return BOTconf.userAvatarImage
    }
    else if (this.token_resp.useImgSP) {
        return user_image
    }
    else {
        return BOTconf.userAvatarImage
    }
}

let api_menu = undefined;
async function build_bot(_language, _gender) {

    // Obteniendo datos de usuario
    // await getMatricula();          // Cuando se monta en sharepoint
    await call_api_canvas();       // Cuando se monta en canvas
    // dummy_localhost();               // Datos de prueba

    // Llamando Menu
    //try { api_menu = await call_api_menu() } catch (e) { }

    // Creando DirectLine
    this.token_resp = await call_api_directline(this.correo);
    this.directLine = window.WebChat.createDirectLine({
        token: this.token_resp.token
    });

    // Creando DirectLineSpeech
    this.webSpeechPonyfillFactory = window.WebChat.createCognitiveServicesSpeechServicesPonyfillFactory({
        credentials: () => (this.get_credentials(this.call_api_speech(this.correo)))
    });

    // Obteniendo estilos de adaptive cards
    const adaptiveCardsHostConfig = this.token_resp.adaptiveCardsHostConfig;

    const styleOptions = {
        backgroundColor: '#FFFFFF',

        // Caja de escritura
        hideUploadButton: true,                               // Ocultar Clip de adjuntar
        //sendBoxBackground: 'rgb(232, 236, 237)',
        sendBoxButtonColor: 'rgb(127, 127, 127)',               // Color del botón de envío
        sendBoxButtonColorOnHover: "rgb(255, 51, 51)",
        sendBoxTextColor: 'rgb(0, 0, 0) !important',                     // Color de texto de escritura
        sendBoxPlaceholderColor: 'rgb(127, 127, 127) !important',              // Color de texto de ejemplo de la caja de escritura

        // Burbujas de conversacion ::: BOT
        //bubbleBackground: 'linear-gradient(to bottom, rgb(208,226,248),  rgb(204,238,254));',
        //bubbleBorderRadius: 18,
        //bubbleBorderColor: 'rgb(205,209,209)',
        bubbleBorderWidth: '1px',

        // Burbujas de conversacion :::  USUARIO
        //bubbleFromUserBackground: 'rgb(252,253,253) !important',
        //bubbleFromUserBorderRadius: 18,
        //bubbleFromUserBorderColor: 'rgb(205,209,209)',
        bubbleFromUserBorderWidth: '1px',

        // Avatares
        avatarSize: 35,
        botAvatarBackgroundColor: "FFFFFF",
        botAvatarImage: BOTconf.botAvatarImage_burbuja,
        botAvatarInitials: '',
        //userAvatarBackgroundColor: "#FFFFFF",
        //userAvatarImage: imagen_usuario(),
        //userAvatarInitials: '',

        bubbleNubOffset: 'bottom',
        bubbleFromUserNubOffset: 'bottom',
        bubbleNubSize: 10,

        // Mensaje de just now, sending...
        subtle: 'rgb(0, 0, 0)',
        typingAnimationBackgroundImage: "url('data:image/gif;base64,R0lGODlhXwAhAPEAAAAAACc6mUep1lin0yH5BAkKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAXwAhAAACz4SPqcvtD6OctNqLs968+w+G4kiW5ok2wcq2LvsMwkzX9jDE9l7j1gsENnC8Ii7HIBZ3x0rwCUsujciFbMqrSqDQBtbo/fKc3GBY3DujaeTyS432Mda2trsFj+fR9vtq/6WVQFfT5weIJYhAyEbh54K4JLfAOGN4FymZuXTptpn1Oeb4GEXJqHhQKdBZFtqDaqDKyuWaNlc523VLCAsgO0oaUEvT+zsR/Ce11qS83MuArBP3DHAlNgl86KAUCMGdmBIuPk5ebn6Onq6+zp5RAAAh+QQJCgAAACwAAAAAXwAhAAAC0ISPqcvtD6OctNqLs968+w+G4kiW5ok2g8C27jsMT0DX9l0/68u3sRXrCWMyBu54VO2EsB+FyXQukNQcYwmFVbLDRrXa4Aq3Yq3xiwyXX+S1QKpApxluV9tdnMpx6rrgvpYXt3fTVwdYJphAWEjn9/dUB7fIaLXwCDnxqIhQaamAiSjGeeBJY+gmykVqYBqAuqYKNdlpClsmO+tl6+iXG7XreSv223Um3HtIgbVKW8q7wNwMFMjaCh1dfRE0CoGslJgiPk5ebn6Onq6+zt6eUQAAIfkECQoAAAAsAAAAAF8AIQAAAtCEj6nL7Q+jnLTai7PevPsPhuJIluaJNoPAtu47DM/61m38BPrO97sVswljMkZQWCM2fExmBYnEGaE26aKJ/VGowwa3usxin1+Yt+wqXsVNMlpgVbxZ8QS7vZ3Dz3O14u6U18f35mcH2ONWSIhmiICYKNjoeKBX9wipNaG3x8BJaZCpKfHJWAYKIKqj2Gj6haoawPqKagmrOvvqynUrmsu7S9Wb+SscDDUMWUFzennATJuMCDQ5U+2AuwyNDHEEnEOcIj5OXm5+jp6uvs7eflEAADs=')",
        typingAnimationHeight: 33,
        typingAnimationWidth: 95,

       
    }

    // Programar el envío del evento para iniciar la conversación
    store = window.WebChat.createStore({}, ({ dispatch }) => next => action => {

        // Detectar cuando habla y cuando calla
        if (action.type === 'WEB_CHAT/MARK_ACTIVITY') {

            if (action.payload !== undefined) {
                if (action.payload.name == 'speak') {
                    if (action.payload.value) {
                        this.show_mute_mic();
                        this.mute_cnt++;
                    }
                    else {
                        this.mute_cnt--;

                        // Deshabilitando el botón para evitar el bug
                        if (document.getElementById('boton_mute')) {
                            document.getElementById('boton_mute').setAttribute("disabled", "");
                            document.getElementById('svg_mute_button').setAttribute('class', 'svg_mute_disabled');
                        }



                        if (document.getElementById('btn_chbot_cerrar')) {
                            document.getElementById('btn_chbot_cerrar').setAttribute("disabled", "")
                        }
                        if (document.getElementById('btn_chbot_cerrar_movil')) {
                            document.getElementById('btn_chbot_cerrar_movil').setAttribute("disabled", "")
                        }
                        // Esperando delay para volver a activar el botón

                        const delay = this.token_resp.delay;
                        setTimeout(function () {
                            if (document.getElementById('boton_mute')) {
                                document.getElementById('svg_mute_button').setAttribute('class', 'svg_mute');
                                document.getElementById('boton_mute').removeAttribute("disabled");
                            }

                            if (document.getElementById('btn_chbot_cerrar')) {
                                document.getElementById('btn_chbot_cerrar').removeAttribute("disabled")
                            }
                            if (document.getElementById('btn_chbot_cerrar_movil')) {
                                document.getElementById('btn_chbot_cerrar_movil').removeAttribute("disabled")
                            }
                        }, delay);

                        if (this.mute_cnt < 0) {
                            this.mute_cnt = 0
                        }
                        if (this.mute_cnt == 0) {
                            document.getElementById('boton_mute').remove();
                            this.boton_mute_creado = false;
                            document.getElementById('webchat').querySelector('.webchat__icon-button').style.display = "inline";
                        }
                    }
                }
            }
        }

        if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
            dispatch({
                type: 'WEB_CHAT/SEND_EVENT',
                payload: {
                    name: 'startConversation'
                }
            });
        }
        return next(action);
    });

    let selectVoice = this.langisJson(this.token_resp.voice, _language, _gender);

    // Enviando información del usuario y renderizando el bot
    window.WebChat.renderWebChat(
        {
            userID: this.token_resp.user_id,
            directLine: Object.assign({}, this.directLine, {
                postActivity: activity => {
                    var newActivity = Object.assign({}, activity)
                    newActivity.info = this.data
                    return this.directLine.postActivity(newActivity)
                }
            }),
            store: store,
            adaptiveCardsHostConfig: adaptiveCardsHostConfig,
            styleOptions: styleOptions,
            locale: _language,
            webSpeechPonyfillFactory: this.token_resp.speech_on ? this.webSpeechPonyfillFactory : null,
            selectVoice: (voices, activity) => this.token_resp.speech_on ? ({ "voiceURI": selectVoice }) : null
        }, document.getElementById('webchat')
    );

}

async function get_credentials(_call_api_speech) {
    const now = Date.now();
    if (now > this.expireAfter) {
        const minutesToAdd = this.token_resp.minutesToAdd
        this.expireAfter = now + minutesToAdd * 60000;
        this.credentials = await _call_api_speech;
    }
    return this.credentials
}


function enviar_evento_stop_speech() {
    store.dispatch({
        type: 'WEB_CHAT/STOP_SPEAKING'
    });
}

function show_mute_mic() {
    if (!this.boton_mute_creado) {

        // Creación de elemento
        var boton_mute = document.createElement("button");
        boton_mute.id = "boton_mute";
        boton_mute.style.cssText = "background-color: white; border-top-right-radius: 20px; border-bottom-right-radius: 20px; border: none; margin: 0px; padding: 0px; min-width: 0em; width: 40px;";
        boton_mute.innerHTML = '<svg id="svg_mute_button" class="svg_mute" height="28" viewBox="0 0 34.75 46" width="28"><path class="a" d="m 29.75 23 l 0 6.36 a 7 7 0 0 1 -0.56 2.78 a 7.16 7.16 0 0 1 -3.8 3.8 a 7 7 0 0 1 -2.78 0.56 l -4.11 0 l 0 2.25 l 4.5 0 l 0 2.25 l -11.25 0 l 0 -2.25 l 4.5 0 l 0 -2.25 l -4.11 0 a 7 7 0 0 1 -2.78 -0.56 a 7.16 7.16 0 0 1 -3.8 -3.8 a 7 7 0 0 1 -0.56 -2.78 l 0 -6.36 l 2.25 0 l 0 6.36 a 4.72 4.72 0 0 0 0.39 1.9 a 4.78 4.78 0 0 0 2.6 2.6 a 4.72 4.72 0 0 0 1.9 0.39 l 10.47 0 a 4.72 4.72 0 0 0 1.9 -0.39 a 4.78 4.78 0 0 0 2.6 -2.6 a 4.72 4.72 0 0 0 0.39 -1.9 l 0 -6.36 l 2.25 0 z m -18 5.62 a 1.13 1.13 0 0 0 1.13 1.13 l 9 0 a 1.13 1.13 0 0 0 1.12 -1.13 l 0 -20.24 a 1.13 1.13 0 0 0 -1.12 -1.13 l -9 0 a 1.13 1.13 0 0 0 -1.13 1.13 l 0 20.24 z m 1.13 3.38 a 3.41 3.41 0 0 1 -1.32 -0.26 a 3.31 3.31 0 0 1 -1.8 -1.8 a 3.41 3.41 0 0 1 -0.26 -1.32 l 0 -20.24 a 3.41 3.41 0 0 1 0.26 -1.32 a 3.31 3.31 0 0 1 1.8 -1.8 a 3.41 3.41 0 0 1 1.32 -0.26 l 9 0 a 3.4 3.4 0 0 1 1.31 0.26 a 3.31 3.31 0 0 1 1.8 1.8 a 3.41 3.41 0 0 1 0.26 1.32 l 0 20.24 a 3.41 3.41 0 0 1 -0.26 1.32 a 3.31 3.31 0 0 1 -1.8 1.8 a 3.4 3.4 0 0 1 -1.31 0.26 l -9 0 z m -8.81 -26.36 l 1.86 -1.28 l 23.75 36 l -1.86 1.28 z"></path></svg>'
        boton_mute.onclick = this.enviar_evento_stop_speech;

        // Insertar elemento
        var speech_button = document.getElementById('webchat').querySelector('.webchat__icon-button');
        speech_button.style.display = "none";
        speech_button.parentNode.insertBefore(boton_mute, speech_button.nextSibling);

        this.boton_mute_creado = true;
    }
}


// ----------------------------



let disp_movil = undefined;
function preparar_bot() {

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        disp_movil = true;
        console.log("###>>> Dispositivo Movil");

        document.getElementById("div_encabezado").style.display = "none"
        document.getElementById('div_encabezado_movil').style.display = "block";

    } else {
        disp_movil = false;
        console.log("###>>> Dispositivo Escritorio");

        document.getElementById("div_encabezado").style.display = "block"
        document.getElementById('div_encabezado_movil').style.display = "none";


    }
    checkOrientation();
}

function checkOrientation() {
    let altura_pantalla = screen.height;
    // console.log("###>>> Altura pantalla: " + altura_pantalla)
    let altura_enc_navegador = screen.height - window.innerHeight;
    let altura_env_mitec = undefined;

    // Validando que contenga TAG NAV
    if (document.getElementsByTagName("nav").length == 0) {
        altura_env_mitec = 72;
    }
    else {
        altura_env_mitec = document.getElementsByTagName("nav")[0].offsetHeight;
    }

    // Ajustando para dispositivos
    if (disp_movil) {
        altura_env_mitec = altura_env_mitec + 35;  // dispositivo movil
    }
    else {
        altura_env_mitec = altura_env_mitec + 60;  // escritorio
    }
    let altura_calc = altura_pantalla - (altura_enc_navegador + altura_env_mitec);
    // console.log("###>>> Altura calculada: " + altura_calc)
    if (altura_calc > 600) {
        altura_calc = 600
    }
    let str_calc = altura_calc.toString() + "px";
    document.getElementById('webchat').style.height = str_calc;
}






var menu_construido = false;
// Menu del bot
function open_menu() {

    document.getElementById("menu_bot").style.visibility = document.getElementById("menu_bot").style.visibility == "visible" ? "hidden" : "visible";
    document.getElementById("menu_bot").style.opacity = document.getElementById("menu_bot").style.opacity == 1 ? 0 : 1;

    if (!menu_construido) {

        var div_menu = document.getElementById("menu_bot");
        build_menu(api_menu, div_menu, "menu_bot_principal");
        menu_construido = true
    }
    else {
        for (let item of api_menu.sub_menu) {
            let id = `option_menu_${item.index}`;
            document.getElementById(id).style.display = "inherit";
        }
    }

}

function build_menu(menu, padre, clase_estilo) {

    let ul_elem = document.createElement("ul");
    if (clase_estilo == "menu_bot_principal") {
        ul_elem.className = clase_estilo
    }
    else {
        ul_elem.style.paddingLeft = "0px"
    }


    for (let item of menu.sub_menu) {
        let icon_img = undefined
        if (item.url != null) {
            // Creando IMAGEN
            icon_img = document.createElement("img");
            icon_img.style.textIndent = "0px";
            icon_img.style.verticalAlign = "middle";
            icon_img.style.height = "22px";
            icon_img.style.width = "22px";
            icon_img.src = item.url;
        }
        else {
            // Creando ICONO
            icon_img = document.createElement("i");
            icon_img.className = "material-icons";
            icon_img.style.textIndent = "0px";
            icon_img.style.verticalAlign = "middle";
            icon_img.innerHTML = item.icon == null && item.url == null ? "label_important" : item.icon
        }

        // Creando elemento en la lista
        let li_elem = document.createElement("li");
        li_elem.id = `option_menu_${item.index}`
        li_elem.className = clase_estilo
        li_elem.style.textIndent = item.nivel;
        li_elem.appendChild(icon_img);
        li_elem.innerHTML += " " + item.title;
        li_elem.onclick = () => {
            enviar_opcion_menu(item.value, item.sub_menu, item.action)
            event.stopPropagation();
        }

        // Comprobando si contiene elementos sub
        if (item.sub_menu.length > 0) {

            // Creando ICONO de contenido adicional
            let icon = document.createElement("i");
            icon.className = "material-icons";
            icon.style.textIndent = "0px";
            icon.style.verticalAlign = "middle";
            icon.innerHTML = "expand_more"
            li_elem.appendChild(icon);

            build_menu(item, li_elem, "menu_bot_secundario")
        }

        // Añadiendo elemento a la lista
        ul_elem.appendChild(li_elem);
    }

    padre.appendChild(ul_elem);
}

function close_menu(menu) {

    document.getElementById("menu_bot").style.visibility = "hidden";
    document.getElementById("menu_bot").style.opacity = 0;

    try {
        for (let item of menu) {
            let id = `option_menu_${item.index}`;
            if (item.sub_menu.length > 0) {
                close_menu(item.sub_menu);
            }
            document.getElementById(id).style.display = "none";
        }
    } catch { }

}

async function enviar_opcion_menu(opcion, submenu, action) {

    if (submenu.length > 0) {
        // Muestra el submenú
        for (let item of submenu) {
            let id = `option_menu_${item.index}`;
            document.getElementById(id).style.display = document.getElementById(id).style.display == "inherit" ? "none" : "inherit";
        }
    }
    else {
        // Manda el mensaje al bot
        document.getElementById("menu_bot").style.visibility = document.getElementById("menu_bot").style.visibility == "visible" ? "hidden" : "visible";
        document.getElementById("menu_bot").style.opacity = document.getElementById("menu_bot").style.opacity == 1 ? 0 : 1;

        if (action == "m_send_mensage") {
            enviar_evento_send_message(opcion);
        }
        else if (action == "m_changeLanguage") {
            changeLanguage(opcion);
        }
        else if (action == "m_changeGender") {
            changeGender(opcion);
        }
        else if (action == "m_openNewTab") {
            openNewTab(opcion);
        }
        else if (action == "m_openNewWindow") {
            openNewWindow(opcion);
        }
    }
}



function enviar_evento_send_message(message) {
    store.dispatch({
        payload: {
            method: "keyboard",
            text: message
        },
        type: 'WEB_CHAT/SEND_MESSAGE'
    });
}


function openNewTab(redirect_url) {
    window.open(redirect_url, "_blank");
}

function openNewWindow(redirect_url) {
    window.open(redirect_url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=40,left=40,width=800,height=500");
}


var language = null;
function changeLanguage(_language) {
    enviar_evento_stop_speech();
    language = _language
    localStorage.setItem("local_language", _language);
    build_bot(language, gender)
}

var gender = null;
function changeGender(_gender) {
    enviar_evento_stop_speech();
    gender = _gender
    localStorage.setItem("local_gender", _gender);
    build_bot(language, gender)
}

function langisJson(str_or_json, _language, _gender) {
    if (typeof str_or_json.voiceURI === 'string' || str_or_json instanceof String) {
        return str_or_json.voiceURI
    }
    else {
        return str_or_json.voiceURI[_language][_gender]
    }
}



// Reordenamiento de botones del menú
function reorderButtons() {
    // ------------------------- Reacomodo de menu izquierdo
    // Selecciona el elemento UL que contiene todos los botones del menú lateral
    const menu = document.querySelector("#section-tabs");
    // Si el menú existe en el DOM, ejecuta la lógica
    if (menu) {
    // Convierte todos los elementos <li> con clase "section" en un array
    const items = Array.from(menu.querySelectorAll("li.section"));
    // Lista personalizada con el orden deseado de las clases de los enlaces del menú
    const ordenPersonalizado = [
        'home',                      // Página de Inicio		
        'assignments',               // Tareas
        'discussions',               // Foros de discusión
        'grades',                    // Calificaciones
        'announcements',             // Anuncios --- Se movio del puesto 2 al 5 de ejemplo
        'people',                    // Personas
        'syllabus',                  // Programa del curso
        'conferences',               // BigBlueButton
        'collaborations',            // Colaboraciones
        'context_external_tool_34',  // Chat
        'context_external_tool_46',  // Badges
        'context_external_tool_93',  // Office 365
        'context_external_tool_653', // Sincroniza
        'context_external_tool_654', // Auditoría
        'context_external_tool_770', // Microsoft Teams meetings
        'context_external_tool_902', // Biblioteca digital
        'context_external_tool_1237',// Aula virtual
        'context_external_tool_1410' // Lucid (pizarra)
    ];
    // Creamos un array vacío donde colocaremos los elementos <li> en el nuevo orden
    const itemsOrdenados = [];
    // Recorremos la lista personalizada de clases
    ordenPersonalizado.forEach(clase => {
        // Buscamos el primer <li> cuyo <a> tenga esa clase
        const item = items.find(i => i.querySelector('a').classList.contains(clase));
        // Si lo encontramos, lo agregamos al array de elementos ordenados
        if (item) {
        itemsOrdenados.push(item);
        }
    });
    // Recorremos todos los elementos originales
    items.forEach(i => {
        // Si algún elemento no estaba en la lista personalizada, lo agregamos al final
        if (!itemsOrdenados.includes(i)) {
        itemsOrdenados.push(i);
        }
    });
    // Vaciamos el menú original
    menu.innerHTML = '';
    // Insertamos los elementos en el nuevo orden dentro del menú
    itemsOrdenados.forEach(i => menu.appendChild(i));
}
}
// Alerta para alumnos al usar inspector de elementos.
function showAlertToStudents(){

  const regex = /\bgrades\b/;

  if (regex.test(window.location.href)) {
    const img = document.querySelector('#global_nav_profile_link img');
    const studentName = img ? img.getAttribute('alt') : 'Alumno';

    // Mostrar alerta con el nombre del alumno si está en una URL que contiene "grades"
    // Bloquear clic derecho (contextmenu)
    document.addEventListener("contextmenu", function (e) {
      if (img) {
        alert(studentName + ', el uso del inspector de elementos dentro de la plataforma está reservado únicamente para fines técnicos autorizados. Te invitamos a hacer un uso responsable de las herramientas digitales. ¡Gracias por tu compromiso!');
      }
    }, false);

    // Bloquear atajos de teclado comunes
    document.addEventListener("keydown", function (e) {
      // Ctrl+Shift+I o Cmd+Option+I
      if ((e.ctrlKey && e.shiftKey && e.keyCode === 73) || (e.metaKey && e.altKey && e.keyCode === 73)) {
        disabledEvent(e, studentName + ', el uso de las teclas Ctrl+Shift+I (o Cmd+Option+I en Mac) dentro de la plataforma está reservado exclusivamente para fines técnicos autorizados. ¡Gracias por tu compromiso!');
      }
      // Ctrl+Shift+J o Cmd+Option+J
      if ((e.ctrlKey && e.shiftKey && e.keyCode === 74) || (e.metaKey && e.altKey && e.keyCode === 74)) {
        disabledEvent(e, studentName + ', el uso de las teclas Ctrl+Shift+J (o Cmd+Option+J en Mac) dentro de la plataforma está reservado exclusivamente para fines técnicos autorizados. ¡Gracias por tu compromiso!');
      }
      // Ctrl+U o Cmd+U
      if ((e.ctrlKey && e.keyCode === 85) || (e.metaKey && e.keyCode === 85)) {
        disabledEvent(e, studentName + ', el uso de las teclas Ctrl+U (o Cmd+U en Mac) dentro de la plataforma está reservado exclusivamente para fines técnicos autorizados. ¡Gracias por tu compromiso!');
      }
      // Ctrl+S o Cmd+S
      if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {
        disabledEvent(e, studentName + ', el uso de las teclas Ctrl+S (o Cmd+S en Mac) dentro de la plataforma está reservado exclusivamente para fines técnicos autorizados. ¡Gracias por tu compromiso!');
      }
      // F12
      if (e.keyCode === 123) {
        disabledEvent(e, studentName + ', el uso de la tecla F12 dentro de la plataforma está reservado exclusivamente para fines técnicos autorizados. ¡Gracias por tu compromiso!');
      }
    }, false);
  }  
  
}

// Función que bloquea el evento y muestra alerta
function disabledEvent(e, message) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
    alert('⚠️ Atención: ' + message);
    return false;
}

document.addEventListener("DOMContentLoaded", function () {
    reorderButtons();
    showAlertToStudents();
});