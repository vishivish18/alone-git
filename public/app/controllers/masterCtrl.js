angular.module('app')
    .controller('masterCtrl', function($scope, $rootScope, $route) {        

        $scope.$on('login', function(_, user) {
            console.log("Logged In");
            $scope.currentUser = user
            $rootScope.currentUser = user            
            localStorage.setItem('logged_user', $rootScope.currentUser.username)
        })
    })
