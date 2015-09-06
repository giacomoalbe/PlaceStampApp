(function() {
	angular.module('starter')
	.factory('StorageManager', function($q, $cordovaDevice, $cordovaFile) {

		return {
      getFileContent: getFileContent,
		}

    function getFileContent(fileURL) {
      var defer = $q.defer();

      window.resolveLocalFileSystemURL(fileURL, gotFile, fail);

      function gotFile(fileEntry) {
        fileEntry.file(win);
      }

      function win(file) {
        // Leggiamo il contenuto del file
        var reader = new FileReader();
        reader.onloadend = function(evt) {
          defer.resolve({
            content: btoa(this.result)
          })
        }
        reader.readAsBinaryString(file);
      }

      function fail(err) {
        defer.reject({
          err: JSON.stringify(err)
        })
      }

      return defer.promise;
      // preloader.src = ","+ btoa(this.result);
    }
	});
})();