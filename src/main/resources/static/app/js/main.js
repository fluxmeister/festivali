var festivalApp = angular.module("festivalApp", ['ngRoute']);

festivalApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/',{
        templateUrl: '/app/html/partial/festivali.html'
    }).when('/festivali/edit/:id',{
        templateUrl: '/app/html/partial/edit-festival.html'
    }).otherwise({
        redirectTo: '/'
    });
}]);

festivalApp.controller("festivaliCtrl", function($scope, $http, $location){

    var baseUrlFestivali = "/api/festivali";
    var baseUrlMesta = "/api/mesta";

    $scope.pageNum = 0;
    $scope.totalPages = 0;

    $scope.mesta = [];
    $scope.festivali = [];

    $scope.noviFestival = {};
    $scope.noviFestival.naziv = "";
    $scope.noviFestival.organizator = "";
    $scope.noviFestival.datumPocetka = "";
    $scope.noviFestival.cenaKarte = "";
    $scope.noviFestival.kolicina = "";
    $scope.noviFestival.mestoId = "";


    $scope.trazeniFestival = {};
    $scope.trazeniFestival.naziv = "";
    $scope.trazeniFestival.maxCena = "";
    $scope.trazeniFestival.idMesta = "";

    var getFestivali = function(){

        var config = {params: {}};

        config.params.pageNum = $scope.pageNum;

        if($scope.trazeniFestival.naziv != ""){
            config.params.naziv = $scope.trazeniFestival.naziv;
        }

        if($scope.trazeniFestival.idMesta != ""){
            config.params.idMesta = $scope.trazeniFestival.idMesta;
        }

        if($scope.trazeniFestival.maxCena != ""){
            config.params.maxCena = $scope.trazeniFestival.maxCena;
        }


        $http.get(baseUrlFestivali, config)
            .then(
            	function success(res){
            		$scope.festivali = res.data;
            		$scope.totalPages = res.headers('totalPages');
            	},
            	function error(res){
            		alert("Unsuccesful getting festivals!");
            	}
            );
    };

    var getMesta = function(){

        $http.get(baseUrlMesta)
            .then(
            	function success(res){
            		$scope.mesta = res.data;
            	},
            	function error(){
            		alert("Unsuccesful getting places!");
            	}
            );

    };

    getFestivali();
    getMesta();

    $scope.nazad = function(){
        if($scope.pageNum > 0) {
            $scope.pageNum = $scope.pageNum - 1;
            getFestivali();
        }
    };

    $scope.napred = function(){
        if($scope.pageNum < $scope.totalPages - 1){
            $scope.pageNum = $scope.pageNum + 1;
            getFestivali();
        }
    };

    $scope.dodaj = function(){
        $http.post(baseUrlFestivali, $scope.noviFestival)
            .then(
            	function success(res){
	                alert("Successfully added festival into database.");
	                getFestivali();
	
	                $scope.noviFestival.naziv = "";
	                $scope.noviFestival.organizator = "";
	                $scope.noviFestival.datumPocetka = "";
	                $scope.noviFestival.cenaKarte = "";
	                $scope.noviFestival.kolicina = "";
	                $scope.noviFestival.mestoId = "";
            	},
            	function error(res){
            		alert("Unsuccessful to add a festival into a database!");
            	}
            );
    };

    $scope.trazi = function () {
        $scope.pageNum = 0;
        getFestivali();
    }

    $scope.izmeni = function(id){
        $location.path('/festivali/edit/' + id);
    }

    $scope.obrisi = function(id){
        $http.delete(baseUrlFestivali + "/" + id).then(
            function success(data){
                getFestivali();
            },
            function error(data){
                alert("Neuspešno brisanje!");
                console.log(data);
            }
        );

    }
    
    $scope.kupi = function(id){
    	$http.post(baseUrlFestivali + "/" + id)
        .then(
        	function success(res){
                alert("Successfully bought.");
                getFestivali();
        	},
        	function error(res){
        		alert("Unsuccessfully bought!");
        	}
        );
    	
    }
});

festivalApp.controller("editFestivalCtrl", function($scope, $http, $routeParams, $location){

    var baseUrlFestivali = "/api/festivali";

    $scope.stariFestival = {};
    $scope.stariFestival.naziv = "";
    $scope.stariFestival.organizator = "";
    $scope.stariFestival.datumPocetka = "";
    $scope.stariFestival.cenaKarte = "";
    $scope.stariFestival.kolicina = "";

    var getStariFestival = function(){

        $http.get(baseUrlFestivali + "/" + $routeParams.id)
            .then(
            	function success(data){
            		$scope.stariFestival = data.data;
            	},
            	function errror(){
            		alert("Unsuccessful to reach for festivals!")
            	}
            );

    }
    getStariFestival();
    
    $scope.izmeni = function(){
        $http.put(baseUrlFestivali + "/" + $scope.stariFestival.id, $scope.stariFestival)
            .then(
            	function success(){
            		alert("Successfully edited festival!");
            		$location.path("/");
            	},
            	function error(){
            		alert("Unsuccessfuly edited festival!")
            	}
            );
    }
});












