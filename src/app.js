import angular from 'angular';
import router from './app/main/main.router';


angular.module('app', [
  require('angular-ui-router')
])
  .config(function(
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    $urlMatcherFactoryProvider
  ) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $urlMatcherFactoryProvider.strictMode(false);

    $stateProvider.state('404', {
      url: '/404',
      templateUrl: 'views/app/errors/404.html'
    });

    $urlRouterProvider.otherwise('/404');
  })
  .config(router);
