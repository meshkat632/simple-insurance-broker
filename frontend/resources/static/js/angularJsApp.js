var app = angular.module('app', []);
//#######################
//JSA CONTROLLER
//#######################

app.controller('jsaLoadCustomers', function($scope, $http, $location) {
    $scope.customers = [];
    $scope.apiAccessToekn = undefined;

    var retriveAccessToken = function(onSuccess, onError){
        var accessTokenEndpoint = "token";
        $http.get(accessTokenEndpoint ).then( response => {
            console.log("############################");
            console.log(JSON.stringify(response.data));
            console.log("############################");
            $scope.apiAccessToekn = response.data.accessToken;
            $scope.getAllCustomers();
        }, response => {
            console.error("\"Error Status: \" +  response.statusText;");
        });
    }

    $scope.getAllCustomers =function () {
        var url = "api/contracts";
        $http.get(url, {
            headers: {'Authorization': 'Bearer '+$scope.apiAccessToekn+''}
        }).then( response => {
            $scope.getDivAvailable = true;
            $scope.contracts = response.data;
            console.log(JSON.stringify(response.data));
        }, response => {
            $scope.postResultMessage = "Error Status: " +  response.statusText;
        });
    }

    $scope.deleteContract = function(contract){
        console.log("delete contractId:" +contract.id);
        var url = "api/contracts/?id="+contract.id;
        $http.delete(url, {
            headers: {'Authorization': 'Bearer '+$scope.apiAccessToekn+''}
        }).then( response => {
            console.log(JSON.stringify(response.data));
            $scope.contracts = response.data;
            //$scope.getAllCustomers();
        }, response => {
            $scope.postResultMessage = "Error Status: " +  response.statusText;
        });
    }

    $scope.creatContract = function(){

        console.log("creatContract");

        var newContract = {
            customer_name: "Alice",
            customer_id: 50002,
            rate: 200,
            subContracts: [
                {
                    contactId: 10002,
                    provider: 'Allianz',
                    rate: 100
                },
                {
                    contactId: 20001,
                    provider: 'HDI',
                    rate: 100
                }
            ]
        };

        var url = "api/contracts";
        $http.post(url, newContract, {
            headers: {'Authorization': 'Bearer '+$scope.apiAccessToekn+''}
        }).then( response => {
            console.log(JSON.stringify(response.data));
            $scope.getAllCustomers();
        }, response => {
            $scope.postResultMessage = "Error Status: " +  response.statusText;
        });
    }

    retriveAccessToken();
});
