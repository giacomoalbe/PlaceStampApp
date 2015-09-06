// Ionic Starter Appna

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})
.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/add_photo");

  $stateProvider
    .state('add_photo', {
      url: '/add_photo',
      views: {
        'add_photo' : {
          templateUrl: 'templates/add_photo.html',
          controller: 'ImageCtrl'
        }
      }
    })
    /*
    .state('attorno', {
      url: '/attorno',
      views: {
        'attorno': {
          templateUrl: 'templates/attorno.html',
          controller: 'PhotoCtrl'
        }
      }
    })
*/
    .state('cerca', {
      url: '/cerca',
      // Creaiamo un array di parametri 
      // per passare a questa tab dalle foto
      params: { 
        foto: null
      },
      views : {
        'cerca' : {
          templateUrl: 'templates/cerca.html',
          controller: 'SearchCtrl',
          controllerAs: 'vm'
        }
      }
    })
})
// Configurazione del running della App!
.run(function($ionicPlatform, $http) {

  // Per permettere login/logout da e verso il backend
  $http.defaults.xsrfHeaderName = 'X-CSRFToken';
  $http.defaults.xsrfCookieName = 'csrftoken';
  // For CSRF token compatibility with Django
  //$http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
});
