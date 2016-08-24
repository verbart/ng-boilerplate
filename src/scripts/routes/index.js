function router($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');

  $urlRouterProvider.otherwise("/404");

  $stateProvider
    .state('main', {
      url: "/",
      templateUrl: "templates/pages/main.html"
    })
    .state('404', {
      url: "/404",
      templateUrl: "templates/pages/errors/404.html"
    })
}

export default router;
