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

         .state('app.start', {
            url: 'start',
            views: {
                'content@': {
                    templateUrl: 'start.html'                    
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbnRyb2xsZXJzL2NoYXRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9sb2dpbkN0cmwuanMiLCJjb250cm9sbGVycy9tYXN0ZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvcmVnaXN0ZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvcm91dGVzLmpzIiwic2VydmljZXMvdXNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdhcHAnLFtcbiduZ1JvdXRlJywndWkucm91dGVyJ1xuXSkiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignY2hhdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgJHN0YXRlUGFyYW1zLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgIHZhciBzb2NrZXQgPSBpbygpO1xuICAgICAgICB2YXIgaWQgPSAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICAgXG4gICAgICAgICRzY29wZS5zZXR1cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gb24gY29ubmVjdGlvbiB0byBzZXJ2ZXIgZ2V0IHRoZSBpZCBvZiBwZXJzb24ncyByb29tXG4gICAgICAgICAgICBzb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbG9hZCcsIGlkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gcmVjZWl2ZSB0aGUgbmFtZXMgYW5kIGF2YXRhcnMgb2YgYWxsIHBlb3BsZSBpbiB0aGUgY2hhdCByb29tXG4gICAgICAgICAgICBzb2NrZXQub24oJ3Blb3BsZWluY2hhdCcsIGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhLm51bWJlciA9PT0gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0YS5udW1iZXIgaXMgMFwiKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvbm5lY3RlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgc2VydmVyLXNpZGUgZnVuY3Rpb24gJ2xvZ2luJyBhbmQgc2VuZCB1c2VyJ3MgcGFyYW1ldGVycyAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCdsb2dpbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6ICRyb290U2NvcGUuY3VycmVudFVzZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogaWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEubnVtYmVyID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0YS5udW1iZXIgaXMgMVwiKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2hhdFdpdGggPSBkYXRhLnVzZXI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5jaGF0V2l0aClcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5hbWUgPSBkYXRhLnVzZXIudXNlcm5hbWVcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpXG4gICAgICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCdsb2dpbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6ICc1NDUzNDUzNTQ1MzUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdIYXJkIENvZGVkIEJ1ZGR5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogJ2JvdEBzcGVjdGEuaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9fdjogMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy9zaG93TWVzc2FnZShcInBlcnNvbmluY2hhdFwiLCBkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICAvKmxvZ2luRm9ybS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgPSAkLnRyaW0oaGlzTmFtZS52YWwoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBlbnRlciBhIG5pY2sgbmFtZSBsb25nZXIgdGhhbiAxIGNoYXJhY3RlciFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmFtZSA9PSBkYXRhLnVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIlRoZXJlIGFscmVhZHkgaXMgYSBcXFwiXCIgKyBuYW1lICsgXCJcXFwiIGluIHRoaXMgcm9vbSFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWwgPSBoaXNFbWFpbC52YWwoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKGVtYWlsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiV3JvbmcgZS1tYWlsIGZvcm1hdCFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCdsb2dpbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyOiBlbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7Ki9cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNoYXQgaXMgZnVsbFwiKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBPdGhlciB1c2VmdWwgXG5cbiAgICAgICAgICAgIHNvY2tldC5vbignc3RhcnRDaGF0JywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLmJvb2xlYW4gJiYgZGF0YS5pZCA9PSBpZCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vY2hhdHMuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YS51c2Vyc1swXSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5uYW1lID09PSBkYXRhLnVzZXJzWzBdKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2hvd01lc3NhZ2UoXCJ5b3VTdGFydGVkQ2hhdFdpdGhOb01lc3NhZ2VzXCIsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3Nob3dNZXNzYWdlKFwiaGVTdGFydGVkQ2hhdFdpdGhOb01lc3NhZ2VzXCIsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jaGF0Tmlja25hbWUudGV4dChmcmllbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzb2NrZXQub24oJ2xlYXZlJywgZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuYm9vbGVhbiAmJiBpZCA9PSBkYXRhLnJvb20pIHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxlZnRcIixkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgLy9zaG93TWVzc2FnZShcInNvbWVib2R5TGVmdFwiLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jaGF0cy5lbXB0eSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNvY2tldC5vbigndG9vTWFueScsIGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmJvb2xlYW4gJiYgbmFtZS5sZW5ndGggPT09IDApIHtcblxuICAgICAgICAgICAgICAgICAgICAvL3Nob3dNZXNzYWdlKCd0b29NYW55UGVvcGxlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzY29wZS5saW5rID0gJGxvY2F0aW9uLmFic1VybCgpO1xuICAgICAgICAgICAgJChcIiNtZXNzYWdlXCIpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImtleSBwcnNzZWRcIik7XG4gICAgICAgICAgICAgICAgLy8gU3VibWl0IHRoZSBmb3JtIG9uIGVudGVyXG5cbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVudGVyIGlzIHByZXNzZWRcIilcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiI2NoYXRmb3JtXCIpLnRyaWdnZXIoJ3N1Ym1pdCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoXCIjY2hhdGZvcm1cIikub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBjaGF0IG1lc3NhZ2UgYW5kIGRpc3BsYXkgaXQgZGlyZWN0bHlcblxuICAgICAgICAgICAgICAgIC8vc2hvd01lc3NhZ2UoXCJjaGF0U3RhcnRlZFwiKTtcblxuICAgICAgICAgICAgICAgIGlmICgkKFwiI21lc3NhZ2VcIikudmFsKCkudHJpbSgpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAkKFwiLmNoYXRzXCIpLmFwcGVuZChcIjxzdHJvbmc+WW91IDogPC9zdHJvbmc+IFwiKyQoXCIjbWVzc2FnZVwiKS52YWwoKStcIjxicj5cIik7XG4gICAgICAgICAgICAgICAgICAgIC8vc2Nyb2xsVG9Cb3R0b20oKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAvLyBTZW5kIHRoZSBtZXNzYWdlIHRvIHRoZSBvdGhlciBwZXJzb24gaW4gdGhlIGNoYXRcbiAgICAgICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ21zZycsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZzogJChcIiNtZXNzYWdlXCIpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogJHNjb3BlLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gRW1wdHkgdGhlIHRleHRhcmVhXG4gICAgICAgICAgICAgICAgJChcIiNtZXNzYWdlXCIpLnZhbChcIlwiKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzb2NrZXQub24oJ3JlY2VpdmUnLCBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlY2lldmVkIGJ5IG1lXCIpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubXNnLnRyaW0oKS5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICAvL2NyZWF0ZUNoYXRNZXNzYWdlKGRhdGEubXNnLCBkYXRhLnVzZXIsIGRhdGEuaW1nLCBtb21lbnQoKSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIuY2hhdHNcIikuYXBwZW5kKFwiPHN0cm9uZz5Zb3VyIEZyaWVuZCA6PC9zdHJvbmc+IFwiK2RhdGEubXNnK1wiPGJyPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy9zY3JvbGxUb0JvdHRvbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNldHVwKCk7XG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uKSB7XG5cbiAgICAgICAgJHNjb3BlLnNldHVwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluIGNoYXRcIik7XG4gICAgICAgICAgICAkc2NvcGUuY2hhdGlkID0gTWF0aC5yb3VuZCgoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5zZXR1cCgpO1xuXG5cblxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFVzZXJTdmMsICRsb2NhdGlvbikge1xuICAgICAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICAgICAgICAgIFVzZXJTdmMubG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kZW1pdCgnbG9naW4nLCByZXNwb25zZS5kYXRhKSAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaG9tZScpXG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdtYXN0ZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkcm91dGUpIHsgICAgICAgIFxuXG4gICAgICAgICRzY29wZS4kb24oJ2xvZ2luJywgZnVuY3Rpb24oXywgdXNlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2dnZWQgSW5cIik7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSB1c2VyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlciAgICAgICAgICAgIFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xvZ2dlZF91c2VyJywgJHJvb3RTY29wZS5jdXJyZW50VXNlci51c2VybmFtZSlcbiAgICAgICAgfSlcbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignUmVnaXN0ZXJDdHJsJyxmdW5jdGlvbigkc2NvcGUsVXNlclN2YyAsJGxvY2F0aW9uKXtcblx0JHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24obmFtZSx1c2VybmFtZSxwYXNzd29yZCl7XG5cdFx0VXNlclN2Yy5yZWdpc3RlcihuYW1lLHVzZXJuYW1lLHBhc3N3b3JkKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcdFx0XHRcblx0XHRcdCRzY29wZS4kZW1pdCgnbG9naW4nLHJlc3BvbnNlLmRhdGEpXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2hvbWUnKVxuXHRcdH0pXG5cdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnIpe1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKVxuXHRcdH0pXG5cdH1cblxufSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwkbG9jYXRpb25Qcm92aWRlcikge1xuXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2hlYWRlcic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25hdi5odG1sJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAubG9naW4nLCB7XG4gICAgICAgICAgICB1cmw6ICdsb2dpbicsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdoZWFkZXInOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25hdi5odG1sJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJ1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLnJlZ2lzdGVyJywge1xuICAgICAgICAgICAgdXJsOiAncmVnaXN0ZXInLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudEAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncmVnaXN0ZXIuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWdpc3RlckN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAuaG9tZScsIHtcbiAgICAgICAgICAgIHVybDogJ2hvbWUnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudEAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgICAgICAuc3RhdGUoJ2FwcC5zdGFydCcsIHtcbiAgICAgICAgICAgIHVybDogJ3N0YXJ0JyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3N0YXJ0Lmh0bWwnICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2FwcC5ob21lLmNoYXQnLCB7XG4gICAgICAgICAgICB1cmw6ICcvY2hhdC86aWQnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudEAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY2hhdC9jaGF0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2hhdEN0cmwnXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgICAgIFxuXG5cblxuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSlcblxuXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdVc2VyU3ZjJywgZnVuY3Rpb24oJGh0dHAsJHdpbmRvdywkbG9jYXRpb24pe1xuXHR2YXIgc3ZjID0gdGhpc1xuXHRzdmMuZ2V0VXNlcj0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCdhcGkvdXNlcnMnKVxuXHR9XG5cblx0c3ZjLmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUscGFzc3dvcmQpe1xuXHQgcmV0dXJuICRodHRwLnBvc3QoJ2FwaS9zZXNzaW9ucycse1xuXHRcdFx0dXNlcm5hbWUgOiB1c2VybmFtZSwgcGFzc3dvcmQgOiBwYXNzd29yZFxuXHRcdH0pLnRoZW4oZnVuY3Rpb24odmFsKXtcdFx0XHRcblx0XHRcdHN2Yy50b2tlbiA9IHZhbC5kYXRhXG5cdFx0XHQkd2luZG93LnNlc3Npb25TdG9yYWdlW1widXNlcl90b2tlblwiXSA9IEpTT04uc3RyaW5naWZ5KHN2Yy50b2tlbilcblx0XHRcdCRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9IHZhbC5kYXRhXG5cdFx0XHRyZXR1cm4gc3ZjLmdldFVzZXIoKVxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gIFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0dpc3RzIGVycm9yJywgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5kYXRhKTtcbiAgXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy80MDEnKVxuXHRcdH0pXG5cdFx0LmZpbmFsbHkoZnVuY3Rpb24oKSB7XG5cdFx0ICBjb25zb2xlLmxvZyhcImZpbmFsbHkgZmluaXNoZWQgZ2lzdHNcIik7XG5cdFx0fSk7XHRcblx0fVxuXG5cblx0c3ZjLnJlZ2lzdGVyID0gZnVuY3Rpb24gKG5hbWUsdXNlcm5hbWUscGFzc3dvcmQpe1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCdhcGkvdXNlcnMnLHtcblx0XHRcdG5hbWUgOiBuYW1lLCB1c2VybmFtZSA6IHVzZXJuYW1lLCBwYXNzd29yZCA6IHBhc3N3b3JkXG5cdFx0fSkudGhlbihmdW5jdGlvbih2YWwpe1x0XHRcdFxuXHRcdFx0Ly9yZXR1cm4gdmFsO1x0XHRcdFxuXHRcdFx0cmV0dXJuIHN2Yy5sb2dpbih1c2VybmFtZSxwYXNzd29yZCkgXG5cblx0XHR9KVxuXHR9XG5cbn0pIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
