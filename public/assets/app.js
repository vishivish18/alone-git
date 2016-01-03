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
                    templateUrl: 'start.html',
                    controller: 'LoginCtrl'                  
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbnRyb2xsZXJzL2NoYXRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9sb2dpbkN0cmwuanMiLCJjb250cm9sbGVycy9tYXN0ZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvcmVnaXN0ZXJDdHJsLmpzIiwiY29udHJvbGxlcnMvcm91dGVzLmpzIiwic2VydmljZXMvdXNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FwcCcsW1xuJ25nUm91dGUnLCd1aS5yb3V0ZXInXG5dKSIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdjaGF0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCAkc3RhdGVQYXJhbXMsICRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIHNvY2tldCA9IGlvKCk7XG4gICAgICAgIHZhciBpZCA9ICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgICBcbiAgICAgICAgJHNjb3BlLnNldHVwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBvbiBjb25uZWN0aW9uIHRvIHNlcnZlciBnZXQgdGhlIGlkIG9mIHBlcnNvbidzIHJvb21cbiAgICAgICAgICAgIHNvY2tldC5vbignY29ubmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCdsb2FkJywgaWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyByZWNlaXZlIHRoZSBuYW1lcyBhbmQgYXZhdGFycyBvZiBhbGwgcGVvcGxlIGluIHRoZSBjaGF0IHJvb21cbiAgICAgICAgICAgIHNvY2tldC5vbigncGVvcGxlaW5jaGF0JywgZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubnVtYmVyID09PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkYXRhLm51bWJlciBpcyAwXCIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29ubmVjdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSBzZXJ2ZXItc2lkZSBmdW5jdGlvbiAnbG9naW4nIGFuZCBzZW5kIHVzZXIncyBwYXJhbWV0ZXJzICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2xvZ2luJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogJHJvb3RTY29wZS5jdXJyZW50VXNlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5udW1iZXIgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkYXRhLm51bWJlciBpcyAxXCIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jaGF0V2l0aCA9IGRhdGEudXNlcjtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmNoYXRXaXRoKVxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubmFtZSA9IGRhdGEudXNlci51c2VybmFtZVxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KClcbiAgICAgICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2xvZ2luJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogJzU0NTM0NTM1NDUzNScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0hhcmQgQ29kZWQgQnVkZHknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAnYm90QHNwZWN0YS5pbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX192OiAwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvL3Nob3dNZXNzYWdlKFwicGVyc29uaW5jaGF0XCIsIGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qbG9naW5Gb3JtLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSA9ICQudHJpbShoaXNOYW1lLnZhbCgpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIGVudGVyIGEgbmljayBuYW1lIGxvbmdlciB0aGFuIDEgY2hhcmFjdGVyIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lID09IGRhdGEudXNlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhlcmUgYWxyZWFkeSBpcyBhIFxcXCJcIiArIG5hbWUgKyBcIlxcXCIgaW4gdGhpcyByb29tIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbWFpbCA9IGhpc0VtYWlsLnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWQoZW1haWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJXcm9uZyBlLW1haWwgZm9ybWF0IVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2xvZ2luJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXI6IGVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9KTsqL1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2hhdCBpcyBmdWxsXCIpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIE90aGVyIHVzZWZ1bCBcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdzdGFydENoYXQnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuYm9vbGVhbiAmJiBkYXRhLmlkID09IGlkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jaGF0cy5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLnVzZXJzWzBdKVxuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLm5hbWUgPT09IGRhdGEudXNlcnNbMF0pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9zaG93TWVzc2FnZShcInlvdVN0YXJ0ZWRDaGF0V2l0aE5vTWVzc2FnZXNcIiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2hvd01lc3NhZ2UoXCJoZVN0YXJ0ZWRDaGF0V2l0aE5vTWVzc2FnZXNcIiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL2NoYXROaWNrbmFtZS50ZXh0KGZyaWVuZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNvY2tldC5vbignbGVhdmUnLCBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5ib29sZWFuICYmIGlkID09IGRhdGEucm9vbSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGVmdFwiLGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAvL3Nob3dNZXNzYWdlKFwic29tZWJvZHlMZWZ0XCIsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAvL2NoYXRzLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCd0b29NYW55JywgZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuYm9vbGVhbiAmJiBuYW1lLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vc2hvd01lc3NhZ2UoJ3Rvb01hbnlQZW9wbGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLmxpbmsgPSAkbG9jYXRpb24uYWJzVXJsKCk7XG4gICAgICAgICAgICAkKFwiI21lc3NhZ2VcIikua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwia2V5IHByc3NlZFwiKTtcbiAgICAgICAgICAgICAgICAvLyBTdWJtaXQgdGhlIGZvcm0gb24gZW50ZXJcblxuICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW50ZXIgaXMgcHJlc3NlZFwiKVxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjY2hhdGZvcm1cIikudHJpZ2dlcignc3VibWl0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJChcIiNjaGF0Zm9ybVwiKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGNoYXQgbWVzc2FnZSBhbmQgZGlzcGxheSBpdCBkaXJlY3RseVxuXG4gICAgICAgICAgICAgICAgLy9zaG93TWVzc2FnZShcImNoYXRTdGFydGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCQoXCIjbWVzc2FnZVwiKS52YWwoKS50cmltKCkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIuY2hhdHNcIikuYXBwZW5kKFwiPHN0cm9uZz5Zb3UgOiA8L3N0cm9uZz4gXCIrJChcIiNtZXNzYWdlXCIpLnZhbCgpK1wiPGJyPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy9zY3JvbGxUb0JvdHRvbSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNlbmQgdGhlIG1lc3NhZ2UgdG8gdGhlIG90aGVyIHBlcnNvbiBpbiB0aGUgY2hhdFxuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbXNnJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXNnOiAkKFwiI21lc3NhZ2VcIikudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiAkc2NvcGUubmFtZVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBFbXB0eSB0aGUgdGV4dGFyZWFcbiAgICAgICAgICAgICAgICAkKFwiI21lc3NhZ2VcIikudmFsKFwiXCIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNvY2tldC5vbigncmVjZWl2ZScsIGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVjaWV2ZWQgYnkgbWVcIilcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5tc2cudHJpbSgpLmxlbmd0aCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vY3JlYXRlQ2hhdE1lc3NhZ2UoZGF0YS5tc2csIGRhdGEudXNlciwgZGF0YS5pbWcsIG1vbWVudCgpKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5jaGF0c1wiKS5hcHBlbmQoXCI8c3Ryb25nPllvdXIgRnJpZW5kIDo8L3N0cm9uZz4gXCIrZGF0YS5tc2crXCI8YnI+XCIpO1xuICAgICAgICAgICAgICAgICAgICAvL3Njcm9sbFRvQm90dG9tKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2V0dXAoKTtcbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24pIHtcblxuICAgICAgICAkc2NvcGUuc2V0dXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW4gY2hhdFwiKTtcbiAgICAgICAgICAgICRzY29wZS5jaGF0aWQgPSBNYXRoLnJvdW5kKChNYXRoLnJhbmRvbSgpICogMTAwMDAwMCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNldHVwKCk7XG5cblxuXG5cbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVXNlclN2YywgJGxvY2F0aW9uKSB7XG4gICAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgICAgICAgICAgVXNlclN2Yy5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlLmRhdGEpICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9ob21lJylcblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ21hc3RlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRyb3V0ZSkgeyAgICAgICAgXG5cbiAgICAgICAgJHNjb3BlLiRvbignbG9naW4nLCBmdW5jdGlvbihfLCB1c2VyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvZ2dlZCBJblwiKTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IHVzZXJcbiAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyICAgICAgICAgICAgXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbG9nZ2VkX3VzZXInLCAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnVzZXJuYW1lKVxuICAgICAgICB9KVxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdSZWdpc3RlckN0cmwnLGZ1bmN0aW9uKCRzY29wZSxVc2VyU3ZjICwkbG9jYXRpb24pe1xuXHQkc2NvcGUucmVnaXN0ZXIgPSBmdW5jdGlvbihuYW1lLHVzZXJuYW1lLHBhc3N3b3JkKXtcblx0XHRVc2VyU3ZjLnJlZ2lzdGVyKG5hbWUsdXNlcm5hbWUscGFzc3dvcmQpXG5cdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1x0XHRcdFxuXHRcdFx0JHNjb3BlLiRlbWl0KCdsb2dpbicscmVzcG9uc2UuZGF0YSlcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvaG9tZScpXG5cdFx0fSlcblx0XHQuY2F0Y2goZnVuY3Rpb24gKGVycil7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpXG5cdFx0fSlcblx0fVxuXG59KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCRsb2NhdGlvblByb3ZpZGVyKSB7XG5cbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnaGVhZGVyJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmF2Lmh0bWwnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbG9naW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2FwcC5sb2dpbicsIHtcbiAgICAgICAgICAgIHVybDogJ2xvZ2luJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2hlYWRlcic6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbmF2Lmh0bWwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvbG9naW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAucmVnaXN0ZXInLCB7XG4gICAgICAgICAgICB1cmw6ICdyZWdpc3RlcicsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250ZW50QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdyZWdpc3Rlci5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlZ2lzdGVyQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2FwcC5ob21lJywge1xuICAgICAgICAgICAgdXJsOiAnaG9tZScsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdjb250ZW50QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdob21lLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgIC5zdGF0ZSgnYXBwLnN0YXJ0Jywge1xuICAgICAgICAgICAgdXJsOiAnc3RhcnQnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudEAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhcnQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAuaG9tZS5jaGF0Jywge1xuICAgICAgICAgICAgdXJsOiAnL2NoYXQvOmlkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NoYXQvY2hhdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NoYXRDdHJsJ1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgICAgICBcblxuXG5cbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpXG5cblxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZSgnVXNlclN2YycsIGZ1bmN0aW9uKCRodHRwLCR3aW5kb3csJGxvY2F0aW9uKXtcblx0dmFyIHN2YyA9IHRoaXNcblx0c3ZjLmdldFVzZXI9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnYXBpL3VzZXJzJylcblx0fVxuXG5cdHN2Yy5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLHBhc3N3b3JkKXtcblx0IHJldHVybiAkaHR0cC5wb3N0KCdhcGkvc2Vzc2lvbnMnLHtcblx0XHRcdHVzZXJuYW1lIDogdXNlcm5hbWUsIHBhc3N3b3JkIDogcGFzc3dvcmRcblx0XHR9KS50aGVuKGZ1bmN0aW9uKHZhbCl7XHRcdFx0XG5cdFx0XHRzdmMudG9rZW4gPSB2YWwuZGF0YVxuXHRcdFx0JHdpbmRvdy5zZXNzaW9uU3RvcmFnZVtcInVzZXJfdG9rZW5cIl0gPSBKU09OLnN0cmluZ2lmeShzdmMudG9rZW4pXG5cdFx0XHQkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ10gPSB2YWwuZGF0YVxuXHRcdFx0cmV0dXJuIHN2Yy5nZXRVc2VyKClcblx0XHR9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSkge1xuICBcdFx0XHRjb25zb2xlLmVycm9yKCdHaXN0cyBlcnJvcicsIHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2UuZGF0YSk7XG4gIFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvNDAxJylcblx0XHR9KVxuXHRcdC5maW5hbGx5KGZ1bmN0aW9uKCkge1xuXHRcdCAgY29uc29sZS5sb2coXCJmaW5hbGx5IGZpbmlzaGVkIGdpc3RzXCIpO1xuXHRcdH0pO1x0XG5cdH1cblxuXG5cdHN2Yy5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lLHVzZXJuYW1lLHBhc3N3b3JkKXtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnYXBpL3VzZXJzJyx7XG5cdFx0XHRuYW1lIDogbmFtZSwgdXNlcm5hbWUgOiB1c2VybmFtZSwgcGFzc3dvcmQgOiBwYXNzd29yZFxuXHRcdH0pLnRoZW4oZnVuY3Rpb24odmFsKXtcdFx0XHRcblx0XHRcdC8vcmV0dXJuIHZhbDtcdFx0XHRcblx0XHRcdHJldHVybiBzdmMubG9naW4odXNlcm5hbWUscGFzc3dvcmQpIFxuXG5cdFx0fSlcblx0fVxuXG59KSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
