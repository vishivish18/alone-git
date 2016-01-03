angular.module('app',[
'ngRoute','ui.router'
])
angular.module('app')
    .controller('chatCtrl', function($scope, $location, $stateParams, $rootScope) {
        var socket = io();
        var id = $stateParams.id;
       
        $scope.setup = function() {
            // on connection to server get the id of person's room
            socket.on('connect', function() {
                socket.emit('load', id);
            });
            // receive the names and avatars of all people in the chat room
            socket.on('peopleinchat', function(data) {

                if (data.number === 0) {

                    console.log("data.number is 0")
                    console.log("connected");
                    // call the server-side function 'login' and send user's parameters                    
                    socket.emit('login', {
                        user: $rootScope.currentUser,
                        id: id
                    });

                } else if (data.number === 1) {
                    console.log("data.number is 1")
                    console.log(data)
                    $scope.chatWith = data.user;
                    console.log($scope.chatWith)
                    $scope.name = data.user.username
                    $scope.$apply()
                    socket.emit('login', {
                        user: {
                            _id: '545345354535',
                            name: 'Hard Coded Buddy',
                            username: 'bot@specta.in',
                            __v: 0
                        },
                        id: id
                    });
                    //showMessage("personinchat", data);

                    /*loginForm.on('submit', function(e) {

                        e.preventDefault();

                        name = $.trim(hisName.val());

                        if (name.length < 1) {
                            alert("Please enter a nick name longer than 1 character!");
                            return;
                        }

                        if (name == data.user) {
                            alert("There already is a \"" + name + "\" in this room!");
                            return;
                        }
                        email = hisEmail.val();

                        if (!isValid(email)) {
                            alert("Wrong e-mail format!");
                        } else {
                            socket.emit('login', {
                                user: name,
                                avatar: email,
                                id: id
                            });
                        }

                    });*/
                } else {
                    console.log("Chat is full")
                }

            });
            // Other useful 

            socket.on('startChat', function(data) {
                console.log(data);
                if (data.boolean && data.id == id) {

                    //chats.empty();
                    console.log(data.users[0])
                    if ($scope.name === data.users[0]) {

                        //showMessage("youStartedChatWithNoMessages", data);
                    } else {

                        //showMessage("heStartedChatWithNoMessages", data);
                    }

                    //chatNickname.text(friend);
                }
            });

            socket.on('leave', function(data) {

                if (data.boolean && id == data.room) {

                    console.log("left",data);
                    //showMessage("somebodyLeft", data);
                    //chats.empty();
                }

            });

            socket.on('tooMany', function(data) {

                if (data.boolean && name.length === 0) {

                    //showMessage('tooManyPeople');
                }
            });

            $scope.link = $location.absUrl();
            $("#message").keypress(function(e) {
                console.log("key prssed");
                // Submit the form on enter

                if (e.which == 13) {
                    console.log("Enter is pressed")
                    e.preventDefault();
                    $("#chatform").trigger('submit');
                }

            });

            $("#chatform").on('submit', function(e) {

                e.preventDefault();

                // Create a new chat message and display it directly

                //showMessage("chatStarted");

                if ($("#message").val().trim().length) {
                    $(".chats").append("<strong>You : </strong> "+$("#message").val()+"<br>");
                    //scrollToBottom();
                    console.log($scope.name);
                    // Send the message to the other person in the chat
                    socket.emit('msg', {
                        msg: $("#message").val(),
                        user: $scope.name
                    });

                }
                // Empty the textarea
                $("#message").val("");
            });

            socket.on('receive', function(data) {

                console.log("Recieved by me")
                console.log(data);
                if (data.msg.trim().length) {

                    //createChatMessage(data.msg, data.user, data.img, moment());
                    $(".chats").append("<strong>Your Friend :</strong> "+data.msg+"<br>");
                    //scrollToBottom();
                }
            });
        }

        $scope.setup();
    })

angular.module('app')
    .controller('HomeCtrl', function($scope, $location) {

        $scope.setup = function() {
            console.log("in chat");
            $scope.chatid = Math.round((Math.random() * 1000000));
        }

        $scope.setup();




    })

angular.module('app')
    .controller('LoginCtrl', function($scope, UserSvc, $location) {
        $scope.login = function(username, password) {
            UserSvc.login(username, password)
                .then(function(response) {
                    $scope.$emit('login', response.data)                    
                    $location.path('/home')

                })
        }
    })

