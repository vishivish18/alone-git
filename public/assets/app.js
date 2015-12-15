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
                    $(".chats").append($("#message").val());
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
                    $(".chats").append("&#xA;"+data.msg);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbnRyb2xsZXJzL2NoYXRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9sb2dpbkN0cmwuanMiLCJjb250cm9sbGVycy9tYXN0ZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvcmVnaXN0ZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvcm91dGVzLmpzIiwic2VydmljZXMvdXNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FwcCcsW1xuJ25nUm91dGUnLCd1aS5yb3V0ZXInXG5dKSIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdjaGF0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCAkc3RhdGVQYXJhbXMsICRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIHNvY2tldCA9IGlvKCk7XG4gICAgICAgIHZhciBpZCA9ICRzdGF0ZVBhcmFtcy5pZFxuICAgICAgICAkc2NvcGUuc2V0dXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIG9uIGNvbm5lY3Rpb24gdG8gc2VydmVyIGdldCB0aGUgaWQgb2YgcGVyc29uJ3Mgcm9vbVxuICAgICAgICAgICAgc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2xvYWQnLCBpZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHJlY2VpdmUgdGhlIG5hbWVzIGFuZCBhdmF0YXJzIG9mIGFsbCBwZW9wbGUgaW4gdGhlIGNoYXQgcm9vbVxuICAgICAgICAgICAgc29ja2V0Lm9uKCdwZW9wbGVpbmNoYXQnLCBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5udW1iZXIgPT09IDApIHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEubnVtYmVyIGlzIDBcIilcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb25uZWN0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlIHNlcnZlci1zaWRlIGZ1bmN0aW9uICdsb2dpbicgYW5kIHNlbmQgdXNlcidzIHBhcmFtZXRlcnMgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLm51bWJlciA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEubnVtYmVyIGlzIDFcIilcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNoYXRXaXRoID0gZGF0YS51c2VyO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuY2hhdFdpdGgpXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5uYW1lID0gZGF0YS51c2VyLnVzZXJuYW1lXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKVxuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiAnNTQ1MzQ1MzU0NTM1JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnSGFyZCBDb2RlZCBCdWRkeScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6ICdib3RAc3BlY3RhLmluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfX3Y6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogaWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vc2hvd01lc3NhZ2UoXCJwZXJzb25pbmNoYXRcIiwgZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLypsb2dpbkZvcm0ub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lID0gJC50cmltKGhpc05hbWUudmFsKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZW50ZXIgYSBuaWNrIG5hbWUgbG9uZ2VyIHRoYW4gMSBjaGFyYWN0ZXIhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUgPT0gZGF0YS51c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJUaGVyZSBhbHJlYWR5IGlzIGEgXFxcIlwiICsgbmFtZSArIFwiXFxcIiBpbiB0aGlzIHJvb20hXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsID0gaGlzRW1haWwudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZChlbWFpbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIldyb25nIGUtbWFpbCBmb3JtYXQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhcjogZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH0pOyovXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaGF0IGlzIGZ1bGxcIilcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gT3RoZXIgdXNlZnVsIFxuXG4gICAgICAgICAgICBzb2NrZXQub24oJ3N0YXJ0Q2hhdCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5ib29sZWFuICYmIGRhdGEuaWQgPT0gaWQpIHtcblxuICAgICAgICAgICAgICAgICAgICAvL2NoYXRzLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEudXNlcnNbMF0pXG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUubmFtZSA9PT0gZGF0YS51c2Vyc1swXSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3Nob3dNZXNzYWdlKFwieW91U3RhcnRlZENoYXRXaXRoTm9NZXNzYWdlc1wiLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9zaG93TWVzc2FnZShcImhlU3RhcnRlZENoYXRXaXRoTm9NZXNzYWdlc1wiLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vY2hhdE5pY2tuYW1lLnRleHQoZnJpZW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdsZWF2ZScsIGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmJvb2xlYW4gJiYgaWQgPT0gZGF0YS5yb29tKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsZWZ0XCIsZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIC8vc2hvd01lc3NhZ2UoXCJzb21lYm9keUxlZnRcIiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIC8vY2hhdHMuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzb2NrZXQub24oJ3Rvb01hbnknLCBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5ib29sZWFuICYmIG5hbWUubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9zaG93TWVzc2FnZSgndG9vTWFueVBlb3BsZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUubGluayA9ICRsb2NhdGlvbi5hYnNVcmwoKTtcbiAgICAgICAgICAgICQoXCIjbWVzc2FnZVwiKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJrZXkgcHJzc2VkXCIpO1xuICAgICAgICAgICAgICAgIC8vIFN1Ym1pdCB0aGUgZm9ybSBvbiBlbnRlclxuXG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbnRlciBpcyBwcmVzc2VkXCIpXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNjaGF0Zm9ybVwiKS50cmlnZ2VyKCdzdWJtaXQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKFwiI2NoYXRmb3JtXCIpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgY2hhdCBtZXNzYWdlIGFuZCBkaXNwbGF5IGl0IGRpcmVjdGx5XG5cbiAgICAgICAgICAgICAgICAvL3Nob3dNZXNzYWdlKFwiY2hhdFN0YXJ0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoJChcIiNtZXNzYWdlXCIpLnZhbCgpLnRyaW0oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5jaGF0c1wiKS5hcHBlbmQoJChcIiNtZXNzYWdlXCIpLnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgLy9zY3JvbGxUb0JvdHRvbSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNlbmQgdGhlIG1lc3NhZ2UgdG8gdGhlIG90aGVyIHBlcnNvbiBpbiB0aGUgY2hhdFxuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbXNnJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXNnOiAkKFwiI21lc3NhZ2VcIikudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiAkc2NvcGUubmFtZVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBFbXB0eSB0aGUgdGV4dGFyZWFcbiAgICAgICAgICAgICAgICAkKFwiI21lc3NhZ2VcIikudmFsKFwiXCIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNvY2tldC5vbigncmVjZWl2ZScsIGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVjaWV2ZWQgYnkgbWVcIilcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5tc2cudHJpbSgpLmxlbmd0aCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vY3JlYXRlQ2hhdE1lc3NhZ2UoZGF0YS5tc2csIGRhdGEudXNlciwgZGF0YS5pbWcsIG1vbWVudCgpKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5jaGF0c1wiKS5hcHBlbmQoXCImI3hBO1wiK2RhdGEubXNnKTtcbiAgICAgICAgICAgICAgICAgICAgLy9zY3JvbGxUb0JvdHRvbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNldHVwKCk7XG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uKSB7XG5cbiAgICAgICAgJHNjb3BlLnNldHVwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluIGNoYXRcIik7XG4gICAgICAgICAgICAkc2NvcGUuY2hhdGlkID0gTWF0aC5yb3VuZCgoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5zZXR1cCgpO1xuXG5cblxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFVzZXJTdmMsICRsb2NhdGlvbikge1xuICAgICAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICAgICAgICAgIFVzZXJTdmMubG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kZW1pdCgnbG9naW4nLCByZXNwb25zZS5kYXRhKSAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaG9tZScpXG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdtYXN0ZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkcm91dGUpIHsgICAgICAgIFxuXG4gICAgICAgICRzY29wZS4kb24oJ2xvZ2luJywgZnVuY3Rpb24oXywgdXNlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2dnZWQgSW5cIik7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSB1c2VyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlciAgICAgICAgICAgIFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xvZ2dlZF91c2VyJywgJHJvb3RTY29wZS5jdXJyZW50VXNlci51c2VybmFtZSlcbiAgICAgICAgfSlcbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignUmVnaXN0ZXJDdHJsJyxmdW5jdGlvbigkc2NvcGUsVXNlclN2YyAsJGxvY2F0aW9uKXtcblx0JHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24obmFtZSx1c2VybmFtZSxwYXNzd29yZCl7XG5cdFx0VXNlclN2Yy5yZWdpc3RlcihuYW1lLHVzZXJuYW1lLHBhc3N3b3JkKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcdFx0XHRcblx0XHRcdCRzY29wZS4kZW1pdCgnbG9naW4nLHJlc3BvbnNlLmRhdGEpXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2hvbWUnKVxuXHRcdH0pXG5cdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnIpe1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKVxuXHRcdH0pXG5cdH1cblxufSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2hlYWRlcic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25hdi5odG1sJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAubG9naW4nLCB7XG4gICAgICAgICAgICB1cmw6ICdsb2dpbicsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdoZWFkZXInOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25hdi5odG1sJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJ1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLnJlZ2lzdGVyJywge1xuICAgICAgICAgICAgdXJsOiAncmVnaXN0ZXInLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudEAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncmVnaXN0ZXIuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWdpc3RlckN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAuaG9tZScsIHtcbiAgICAgICAgICAgIHVybDogJ2hvbWUnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudEAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLmhvbWUuY2hhdCcsIHtcbiAgICAgICAgICAgIHVybDogJy9jaGF0LzppZCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250ZW50QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjaGF0L2NoYXQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjaGF0Q3RybCdcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgXG5cblxuXG5cblxuXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdVc2VyU3ZjJywgZnVuY3Rpb24oJGh0dHAsJHdpbmRvdywkbG9jYXRpb24pe1xuXHR2YXIgc3ZjID0gdGhpc1xuXHRzdmMuZ2V0VXNlcj0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCdhcGkvdXNlcnMnKVxuXHR9XG5cblx0c3ZjLmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUscGFzc3dvcmQpe1xuXHQgcmV0dXJuICRodHRwLnBvc3QoJ2FwaS9zZXNzaW9ucycse1xuXHRcdFx0dXNlcm5hbWUgOiB1c2VybmFtZSwgcGFzc3dvcmQgOiBwYXNzd29yZFxuXHRcdH0pLnRoZW4oZnVuY3Rpb24odmFsKXtcdFx0XHRcblx0XHRcdHN2Yy50b2tlbiA9IHZhbC5kYXRhXG5cdFx0XHQkd2luZG93LnNlc3Npb25TdG9yYWdlW1widXNlcl90b2tlblwiXSA9IEpTT04uc3RyaW5naWZ5KHN2Yy50b2tlbilcblx0XHRcdCRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9IHZhbC5kYXRhXG5cdFx0XHRyZXR1cm4gc3ZjLmdldFVzZXIoKVxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gIFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0dpc3RzIGVycm9yJywgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5kYXRhKTtcbiAgXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy80MDEnKVxuXHRcdH0pXG5cdFx0LmZpbmFsbHkoZnVuY3Rpb24oKSB7XG5cdFx0ICBjb25zb2xlLmxvZyhcImZpbmFsbHkgZmluaXNoZWQgZ2lzdHNcIik7XG5cdFx0fSk7XHRcblx0fVxuXG5cblx0c3ZjLnJlZ2lzdGVyID0gZnVuY3Rpb24gKG5hbWUsdXNlcm5hbWUscGFzc3dvcmQpe1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCdhcGkvdXNlcnMnLHtcblx0XHRcdG5hbWUgOiBuYW1lLCB1c2VybmFtZSA6IHVzZXJuYW1lLCBwYXNzd29yZCA6IHBhc3N3b3JkXG5cdFx0fSkudGhlbihmdW5jdGlvbih2YWwpe1x0XHRcdFxuXHRcdFx0Ly9yZXR1cm4gdmFsO1x0XHRcdFxuXHRcdFx0cmV0dXJuIHN2Yy5sb2dpbih1c2VybmFtZSxwYXNzd29yZCkgXG5cblx0XHR9KVxuXHR9XG5cbn0pIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
