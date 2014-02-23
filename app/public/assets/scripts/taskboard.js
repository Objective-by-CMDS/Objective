$(document).ready(function(){

	var $container = $('#masonryContainer');
	$container.masonry({ gutter: '.gutter-sizer', columnWidth: '.grid-sizer', itemSelector: '.taskitem' });
	$container.masonry('bindResize');

	$('.completebutton').hover(function() {
		$(this).children('.checkmark').toggleClass('active');
	});
	$('.completebutton').click(function() {
		$(this).closest('.taskitem').fadeOut('300', function(){
			$(this).remove();
			$container.masonry();
		});
		$.ajax({
			url: "/delete?id=" + $(this).attr('data-id'),
			type: 'GET',
			success: console.log('Successfully deleted task!')
		});
	});
});