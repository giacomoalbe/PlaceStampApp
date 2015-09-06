(function() {
	angular.module('starter')
	.directive('loadImage' , function() {
		return {
			restrict: 'E',
			templateUrl: 'directives/load_image.html',
			link: function(scope, element, attrs) {

				// Creiamo uno spinner mentre la foto si carica
				scope.src = attrs.src;
				scope.cont = $(element).children('div');

				scope.cont.height(scope.cont.width() * 9/16);

				var preloader = new Image();	

				preloader.onload = function() {

					scope.cont.html('<img class="img-load-image"/>');
					scope.cont.children('img').attr('src', preloader.src)
					scope.cont.children('img').hide();
					scope.cont.children('img').fadeIn('slow');
				}

				preloader.src = "http://giacomoalbe.pythonanywhere.com/static/" + scope.src;
			}
		}
	})
})();