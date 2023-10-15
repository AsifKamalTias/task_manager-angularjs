const app = angular.module('app', []);
app.run(function ($rootScope) {
    $rootScope.items = [];
    $rootScope.error = false;
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

document.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        document.getElementById('add-btn').click();
    }
});