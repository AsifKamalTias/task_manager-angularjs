const app = angular.module('app', []);
app.run(function ($rootScope) {
    $rootScope.items = ['Bread', 'Egg'];
});
app.controller('addItemController', function ($scope, $rootScope) {
    $scope.item = '';
    $scope.addItem = function () {
        $rootScope.items.push($scope.item);
        $scope.item = '';
    }
});

app.controller('itemController', function ($scope, $rootScope) {
    $scope.removeItem = function (index) {
        $rootScope.items.splice(index, 1);
    }
});