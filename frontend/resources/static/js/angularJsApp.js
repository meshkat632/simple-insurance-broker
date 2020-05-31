var app = angular.module('app', []);

//#######################
//JSA CONTROLLER
//#######################

app.controller('jsaLoadCustomers', function($scope, $http, $location) {
    $scope.customers = [];

    function getAllCustomers(){
        var url = "api/customers/all";

        // do getting
        $http.get(url).then( response => {
            $scope.getDivAvailable = true;
            $scope.customers = response.data;
        }, response => {
            $scope.postResultMessage = "Error Status: " +  response.statusText;
        });
    }

    getAllCustomers();
});
