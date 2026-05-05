$(document).ready(function () {

    $('#left-side').addClass('hidden');

    if ($(".button-sidebar-wide i").hasClass('icon-student-view')) {
		$(".pages .header-bar-outer-container").attr('style', 'display: block !important');
        $(".pages .header-bar-outer-container .header-bar-container").attr('style', 'display: block !important');
    }

    if ($(".header-bar span").hasClass('publish-button')) {
        $(".pages .header-bar-outer-container").attr('style', 'display: block !important');
        $(".pages .header-bar-outer-container .header-bar-container").attr('style', 'display: block !important');
    }

    $('.ic-app-course-nav-toggle').click(function () {
        if ($("#left-side").hasClass('hidden')) {
            $("#left-side").removeClass('hidden');
        } else {
            $("#left-side").addClass('hidden');
        }
    });
	
	// Códdigo para desactivar opcion "calcular basándose solo en las tareas calificadas" en el apartado de calificaciones
	
	$("#only_consider_graded_assignments").prop("checked", false).triggerHandler("change");
	
	
	
	
});



