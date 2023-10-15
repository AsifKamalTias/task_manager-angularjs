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

app.run(function ($rootScope, localStorageService) {
    $rootScope.items = localStorageService.getItems() || [];

    $rootScope.error = false;
    $rootScope.errorMessage = '';

    $rootScope.editMode = false;
    $rootScope.editIndex = -1;

    $rootScope.$on('$routeChangeError', function () {
        $location.path('/error');
    });
});

app.service('quoteService', function ($http) {
    this.getQuote = function () {
        return $http.get('https://api.quotable.io/random');
    }
});

app.service('localStorageService', function () {
    this.saveItems = function (items) {
        localStorage.setItem('items', JSON.stringify(items));
    }

    this.getItems = function () {
        return JSON.parse(localStorage.getItem('items'));
    }
});

app.directive('footerText', function () {
    return {
        restrict: 'E',
        template: 'Made with <i class="bi bi-heart-fill text-red-500"></i> by ASIF KAMAL TIAS'
    }
});

app.controller('itemController', function ($scope, $rootScope, localStorageService) {
    $scope.item = '';
    $scope.addItem = function () {
        if ($scope.item === '') {
            $rootScope.error = true;
            $rootScope.errorMessage = 'Please enter an item';
            return;
        }

        if ($rootScope.items.indexOf($scope.item) !== -1 && !$rootScope.editMode) {
            $rootScope.error = true;
            $rootScope.errorMessage = 'This item is already in your list';
            return;
        }

        if ($rootScope.editMode) {
            $rootScope.items[$rootScope.editIndex] = $scope.item;
            localStorageService.saveItems($rootScope.items);

            $rootScope.editMode = false;
            $rootScope.editIndex = -1;
            $scope.item = '';
            $rootScope.error = false;
            $rootScope.errorMessages = '';
            return;
        }

        // $rootScope.items.push($scope.item);

        $rootScope.items = [...$rootScope.items, $scope.item];
        localStorageService.saveItems($rootScope.items);

        $scope.item = '';
        $rootScope.error = false;
        $rootScope.errorMessages = '';
    }

    $scope.submitItem = function (event) {
        if (event.keyCode === 13) {
            $scope.addItem();
        }
    }

    $scope.removeItem = function (index) {
        $rootScope.items.splice(index, 1);
        localStorageService.saveItems($rootScope.items);
    }

    $scope.editItem = function (index) {
        $rootScope.editIndex = index;
        $scope.item = $rootScope.items[index];
        $rootScope.editMode = true;
    }

    $scope.cancelEdit = function () {
        $rootScope.editMode = false;
        $rootScope.editIndex = -1;
        $scope.item = '';
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

app.controller('locationController', function ($scope, $location) {
    $scope.url = $location.host() + ':' + $location.port();
});