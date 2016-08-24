import angular from 'angular';
import router from './routes';


angular
  .module('app', [
    require('angular-ui-router')
  ])
  .config(router);
