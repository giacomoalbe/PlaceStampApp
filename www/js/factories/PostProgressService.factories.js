(function() {

	angular.module('starter')

	.factory('PostProgress', function($q) {
		return {
			post: function(uploadUrl, data, progressCb) {

				// Create the promise 
				var defer = $q.defer();

				// Create teh XHR Object
				var xhr = new XMLHttpRequest();

				// Upload Progress Handler
				xhr.addEventListener('progress', uploadProgress, false);

				function uploadProgress(e) {

					console.log(e);
					var percCompleted;

					if (e.lengthComputable) {
						percentCompleted = Math.round(e.loaded / e.total * 100);
						console.log(percentCompleted);
					}
				};

				xhr.onload = function(e) {
					defer.resolve({
						data: JSON.stringify(xhr.responseText)
					});
				}

				xhr.upload.onerror = function(e) {
					defer.reject({
						err: xhr.responseText ? xhr.responseText : "An unknown error occurred posting to '" + uploadUrl + "'",
						xhr: JSON.stringify(xhr)
					});
				}

				var formData = new FormData();

				// Aggiungo i file alla form data
				if (data) {
					Object.keys(data).forEach(function(key) {
						formData.append(key, data[key]);
					});
				}

				// Faccio partire la chiamata XHR
				xhr.open("POST", uploadUrl);
				xhr.send(formData);

				return defer.promise;
			}
		}
	});
})();