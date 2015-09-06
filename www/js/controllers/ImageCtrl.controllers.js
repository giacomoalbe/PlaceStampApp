(function() {
  angular.module('starter')
  .controller('ImageCtrl', function($state, $scope, ImageService, FileService, 
                                    PostProgress, StorageManager, $ionicModal) {
    
    var vm = this;

    vm.addImage = addImage;
    vm.discard = discard;
    vm.confirm = confirm;
    vm.loadModal = undefined;
    vm.message = undefined;
    vm.closeModal = closeModal;

    $ionicModal.fromTemplateUrl('templates/modal_load.html', function(modal) {
      vm.loadModal = modal;
    }, {
      // Questo è lo scope in cui posso modificare lo stato 
      // di questa modal! Non posso da altri!!
      scope: $scope,
      animation: 'slide-in-up'
    });



    function discard() {

      vm.image = undefined;
      FileService.deleteAll();

    }

    function closeModal(foto) {

      // Chiudiamo la modal
      vm.loadModal.hide()
      .then(function() {

        if (foto) {
          // Cancelliamo l'immagine 
          vm.image = undefined;
          FileService.deleteAll();

          // Ora instradiamo alla tab ricerca
          // con i dati della foto!
          $state.go('cerca', {foto: foto}, {reload: true})
          .then(function(data) {
            console.log("Dopo lo state go!");
            console.log(data);
          }); 
        }
      });
    }

    function confirm() {

      console.log("Iniziamo il caricamento!");

      // Apro una modal con lo spinner di caricamento
      vm.message = "Carico il contenuto dell'immagine";
      vm.loadModal.show();
      
      // Upload dell'immagine contenuta in $scope.images 
      StorageManager.getFileContent(vm.image.url)
      .then(function(data) {
        
        // Cambiamo il messaggio
        vm.message = "Carico il file sul Server";

        // Ora inviamo il file al server
        PostProgress.post("http://giacomoalbe.pythonanywhere.com/upload/",
          {
            image: data.content, 
            compass: parseInt(vm.image.compass),
            long: vm.image.gps.long,
            lat: vm.image.gps.lat,
            nomefile: vm.image.nomefile
         }
        ).then(function(data) {

          // Finito il caricamento, chiudo la modal
          var foto = JSON.parse($.parseJSON(data.data)).foto
          vm.closeModal(foto);

        }, function(err) {
          vm.message = err.err;
          console.log(err);
        });

      }, function(err) {
        console.log(err);
      })

    }

    function addImage() {

      ImageService.handleMediaDialog()
      .then(function() {
        vm.image = FileService.getImage()[0];
        vm.closeModal();
      }, function(err) {
        console.log(err);
      });

      // Mentre carico la foto voglio far partire il caricamento
      vm.message = "Sto salvando la foto e i dati "
      vm.loadModal.show();

    }
    });
    
})();