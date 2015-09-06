(function() {
	angular.module('starter')

	// Service per recuperare immagini e video
	.factory('ImageService', function($http,$cordovaCamera, FileService, $q, $cordovaFile, Compass, Position) {

	  function makeid() {
	    var text = '';
	    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	 
	    for (var i = 0; i < 5; i++) {
	      text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }
	    return text;
	  };
	 
	  function optionsForType(type) {
	    var source;
	    switch (type) {
	      case 0:
	        source = Camera.PictureSourceType.CAMERA;
	        break;
	      case 1:
	        source = Camera.PictureSourceType.PHOTOLIBRARY;
	        break;
	    }
	    return {
	      destinationType: Camera.DestinationType.FILE_URI,
	      sourceType: source,
	      allowEdit: false,
	      encodingType: Camera.EncodingType.PNG,
	      popoverOptions: CameraPopoverOptions,
	      saveToPhotoAlbum: false,
	      quality: 75,
	      targetWidth: 320,
	      targetHeight: 320,
	    };
	  }
	 
	  function saveMedia() {

	    return $q(function(resolve, reject) {
	      var options = optionsForType(0);

	      var resultImage = {
	        url: undefined,
	        compass: undefined,
	        gps: undefined,
	        nomefile: undefined
	      }
	 
	      navigator.camera.getPicture(successCb, errorCb, options);

	      function successCb(imageUrl) {
				
				resultImage.url = imageUrl;

				resultImage.nomefile = makeid() + "_" + imageUrl.substr(imageUrl.lastIndexOf('/') + 1);

		        // Dobbiamo recuperare le informazioni relative alla posizione 
		        // e alla bussola!

		        Compass.getOrientation()
		          .then(successCompassCb, errorCompassCb);

		        function successCompassCb(orientation) {
		            // Proseguo e cerco il gps
		            resultImage.compass = orientation.bussola;
		            Position.getPosition()
		              .then(successPositionCb, errorPositionCb);

		            function successPositionCb(position) {

		              resultImage.gps = position;
		              FileService.storeImage(resultImage);
		              // risolviamo la prima promise
		              resolve();
		            }

		            function errorPositionCb(err) {
		              FileService.storeImage(resultImage);

		              reject({
		                'gps': err.message 
		              })
		            } 
		        }

		        function errorCompassCb(err) {  

		          // Proseguo e cerco il gps con compass = undefined
		            Position.getCurrentPosition()
		              .then(successPositionCb, errorPositionCb);

		            function successPositionCb(position) {
		              // Qui se per errore l'immagine non è riuscita a formarsi
		              // annullo tutto e 
		              resultImage.gps = position;
		              FileService.storeImage(resultImage);
		              // risolviamo la prima promise
		              resolve();
		            }

		            function errorPositionCb(errGPS) {
		              // rigettiamo la prima promise
		              reject({
		                'bussola': err.message,
		                'gps' : errGPS.message
		              });
		            } 
		        }
	      }

	      function errorCb(err) {
	        reject({
	        	'camera': err.message
	        });
	      }

	    })
	  }

	  function getResult(foto) {
	  	
	  	var defer = $q.defer();

	  	$http({
	  		method: 'GET',
	  		url: 'http://giacomoalbe.pythonanywhere.com/foto/',
	  		params: {
	  			lat: foto.latitude,
	  			long: foto.longitude,
	  			id: foto.id
	  		}
	  	})
	  	.then(
		  	function(data) {
		  		defer.resolve(data.data.data);
		  	},
		  	function(err) {
		  		defer.reject(err);
	  	});
	  	return defer.promise;
	  }
	  return {
	    handleMediaDialog: saveMedia,
	    getResult: getResult
	  }
	})
})();