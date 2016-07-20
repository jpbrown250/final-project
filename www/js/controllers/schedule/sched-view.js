angular.module('starter.controllers')
    .controller('SchedViewCtrl', ['$scope', '$rootScope', 'SSFUsersREST',
        'SchedulesService', '$state', 'SSFAlertsService', 'MembersRest',
        'SchedulesREST', '$window', '$stateParams',
        function($scope, $rootScope, SSFUsersREST, SchedulesService, $state,
            SSFAlertsService, MembersRest, SchedulesREST, $window, $stateParams) {


            $scope.schedule = [];
            $scope.users = {};
            $scope.$on('$ionicView.enter', function() {
                $rootScope.stopSpinner = true;
                // $scope.schedule = SchedulesService.singleSched() || 
                SchedulesREST.getById($window.localStorage.token, $stateParams.orgId, $stateParams.schedId)
                    .then(function(res) {
                        if (res.status !== 200)
                            return SSFAlertsService.showAlert('Error', 'The schedules could not load.');
                        $scope.schedule = res.data;
                    }, function(err) {
                        return SSFAlertsService.showAlert('Error', 'The schedules could not load.');
                    });

                MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId, "accepted")
                    .then(function(res) {
                        if (res.status !== 200)
                            return SSFAlertsService.showAlert('Error', 'The members could not be loaded.');
                        var members = res.data;
                        for(var i in members) {
                            $scope.users[members[i].memberId] = members[i];
                        }
                    });
            });

            $scope.edit = function() {
                for (var j in $scope.schedule.schedule) {
                    for (var k in $scope.schedule.schedule[j][1]) {
                        $scope.schedule.schedule[j][1][k][1] = new Date($scope.schedule.schedule[j][1][k][1]);
                        $scope.schedule.schedule[j][1][k][2] = new Date($scope.schedule.schedule[j][1][k][2]);
                    }
                }
                SchedulesService.template($scope.schedule);
                $scope.schedule.assignedDate = new Date($scope.schedule.assignedDate);
                $state.go('org.detail.sched-create');
            };


            $scope.who = function(a) {
                return $scope.users[a];
            };

        }
    ]);