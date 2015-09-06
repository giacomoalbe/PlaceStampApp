(function() {
	angular.module('starter')
	.factory('Position', function($cordovaGeolocation, $q) {
	  return {
	    getPosition: getPosition
	  }

	  function getPosition() {

	      var posOpt = {timeout: 20000, enableHighAccuracy: true};

	      var defer = $q.defer();

	      $cordovaGeolocation
	        .getCurrentPosition(posOpt)
	        .then(successPositionCb, errorPositionCb);

	      function successPositionCb(location) {

	        console.log("Ok con GPS da dentro Position");
	        defer.resolve({
	          lat: location.coords.latitude,
	          long: location.coords.longitude
	        });
	      }

	      function errorPositionCb(err) {
	        console.log(err);
	        defer.reject(err)
	      };

	      return defer.promise;
	  }
	})
})();