angular.module('app')
    .controller('masterCtrl', function($scope, $rootScope, $route) {        

        $scope.$on('login', function(_, user) {
            console.log("Logged In");
            $scope.currentUser = user
            $rootScope.currentUser = user            
            localStorage.setItem('logged_user', $rootScope.currentUser.username)
        })
    })

angular.module('app')
.controller('RegisterCtrl',function($scope,UserSvc ,$location){
	$scope.register = function(name,username,password){
		UserSvc.register(name,username,password)
		.then(function(response){			
			$scope.$emit('login',response.data)
			$location.path('/home')
		})
		.catch(function (err){
			console.log(err)
		})
	}

})

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

angular.module('app')
.service('UserSvc', function($http,$window,$location){
	var svc = this
	svc.getUser= function(){
		return $http.get('api/users')
	}

	svc.login = function(username,password){
	 return $http.post('api/sessions',{
			username : username, password : password
		}).then(function(val){			
			svc.token = val.data
			$window.sessionStorage["user_token"] = JSON.stringify(svc.token)
			$http.defaults.headers.common['x-auth'] = val.data
			return svc.getUser()
		}).catch(function(response) {
  			console.error('Gists error', response.status, response.data);
  			$location.path('/401')
		})
		.finally(function() {
		  console.log("finally finished gists");
		});	
	}


	svc.register = function (name,username,password){
		return $http.post('api/users',{
			name : name, username : username, password : password
		}).then(function(val){			
			//return val;			
			return svc.login(username,password) 

		})
	}

})
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbnRyb2xsZXJzL2NoYXRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9sb2dpbkN0cmwuanMiLCJjb250cm9sbGVycy9tYXN0ZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvcmVnaXN0ZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvcm91dGVzLmpzIiwic2VydmljZXMvdXNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYXBwJyxbXG4nbmdSb3V0ZScsJ3VpLnJvdXRlcidcbl0pIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ2NoYXRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgc29ja2V0ID0gaW8oKTtcbiAgICAgICAgdmFyIGlkID0gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgIFxuICAgICAgICAkc2NvcGUuc2V0dXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIG9uIGNvbm5lY3Rpb24gdG8gc2VydmVyIGdldCB0aGUgaWQgb2YgcGVyc29uJ3Mgcm9vbVxuICAgICAgICAgICAgc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2xvYWQnLCBpZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHJlY2VpdmUgdGhlIG5hbWVzIGFuZCBhdmF0YXJzIG9mIGFsbCBwZW9wbGUgaW4gdGhlIGNoYXQgcm9vbVxuICAgICAgICAgICAgc29ja2V0Lm9uKCdwZW9wbGVpbmNoYXQnLCBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5udW1iZXIgPT09IDApIHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEubnVtYmVyIGlzIDBcIilcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb25uZWN0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlIHNlcnZlci1zaWRlIGZ1bmN0aW9uICdsb2dpbicgYW5kIHNlbmQgdXNlcidzIHBhcmFtZXRlcnMgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLm51bWJlciA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEubnVtYmVyIGlzIDFcIilcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNoYXRXaXRoID0gZGF0YS51c2VyO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuY2hhdFdpdGgpXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5uYW1lID0gZGF0YS51c2VyLnVzZXJuYW1lXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKVxuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiAnNTQ1MzQ1MzU0NTM1JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnSGFyZCBDb2RlZCBCdWRkeScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6ICdib3RAc3BlY3RhLmluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfX3Y6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogaWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vc2hvd01lc3NhZ2UoXCJwZXJzb25pbmNoYXRcIiwgZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLypsb2dpbkZvcm0ub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lID0gJC50cmltKGhpc05hbWUudmFsKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZW50ZXIgYSBuaWNrIG5hbWUgbG9uZ2VyIHRoYW4gMSBjaGFyYWN0ZXIhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUgPT0gZGF0YS51c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJUaGVyZSBhbHJlYWR5IGlzIGEgXFxcIlwiICsgbmFtZSArIFwiXFxcIiBpbiB0aGlzIHJvb20hXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsID0gaGlzRW1haWwudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZChlbWFpbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIldyb25nIGUtbWFpbCBmb3JtYXQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhcjogZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH0pOyovXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaGF0IGlzIGZ1bGxcIilcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gT3RoZXIgdXNlZnVsIFxuXG4gICAgICAgICAgICBzb2NrZXQub24oJ3N0YXJ0Q2hhdCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5ib29sZWFuICYmIGRhdGEuaWQgPT0gaWQpIHtcblxuICAgICAgICAgICAgICAgICAgICAvL2NoYXRzLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEudXNlcnNbMF0pXG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUubmFtZSA9PT0gZGF0YS51c2Vyc1swXSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3Nob3dNZXNzYWdlKFwieW91U3RhcnRlZENoYXRXaXRoTm9NZXNzYWdlc1wiLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9zaG93TWVzc2FnZShcImhlU3RhcnRlZENoYXRXaXRoTm9NZXNzYWdlc1wiLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vY2hhdE5pY2tuYW1lLnRleHQoZnJpZW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdsZWF2ZScsIGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmJvb2xlYW4gJiYgaWQgPT0gZGF0YS5yb29tKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsZWZ0XCIsZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIC8vc2hvd01lc3NhZ2UoXCJzb21lYm9keUxlZnRcIiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIC8vY2hhdHMuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzb2NrZXQub24oJ3Rvb01hbnknLCBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5ib29sZWFuICYmIG5hbWUubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9zaG93TWVzc2FnZSgndG9vTWFueVBlb3BsZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUubGluayA9ICRsb2NhdGlvbi5hYnNVcmwoKTtcbiAgICAgICAgICAgICQoXCIjbWVzc2FnZVwiKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJrZXkgcHJzc2VkXCIpO1xuICAgICAgICAgICAgICAgIC8vIFN1Ym1pdCB0aGUgZm9ybSBvbiBlbnRlclxuXG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbnRlciBpcyBwcmVzc2VkXCIpXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNjaGF0Zm9ybVwiKS50cmlnZ2VyKCdzdWJtaXQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKFwiI2NoYXRmb3JtXCIpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgY2hhdCBtZXNzYWdlIGFuZCBkaXNwbGF5IGl0IGRpcmVjdGx5XG5cbiAgICAgICAgICAgICAgICAvL3Nob3dNZXNzYWdlKFwiY2hhdFN0YXJ0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoJChcIiNtZXNzYWdlXCIpLnZhbCgpLnRyaW0oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5jaGF0c1wiKS5hcHBlbmQoXCI8c3Ryb25nPllvdSA6IDwvc3Ryb25nPiBcIiskKFwiI21lc3NhZ2VcIikudmFsKCkrXCI8YnI+XCIpO1xuICAgICAgICAgICAgICAgICAgICAvL3Njcm9sbFRvQm90dG9tKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2VuZCB0aGUgbWVzc2FnZSB0byB0aGUgb3RoZXIgcGVyc29uIGluIHRoZSBjaGF0XG4gICAgICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCdtc2cnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtc2c6ICQoXCIjbWVzc2FnZVwiKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6ICRzY29wZS5uYW1lXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEVtcHR5IHRoZSB0ZXh0YXJlYVxuICAgICAgICAgICAgICAgICQoXCIjbWVzc2FnZVwiKS52YWwoXCJcIik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdyZWNlaXZlJywgZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZWNpZXZlZCBieSBtZVwiKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLm1zZy50cmltKCkubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jcmVhdGVDaGF0TWVzc2FnZShkYXRhLm1zZywgZGF0YS51c2VyLCBkYXRhLmltZywgbW9tZW50KCkpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiLmNoYXRzXCIpLmFwcGVuZChcIjxzdHJvbmc+WW91ciBGcmllbmQgOjwvc3Ryb25nPiBcIitkYXRhLm1zZytcIjxicj5cIik7XG4gICAgICAgICAgICAgICAgICAgIC8vc2Nyb2xsVG9Cb3R0b20oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5zZXR1cCgpO1xuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignSG9tZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbikge1xuXG4gICAgICAgICRzY29wZS5zZXR1cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbiBjaGF0XCIpO1xuICAgICAgICAgICAgJHNjb3BlLmNoYXRpZCA9IE1hdGgucm91bmQoKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKSk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2V0dXAoKTtcblxuXG5cblxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU3ZjLCAkbG9jYXRpb24pIHtcbiAgICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkKSB7XG4gICAgICAgICAgICBVc2VyU3ZjLmxvZ2luKHVzZXJuYW1lLCBwYXNzd29yZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGVtaXQoJ2xvZ2luJywgcmVzcG9uc2UuZGF0YSkgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2hvbWUnKVxuXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignbWFzdGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHJvdXRlKSB7ICAgICAgICBcblxuICAgICAgICAkc2NvcGUuJG9uKCdsb2dpbicsIGZ1bmN0aW9uKF8sIHVzZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9nZ2VkIEluXCIpO1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gdXNlclxuICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXIgICAgICAgICAgICBcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsb2dnZWRfdXNlcicsICRyb290U2NvcGUuY3VycmVudFVzZXIudXNlcm5hbWUpXG4gICAgICAgIH0pXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ1JlZ2lzdGVyQ3RybCcsZnVuY3Rpb24oJHNjb3BlLFVzZXJTdmMgLCRsb2NhdGlvbil7XG5cdCRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKG5hbWUsdXNlcm5hbWUscGFzc3dvcmQpe1xuXHRcdFVzZXJTdmMucmVnaXN0ZXIobmFtZSx1c2VybmFtZSxwYXNzd29yZClcblx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHRcdFx0XG5cdFx0XHQkc2NvcGUuJGVtaXQoJ2xvZ2luJyxyZXNwb25zZS5kYXRhKVxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9ob21lJylcblx0XHR9KVxuXHRcdC5jYXRjaChmdW5jdGlvbiAoZXJyKXtcblx0XHRcdGNvbnNvbGUubG9nKGVycilcblx0XHR9KVxuXHR9XG5cbn0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsJGxvY2F0aW9uUHJvdmlkZXIpIHtcblxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG5cbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwJywge1xuICAgICAgICAgICAgICAgIHVybDogJy8nLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdoZWFkZXInOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9uYXYuaHRtbCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9sb2dpbi5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLmxvZ2luJywge1xuICAgICAgICAgICAgdXJsOiAnbG9naW4nLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnaGVhZGVyJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9uYXYuaHRtbCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9sb2dpbi5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCdcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2FwcC5yZWdpc3RlcicsIHtcbiAgICAgICAgICAgIHVybDogJ3JlZ2lzdGVyJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3JlZ2lzdGVyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVnaXN0ZXJDdHJsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLmhvbWUnLCB7XG4gICAgICAgICAgICB1cmw6ICdob21lJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2FwcC5ob21lLmNoYXQnLCB7XG4gICAgICAgICAgICB1cmw6ICcvY2hhdC86aWQnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudEAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY2hhdC9jaGF0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2hhdEN0cmwnXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgICAgIFxuXG5cblxuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSlcblxuXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdVc2VyU3ZjJywgZnVuY3Rpb24oJGh0dHAsJHdpbmRvdywkbG9jYXRpb24pe1xuXHR2YXIgc3ZjID0gdGhpc1xuXHRzdmMuZ2V0VXNlcj0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCdhcGkvdXNlcnMnKVxuXHR9XG5cblx0c3ZjLmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUscGFzc3dvcmQpe1xuXHQgcmV0dXJuICRodHRwLnBvc3QoJ2FwaS9zZXNzaW9ucycse1xuXHRcdFx0dXNlcm5hbWUgOiB1c2VybmFtZSwgcGFzc3dvcmQgOiBwYXNzd29yZFxuXHRcdH0pLnRoZW4oZnVuY3Rpb24odmFsKXtcdFx0XHRcblx0XHRcdHN2Yy50b2tlbiA9IHZhbC5kYXRhXG5cdFx0XHQkd2luZG93LnNlc3Npb25TdG9yYWdlW1widXNlcl90b2tlblwiXSA9IEpTT04uc3RyaW5naWZ5KHN2Yy50b2tlbilcblx0XHRcdCRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9IHZhbC5kYXRhXG5cdFx0XHRyZXR1cm4gc3ZjLmdldFVzZXIoKVxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gIFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0dpc3RzIGVycm9yJywgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5kYXRhKTtcbiAgXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy80MDEnKVxuXHRcdH0pXG5cdFx0LmZpbmFsbHkoZnVuY3Rpb24oKSB7XG5cdFx0ICBjb25zb2xlLmxvZyhcImZpbmFsbHkgZmluaXNoZWQgZ2lzdHNcIik7XG5cdFx0fSk7XHRcblx0fVxuXG5cblx0c3ZjLnJlZ2lzdGVyID0gZnVuY3Rpb24gKG5hbWUsdXNlcm5hbWUscGFzc3dvcmQpe1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCdhcGkvdXNlcnMnLHtcblx0XHRcdG5hbWUgOiBuYW1lLCB1c2VybmFtZSA6IHVzZXJuYW1lLCBwYXNzd29yZCA6IHBhc3N3b3JkXG5cdFx0fSkudGhlbihmdW5jdGlvbih2YWwpe1x0XHRcdFxuXHRcdFx0Ly9yZXR1cm4gdmFsO1x0XHRcdFxuXHRcdFx0cmV0dXJuIHN2Yy5sb2dpbih1c2VybmFtZSxwYXNzd29yZCkgXG5cblx0XHR9KVxuXHR9XG5cbn0pIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
