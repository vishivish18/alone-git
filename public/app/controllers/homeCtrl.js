angular.module('app')
    .controller('HomeCtrl', function($scope, $location) {

        $scope.setup = function() {
            console.log("in chat");
            $scope.chatid = Math.round((Math.random() * 1000000));
        }

        $scope.setup();




    })
