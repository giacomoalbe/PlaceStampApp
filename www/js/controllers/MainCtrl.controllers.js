(function() {
	angular.module('starter')
	.controller('MainCtrl', function($rootScope, $scope, $ionicModal) {

	// $scope vars
	$scope.modal_title = "Accedi o Registrati";
	$scope.erroriPresenti = false;
	$scope.isIscriviti = false;

	// $scope funct
	$scope.openModal = openModal;
	$scope.submitForm = submitForm;
	$scope.closeModal = closeModal;
	$scope.openModal = openModal;
	$scope.showIscriviti = showIscriviti;
	$scope.logout = logout;

	$rootScope.$on('$stateChangeStart', 
	function(event, toState, toParams, fromState, fromParams){
		//console.log("Da: " + fromState + " A: " + toState);
		console.log(fromState);
		console.log(toState);
	});

	// $scope watches
	$scope.$watch('currentUser', currentUserWatch);

	// IMPLEMENTATION

	// Create and load the Modal
  	$ionicModal.fromTemplateUrl('templates/modal_login.html', function(modal) {
    	$scope.loginModal = modal;
  	}, {
    	scope: $scope,
    	animation: 'slide-in-up'
  	});

	function openModal() {
		// Dobbiamo far partire la modal che permette di iscriversi
		// oppure di loggarsi
		$scope.loginModal.show();
	}

	function closeModal() {
		
		$scope.loginModal.hide()
			.then(function() {
				if ($scope.isIscriviti) {
					$scope.isIscriviti = false;
					$scope.modal_title = "Accedi o Registrati";
				}
			});
	}

	function submitForm(user) {
		// Qui dobbiamo chiamare il servizio di Autenticazione
		// e quindi salvare questo dato dentro il servizio 

		// Far iniziare a girare lo spinner?

		// Autentico l'utente
		Users.autentica(user)
		.then(function(data) {
				// Inserisci l'utente nel servizio user
				Users.setCurrentUser(data);
				$scope.currentUser = data;

				$scope.errorMessage = "";
				$scope.erroriPresenti = false;

				// Riportiamo la form a ""
				user.password = "";
				user.username = "";

				$scope.loginModal.hide();

			},
			function(err) {
				$scope.erroriPresenti = true;
				$scope.errorMessage = err.data.message;
		});
	}

	// Attacchiamo un watch alla variabile setCUrrentUser
	function currentUserWatch(value) {

		if (isEmpty(value) || value == undefined) {

			$scope.modal_title = "Accedi o Registrati";
			$('.foto-profilo .numero').html('');

		} else { 

			$('.foto-profilo .numero').html(value.id);
			$scope.modal_title = "Logout";

		}
	}

	function logout() {
		Users.logout()
		.then(function(data) {	
			$scope.loginModal.hide()
				.then(function(data) {
					$scope.currentUser = undefined;
				});
		},
		function(err) {
			console.log("Errore in logout");
		});
	}


	function showIscriviti() {
		$scope.isIscriviti = true;
		$scope.modal_title = "Iscriviti";
	}
})
})();