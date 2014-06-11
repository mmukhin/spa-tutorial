var apiUrl = 'http://localhost:8080';

// define NBA application module
var NBAappModule = angular.module('NBAapp', []);

// define NBA controller
NBAappModule.controller('NBAController', function ($scope, teamStorage, filterFilter) {

    // array of teams, used with ng-repeat in HTML
    $scope.teams = [];

    teamStorage.getAll().success(function(data){
        $scope.teams = data;
    });

    // listener for changes in teams array
    $scope.$watch('teams', function (newValue, oldValue) {

        // update binding in HTML
        $scope.totalTeams = $scope.teams.length;
    }, true);

    // brings up editing view
    $scope.editTeam = function (team) {

        // HTML displays team view by checking this property
        team.editing = true;

        // clone the original team to restore it later
        $scope.originalTeam = angular.extend({}, team);
    };

    // saves the team input fields
    $scope.saveEditing = function (team) {
        event.preventDefault();

        var teamName = team.name.trim();
        var teamCity = team.city.trim();

        if (!validateTeam(team)) {
            return false;
        }

        // HTML displays team view by checking this property
        team.editing = false;

        // if an id exists (means it came from the API)
        if (team.id) {

            // API call
            teamStorage.put(team);
        }
        else {

            // API call
            teamStorage.post(team);
        }
    };

    // reset the team
    $scope.cancelEditing = function (team) {

        // get key of the team we want to reset from the current array
        var scope_teams_index = $scope.teams.indexOf(team);

        // HTML displays team view by checking this property
        $scope.originalTeam.editing = false;

        // replace with team saved within editTeam method
        $scope.teams[scope_teams_index] = $scope.originalTeam;
    };

    // delete the team
    $scope.removeTeam = function (team) {

        if (confirm('Delete the ' + team.city + ' ' + team.name + '?')) {

            // API call
            teamStorage.delete(team)
                .success(function(data){

                    // get key of the team we want to reset from the current array
                    var scope_teams_index = $scope.teams.indexOf(team);

                    // remove eam from array
                    $scope.teams.splice(scope_teams_index,1);
                })
                .error(function(data){
                    alert('API Error!');
                    console.log(data);
                });
        }
    };

    // create team
    $scope.addTeam = function (e) {
        e.preventDefault();

        // create team object
        var newTeam = {};
        newTeam.editing = false;
        newTeam.id = $scope.team._id;
        newTeam.name = $scope.team.name.trim();
        newTeam.city = $scope.team.city.trim();

        if (!validateTeam(newTeam)) {
            return false;
        }

        // API call
        teamStorage.post(newTeam)
            .success(function(data){

                $scope.teams.push(data);

                $scope.team.name = '';
                $scope.team.city = '';
            })
            .error(function(data){
                alert('API error!');
                console.log(data);
            });
    };

    function validateTeam(team) {

        if (!team.name.length) {
            alert('Missing name!');
            return;
        }
        if (!team.city.length) {
            alert('Missing city!');
            return;
        }

        return true;
    }

});


// API
NBAappModule.factory('teamStorage', function ($http) {

    var apiUrl = 'http://localhost:8080';

    return {
        getAll: function () {
            return $http({
                method: 'GET',
                url: apiUrl+'/api/teams/'
            });
        },
        put: function (team) {
            return $http({
                method: 'PUT',
                url: apiUrl+'/api/teams/' + team.id,
                data: JSON.stringify(team)
            });
        },
        post: function (team) {
            return $http({
                method: 'POST',
                url: apiUrl+'/api/teams/',
                data: JSON.stringify(team)
            });
        },
        delete: function (team) {
            return $http({
                method: 'DELETE',
                url: apiUrl+'/api/teams/' + team.id
            });
        }
    };
});