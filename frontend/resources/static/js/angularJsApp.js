var app = angular.module('app', []);
//#######################
//JSA CONTROLLER
//#######################

app.controller('jsaLoadCustomers', function($scope, $http, $location) {
    $scope.customers = [];

    var retriveAccessToken = function(onSuccess, onError){
        var accessTokenEndpoint = "token";

        $http.get(accessTokenEndpoint ).then( response => {
            console.log("############################");
            console.log(JSON.stringify(response.data));
            console.log("############################");
            onSuccess(response.data.accessToken)
        }, response => {
            console.error("\"Error Status: \" +  response.statusText;");
        });
    }

    



    function getAllCustomers(accessToken){
        console.log(accessToken);
        var url = "api/contracts";
        $http.get(url, {
            headers: {'Authorization': 'Bearer '+accessToken+''}
        }).then( response => {
            $scope.getDivAvailable = true;
            $scope.contracts = response.data;
            console.log(JSON.stringify(response.data));
        }, response => {
            $scope.postResultMessage = "Error Status: " +  response.statusText;
        });
    }



    retriveAccessToken(function (accessToken) {
        getAllCustomers(accessToken);
    });
});
