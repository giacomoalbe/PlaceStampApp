(function() {
	angular.module('starter')
	.factory('Compass', function($cordovaDeviceOrientation, $q) {
	  return {
	    getOrientation: getOrientation
	  }

	  function getOrientation() {

	    var defer = $q.defer();

	    $cordovaDeviceOrientation
	      .getCurrentHeading() 
	      .then(successCb, errorCb);

	      function successCb(result) {
	        // Devo verificare che la bussola sia diversa da 0!
	        if (result.magneticHeading == 0) {
	          console.log("La bussola era 0! Ritento!");
	          $cordovaDeviceOrientation
	            .getCurrentHeading() 
	            .then(successCb, errorCb);
	        } else {       
	          defer.resolve({
	             bussola: result.magneticHeading,
	            });
	        }
	      }

	      function errorCb(err) {
	        defer.reject(err);
	      }

	      return defer.promise;
	  }
	});
})();