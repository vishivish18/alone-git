angular.module('app')
    .config(function($stateProvider, $urlRouterProvider,$locationProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: '/nav.html'
                    },
                    'content': {
                        templateUrl: '/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })

        .state('app.login', {
            url: 'login',
            views: {
                'header': {
                    templateUrl: '/nav.html'
                },
                'content': {
                    templateUrl: '/login.html',
                    controller: 'LoginCtrl'

                }
            }
        })

        .state('app.register', {
            url: 'register',
            views: {
                'content@': {
                    templateUrl: 'register.html',
                    controller: 'RegisterCtrl'
                }
            }

        })

        .state('app.home', {
            url: 'home',
            views: {
                'content@': {
                    templateUrl: 'home.html',
                    controller: 'HomeCtrl'
                }
            }

        })

        .state('app.home.chat', {
            url: '/chat/:id',
            views: {
                'content@': {
                    templateUrl: 'chat/chat.html',
                    controller: 'chatCtrl'
                    
                }
            }

        })

        



        $locationProvider.html5Mode(true)


    });
