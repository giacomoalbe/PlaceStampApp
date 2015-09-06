(function() {
	angular.module('starter')
	.controller('SearchCtrl', function($scope, $stateParams, $ionicModal, ImageService, $ionicScrollDelegate) {

		var vm = this;

		vm.foto = undefined
		vm.getResult = getResult;
		vm.init = init;
		vm.errors = undefined;
		vm.showModal = showModal;
		vm.closeModal = closeModal;
		vm.noResults = false;

		vm.init();

		function init() {

			if (!vm.loadModal) {
				// Non abbiamo caricato la modal
				$ionicModal.fromTemplateUrl('templates/modal_load.html', function(modal) {
				      vm.loadModal = modal;
				    }, {
				      // Questo è lo scope in cui posso modificare lo stato 
				      // di questa modal! Non posso da altri!!
				      scope: $scope,
				      animation: 'slide-in-up'
				}).then(function(data) {
					vm.getResult();
				});
			} else {
				console.log($stateParams.foto);

				if ($stateParams.foto) {
					vm.getResult();
				}
			}
		}

		function getResult() {
			
			// Recuperiamo l'informazione della foto 
			vm.foto = $stateParams.foto;

			console.log(JSON.stringify(vm.foto));

			if (vm.foto) {
				// Cominciamo a fare la richiesta HTTP al server di mandarci le foto!

				vm.message = "Sto processando la richiesta... Cerco immagini sul server";
				vm.showModal();

				ImageService.getResult(vm.foto)
				.then(
					function(results) {

						if (results.length == 0) {
							// Non abbiamo nessuna foto!
							// Mostriamo una scritta!
							vm.noResults = true;
						} else {
							vm.results = results;
							vm.closeModal();
						}
					},
					function(err) {
						vm.errors = err;
						vm.closeModal();
						console.log(err);
				});	
			}
			
		}

		function showModal() {
			vm.loadModal.show();
		}

		function closeModal() {
			console.log(vm.results);
			vm.loadModal.hide()
			.then(function() {
				vm.message = undefined;
			});
		}
	});
})();