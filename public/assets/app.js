angular.module('app',[
'ngRoute','ui.router'
])
angular.module('app')
    .controller('chatCtrl', function($scope, $location, $stateParams, $rootScope) {
        var socket = io();
        var id = $stateParams.id
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

                    chatNickname.text(friend);
                }
            });

            socket.on('leave', function(data) {

                if (data.boolean && id == data.room) {

                    showMessage("somebodyLeft", data);
                    chats.empty();
                }

            });

            socket.on('tooMany', function(data) {

                if (data.boolean && name.length === 0) {

                    showMessage('tooManyPeople');
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
                    //createChatMessage(textarea.val(), name, img, moment());
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
    .config(function($stateProvider, $urlRouterProvider) {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbnRyb2xsZXJzL2NoYXRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9sb2dpbkN0cmwuanMiLCJjb250cm9sbGVycy9tYXN0ZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvcmVnaXN0ZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvcm91dGVzLmpzIiwic2VydmljZXMvdXNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FwcCcsW1xuJ25nUm91dGUnLCd1aS5yb3V0ZXInXG5dKSIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdjaGF0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCAkc3RhdGVQYXJhbXMsICRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIHNvY2tldCA9IGlvKCk7XG4gICAgICAgIHZhciBpZCA9ICRzdGF0ZVBhcmFtcy5pZFxuICAgICAgICAkc2NvcGUuc2V0dXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIG9uIGNvbm5lY3Rpb24gdG8gc2VydmVyIGdldCB0aGUgaWQgb2YgcGVyc29uJ3Mgcm9vbVxuICAgICAgICAgICAgc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2xvYWQnLCBpZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHJlY2VpdmUgdGhlIG5hbWVzIGFuZCBhdmF0YXJzIG9mIGFsbCBwZW9wbGUgaW4gdGhlIGNoYXQgcm9vbVxuICAgICAgICAgICAgc29ja2V0Lm9uKCdwZW9wbGVpbmNoYXQnLCBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5udW1iZXIgPT09IDApIHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEubnVtYmVyIGlzIDBcIilcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb25uZWN0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlIHNlcnZlci1zaWRlIGZ1bmN0aW9uICdsb2dpbicgYW5kIHNlbmQgdXNlcidzIHBhcmFtZXRlcnMgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLm51bWJlciA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEubnVtYmVyIGlzIDFcIilcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNoYXRXaXRoID0gZGF0YS51c2VyO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuY2hhdFdpdGgpXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5uYW1lID0gZGF0YS51c2VyLnVzZXJuYW1lXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKVxuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiAnNTQ1MzQ1MzU0NTM1JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnSGFyZCBDb2RlZCBCdWRkeScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6ICdib3RAc3BlY3RhLmluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfX3Y6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogaWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vc2hvd01lc3NhZ2UoXCJwZXJzb25pbmNoYXRcIiwgZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLypsb2dpbkZvcm0ub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lID0gJC50cmltKGhpc05hbWUudmFsKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZW50ZXIgYSBuaWNrIG5hbWUgbG9uZ2VyIHRoYW4gMSBjaGFyYWN0ZXIhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUgPT0gZGF0YS51c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJUaGVyZSBhbHJlYWR5IGlzIGEgXFxcIlwiICsgbmFtZSArIFwiXFxcIiBpbiB0aGlzIHJvb20hXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsID0gaGlzRW1haWwudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZChlbWFpbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIldyb25nIGUtbWFpbCBmb3JtYXQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhcjogZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH0pOyovXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaGF0IGlzIGZ1bGxcIilcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gT3RoZXIgdXNlZnVsIFxuXG4gICAgICAgICAgICBzb2NrZXQub24oJ3N0YXJ0Q2hhdCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5ib29sZWFuICYmIGRhdGEuaWQgPT0gaWQpIHtcblxuICAgICAgICAgICAgICAgICAgICAvL2NoYXRzLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEudXNlcnNbMF0pXG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUubmFtZSA9PT0gZGF0YS51c2Vyc1swXSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3Nob3dNZXNzYWdlKFwieW91U3RhcnRlZENoYXRXaXRoTm9NZXNzYWdlc1wiLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9zaG93TWVzc2FnZShcImhlU3RhcnRlZENoYXRXaXRoTm9NZXNzYWdlc1wiLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNoYXROaWNrbmFtZS50ZXh0KGZyaWVuZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNvY2tldC5vbignbGVhdmUnLCBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5ib29sZWFuICYmIGlkID09IGRhdGEucm9vbSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHNob3dNZXNzYWdlKFwic29tZWJvZHlMZWZ0XCIsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICBjaGF0cy5lbXB0eSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNvY2tldC5vbigndG9vTWFueScsIGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmJvb2xlYW4gJiYgbmFtZS5sZW5ndGggPT09IDApIHtcblxuICAgICAgICAgICAgICAgICAgICBzaG93TWVzc2FnZSgndG9vTWFueVBlb3BsZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUubGluayA9ICRsb2NhdGlvbi5hYnNVcmwoKTtcbiAgICAgICAgICAgICQoXCIjbWVzc2FnZVwiKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJrZXkgcHJzc2VkXCIpO1xuICAgICAgICAgICAgICAgIC8vIFN1Ym1pdCB0aGUgZm9ybSBvbiBlbnRlclxuXG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbnRlciBpcyBwcmVzc2VkXCIpXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNjaGF0Zm9ybVwiKS50cmlnZ2VyKCdzdWJtaXQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKFwiI2NoYXRmb3JtXCIpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgY2hhdCBtZXNzYWdlIGFuZCBkaXNwbGF5IGl0IGRpcmVjdGx5XG5cbiAgICAgICAgICAgICAgICAvL3Nob3dNZXNzYWdlKFwiY2hhdFN0YXJ0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoJChcIiNtZXNzYWdlXCIpLnZhbCgpLnRyaW0oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jcmVhdGVDaGF0TWVzc2FnZSh0ZXh0YXJlYS52YWwoKSwgbmFtZSwgaW1nLCBtb21lbnQoKSk7XG4gICAgICAgICAgICAgICAgICAgIC8vc2Nyb2xsVG9Cb3R0b20oKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAvLyBTZW5kIHRoZSBtZXNzYWdlIHRvIHRoZSBvdGhlciBwZXJzb24gaW4gdGhlIGNoYXRcbiAgICAgICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ21zZycsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZzogJChcIiNtZXNzYWdlXCIpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogJHNjb3BlLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gRW1wdHkgdGhlIHRleHRhcmVhXG4gICAgICAgICAgICAgICAgJChcIiNtZXNzYWdlXCIpLnZhbChcIlwiKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzb2NrZXQub24oJ3JlY2VpdmUnLCBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlY2lldmVkIGJ5IG1lXCIpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubXNnLnRyaW0oKS5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICAvL2NyZWF0ZUNoYXRNZXNzYWdlKGRhdGEubXNnLCBkYXRhLnVzZXIsIGRhdGEuaW1nLCBtb21lbnQoKSk7XG4gICAgICAgICAgICAgICAgICAgIC8vc2Nyb2xsVG9Cb3R0b20oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2V0dXAoKTtcbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24pIHtcblxuICAgICAgICAkc2NvcGUuc2V0dXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW4gY2hhdFwiKTtcbiAgICAgICAgICAgICRzY29wZS5jaGF0aWQgPSBNYXRoLnJvdW5kKChNYXRoLnJhbmRvbSgpICogMTAwMDAwMCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNldHVwKCk7XG5cblxuXG5cbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVXNlclN2YywgJGxvY2F0aW9uKSB7XG4gICAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgICAgICAgICAgVXNlclN2Yy5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlLmRhdGEpICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9ob21lJylcblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ21hc3RlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRyb3V0ZSkgeyAgICAgICAgXG5cbiAgICAgICAgJHNjb3BlLiRvbignbG9naW4nLCBmdW5jdGlvbihfLCB1c2VyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvZ2dlZCBJblwiKTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IHVzZXJcbiAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyICAgICAgICAgICAgXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbG9nZ2VkX3VzZXInLCAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnVzZXJuYW1lKVxuICAgICAgICB9KVxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdSZWdpc3RlckN0cmwnLGZ1bmN0aW9uKCRzY29wZSxVc2VyU3ZjICwkbG9jYXRpb24pe1xuXHQkc2NvcGUucmVnaXN0ZXIgPSBmdW5jdGlvbihuYW1lLHVzZXJuYW1lLHBhc3N3b3JkKXtcblx0XHRVc2VyU3ZjLnJlZ2lzdGVyKG5hbWUsdXNlcm5hbWUscGFzc3dvcmQpXG5cdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1x0XHRcdFxuXHRcdFx0JHNjb3BlLiRlbWl0KCdsb2dpbicscmVzcG9uc2UuZGF0YSlcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvaG9tZScpXG5cdFx0fSlcblx0XHQuY2F0Y2goZnVuY3Rpb24gKGVycil7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpXG5cdFx0fSlcblx0fVxuXG59KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnaGVhZGVyJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmF2Lmh0bWwnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbG9naW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2FwcC5sb2dpbicsIHtcbiAgICAgICAgICAgIHVybDogJ2xvZ2luJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2hlYWRlcic6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmF2Lmh0bWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbG9naW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAucmVnaXN0ZXInLCB7XG4gICAgICAgICAgICB1cmw6ICdyZWdpc3RlcicsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250ZW50QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdyZWdpc3Rlci5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlZ2lzdGVyQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2FwcC5ob21lJywge1xuICAgICAgICAgICAgdXJsOiAnaG9tZScsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250ZW50QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdob21lLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAuaG9tZS5jaGF0Jywge1xuICAgICAgICAgICAgdXJsOiAnL2NoYXQvOmlkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NoYXQvY2hhdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NoYXRDdHJsJ1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgICAgICBcblxuXG5cblxuXG5cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLnNlcnZpY2UoJ1VzZXJTdmMnLCBmdW5jdGlvbigkaHR0cCwkd2luZG93LCRsb2NhdGlvbil7XG5cdHZhciBzdmMgPSB0aGlzXG5cdHN2Yy5nZXRVc2VyPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJ2FwaS91c2VycycpXG5cdH1cblxuXHRzdmMubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSxwYXNzd29yZCl7XG5cdCByZXR1cm4gJGh0dHAucG9zdCgnYXBpL3Nlc3Npb25zJyx7XG5cdFx0XHR1c2VybmFtZSA6IHVzZXJuYW1lLCBwYXNzd29yZCA6IHBhc3N3b3JkXG5cdFx0fSkudGhlbihmdW5jdGlvbih2YWwpe1x0XHRcdFxuXHRcdFx0c3ZjLnRva2VuID0gdmFsLmRhdGFcblx0XHRcdCR3aW5kb3cuc2Vzc2lvblN0b3JhZ2VbXCJ1c2VyX3Rva2VuXCJdID0gSlNPTi5zdHJpbmdpZnkoc3ZjLnRva2VuKVxuXHRcdFx0JGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ3gtYXV0aCddID0gdmFsLmRhdGFcblx0XHRcdHJldHVybiBzdmMuZ2V0VXNlcigpXG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgXHRcdFx0Y29uc29sZS5lcnJvcignR2lzdHMgZXJyb3InLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLmRhdGEpO1xuICBcdFx0XHQkbG9jYXRpb24ucGF0aCgnLzQwMScpXG5cdFx0fSlcblx0XHQuZmluYWxseShmdW5jdGlvbigpIHtcblx0XHQgIGNvbnNvbGUubG9nKFwiZmluYWxseSBmaW5pc2hlZCBnaXN0c1wiKTtcblx0XHR9KTtcdFxuXHR9XG5cblxuXHRzdmMucmVnaXN0ZXIgPSBmdW5jdGlvbiAobmFtZSx1c2VybmFtZSxwYXNzd29yZCl7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJ2FwaS91c2Vycycse1xuXHRcdFx0bmFtZSA6IG5hbWUsIHVzZXJuYW1lIDogdXNlcm5hbWUsIHBhc3N3b3JkIDogcGFzc3dvcmRcblx0XHR9KS50aGVuKGZ1bmN0aW9uKHZhbCl7XHRcdFx0XG5cdFx0XHQvL3JldHVybiB2YWw7XHRcdFx0XG5cdFx0XHRyZXR1cm4gc3ZjLmxvZ2luKHVzZXJuYW1lLHBhc3N3b3JkKSBcblxuXHRcdH0pXG5cdH1cblxufSkiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
