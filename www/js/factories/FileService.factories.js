(function() {
	angular.module('starter')

	.factory('FileService', function($q, $cordovaFile) {
	  var images = [];
	  var IMAGE_STORAGE_KEY = 'images';
	 
	  function getImages() {
	    var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
	    if (img) {
	      images = JSON.parse(img);
	    } else {
	      images = [];
	    }
	    return images;
	  };
	 
	  function addImage(img) {
	    images.push(img);
	    window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
	  };

	  function deleteAll() {
	    window.localStorage.setItem(IMAGE_STORAGE_KEY, [])
	    images = [];
	  }

	  function copy(imageUrl, newID) {

		  	var defer = $q.defer();

		  	var self = this;
		  	var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
		  	var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);

		  	var newName = newID + "_" + name;

		  	$cordovaFile.copyFile(namePath, 					// vecchio path
		  						  name, 						// vecchio nome
		  						  namePath, 	// nuova destinazione
		  						  newName)						// nuovo nome
	          .then(function(info) {
	            console.log(JSON.stringify(info));
	            console.log(namePath + newName);
	            defer.resolve({
	            	url: namePath + newName,
	            	nomefile: newName
	            });
	          }, function(e) {
	            defer.reject({
	                	err: e,
	                	causa: "Non sono riuscito a copiare il file nella destinazione!"
	                })
	          });
	        /*
	        // Qui dobbiamo salvare imageUrl all'interno della directory cordova.file.data.Directory  
	        // Risolviamo l'url della nostra immagine appena creata
	        window.resolveLocalFileSystemURL(imageUrl, copySuccessCb, copyFailCb);

	        function copySuccessCb(fileEntry) {
	          // Ora dobbiamo spostare questo file in cordova.file.dataDirectory

	          // In fileEntry è contenuto un oggetto che ci permette di accedere al file nel filesystem
	          var newName = newID + fileEntry.name;

	          window.resolveLocalFileSystemURL(cordova.file.dataDirectory, dataSuccessCb, dataFailCb);

	          function dataSuccessCb(dataDirectory) {
	            // Copiamo il file entry precendente (l'immagine) in questa nuova posizione
	            // ovvero dataDirectory
	            fileEntry.copyTo(
	              dataDirectory, // dove copiare
	              newName,       // nuovo nome
	              onCopySuccess, // success Cb
	              onCopyFail     // fail Cb 
	              );

	              function onCopySuccess(entry) {
	              	// Qui potremmo anche recuperare il contenuto dell'immagine per visualizzarla?
	                defer.resolve({
	                	url: entry.nativeURL
	                });
	              }

	              function onCopyFail(err) {
	                defer.reject({
	                	err: err,
	                	causa: "Non sono riuscito a copiare il file nella destinazione!"
	                })
	              }
	            }

	            function dataFailCb(err) {
	                defer.reject({
	                	err: err,
	                	causa: "Non trovo la destinazione!"
	                })
	            }
	        }
	        function copyFailCb(err) {
	            defer.reject({
	        		err: err,
	        		causa: "Non sono riuscito a recuperare l'imageUrl!"
	        	})
	        }
	        */

	        return defer.promise;
	      
	  }

	  function mockPhotos() {
	  	return [
	  		{
	  			url: 'img/prova.jpg',
	  			bussola: 63.123,
	  			gps: {
	  				'latitude': 43.123,
	  				'longitude': 10.898
	  			}
	  		},
	  		{
	  			url: 'img/prova.jpg',
	  			bussola: 63.123,
	  			gps: {
	  				'latitude': 43.123,
	  				'longitude': 10.898
	  			}
	  		},
	  		{
	  			url: 'img/prova.jpg',
	  			bussola: 63.123,
	  			gps: {
	  				'latitude': 43.123,
	  				'longitude': 10.898
	  			}
	  		},
	  		{
	  			url: 'img/prova.jpg',
	  			bussola: 63.123,
	  			gps: {
	  				'latitude': 43.123,
	  				'longitude': 10.898
	  			}
	  		}
	  	]
	  }
	 
	  return {
	    storeImage: addImage,
	    getImage: getImages,
	    deleteAll: deleteAll,
	    copyToData: copy,
	    mock: mockPhotos
	  }
	})
})();