const app = angular.module('app', ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "home.html"
        })
        .when("/about", {
            templateUrl: "about.html"
        });
});

app.run(function ($rootScope) {
    $rootScope.items = [];
    $rootScope.error = false;
});

app.service('quoteService', function ($http) {
    this.getQuote = function () {
        return $http.get('https://api.quotable.io/random');
    }
});

app.directive('footerText', function () {
    return {
        restrict: 'E',
        template: 'Made with <i class="bi bi-heart-fill text-red-500"></i> by ASIF KAMAL TIAS'
    }
});

app.controller('addItemController', function ($scope, $rootScope) {
    $scope.item = '';
    $scope.addItem = function () {
        if ($scope.item === '') {
            $rootScope.error = true;
            return;
        }
        $rootScope.items.push($scope.item);
        $scope.item = '';
        $rootScope.error = false;
    }
});

app.controller('itemController', function ($scope, $rootScope) {
    $scope.removeItem = function (index) {
        $rootScope.items.splice(index, 1);
    }
});

app.controller('quoteController', function ($scope, $interval, quoteService) {
    $scope.quote = {
        text: "But I'll tell you what hermits realize. If you go off into a far, far forest and get very quiet, you'll come to understand that you're connected with everything.",
        author: 'Alan Watts'
    }

    $interval(function () {
        quoteService.getQuote().then(function (response) {
            $scope.quote = {
                text: response.data.content,
                author: response.data.author
            }
        });
    }, 10000);
});

document.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        document.getElementById('add-btn').click();
    }
});