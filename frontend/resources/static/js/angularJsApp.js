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
            $scope.getAllProducts();
            $scope.getAllContracts();
            $scope.getAllCustomers();
        }, response => {
            console.error("\"Error Status: \" +  response.statusText;");
        });
    }

    $scope.getAllProducts =function () {
        var url = "api/products";
        $http.get(url, {
            headers: {'Authorization': 'Bearer '+$scope.apiAccessToekn+''}
        }).then( response => {
            $scope.productsDetails = response.data;
            console.log(JSON.stringify(response.data));
        }, response => {
            $scope.postResultMessage = "Error Status: " +  response.statusText;
        });
    }

    $scope.getAllCustomers =function () {
        var url = "api/customers";
        $http.get(url, {
            headers: {'Authorization': 'Bearer '+$scope.apiAccessToekn+''}
        }).then( response => {
            $scope.getDivAvailable = true;
            $scope.customers = response.data;
            console.log(JSON.stringify(response.data));
        }, response => {
            $scope.postResultMessage = "Error Status: " +  response.statusText;
        });
    }

    $scope.deleteCustomer = function(customer){
        var url = "api/customers/?id="+customer.id;
        $http.delete(url, {
            headers: {'Authorization': 'Bearer '+$scope.apiAccessToekn+''}
        }).then( response => {
            console.log(JSON.stringify(response.data));
            $scope.customers = response.data;
        }, response => {
            $scope.postResultMessage = "Error Status: " +  response.statusText;
        });
    }

    $scope.creatNewCustomer = function(newCustomer){
        $scope.creatNewCustomerMessage = "Creating new customer";
        console.log("create new Customer "+JSON.stringify(newCustomer))
        var url = "api/customers";
        $http.post(url, newCustomer, {
            headers: {'Authorization': 'Bearer '+$scope.apiAccessToekn+''}
        }).then( response => {
            console.log(JSON.stringify(response.data));
            $scope.getAllCustomers();
            $scope.creatNewCustomerMessage = "new customer added";
        }, response => {
            $scope.postResultMessage = "Error Status: " +  response.statusText;
            $scope.creatNewCustomerMessage = response.data;
        });
    }

    $scope.creatContract = function(newContract){
        console.log("create new Contract "+JSON.stringify(newContract))
        $scope.selectedProduct = newContract;
        newContract.customer = $scope.customers.find(customer => customer.id === newContract.customerId);

        var url = "api/contracts";
        $http.post(url, newContract, {
            headers: {'Authorization': 'Bearer '+$scope.apiAccessToekn+''}
        }).then( response => {
            console.log(JSON.stringify(response.data));
            $scope.contracts = response.data;
        }, response => {
            $scope.postResultMessage = "Error Status: " +  response.statusText;
        });
    }

    $scope.getAllContracts =function () {
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

    retriveAccessToken();
});
