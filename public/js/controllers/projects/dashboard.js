define(['controllers/projects/taskRunner'], function() {
    app.registerController('ProjectDashboardCtrl', ['$scope', '$http', 'Project', '$uibModal', '$rootScope', function($scope, $http, Project, $modal, $rootScope) {
        
        $scope.refreshEvents = function($lastEvents=true) {

            if ($lastEvents == true) {
                $eventsURL = '/events/last'
            } else {
                $eventsURL = '/events'
            }  
            
            $http.get(Project.getURL() + $eventsURL).success(function(events) {
                $scope.events = events;

                events.forEach(function(evt) {
                    evt.createdFormatted = moment(evt.created).format('DD/M/YY HH:mm')
                })
            });

        }

        $scope.reload = function($lastEvents=true) {

            if ($lastEvents == true) {
                $tasksURL = '/tasks/last'
            } else {
                $tasksURL = '/tasks'
            }  

            $http.get(Project.getURL() + $tasksURL).success(function(tasks) {
                $scope.tasks = tasks;

                $scope.tasks.forEach(function(t) {
                    if (t.created) {
                        t.createdFormatted = moment(t.created).format('DD/M/YY HH:mm')
                    }
                    if (t.start) {
                        t.startFormatted = moment(t.start).format('DD/M/YY HH:mm:ss')
                    }
                    if (t.end) {
                        t.endFormatted = moment(t.end).format('DD/M/YY HH:mm:ss')
                    }

                    if (!t.start || !t.end) {
                        return;
                    }

                    t.duration = moment(t.end).diff(moment(t.start), 'minutes');
                });
            });
        }
        $scope.refreshEvents();
        $scope.reload();

        $scope.openTask = function(task) {
            var scope = $rootScope.$new();
            scope.task = task;
            scope.project = Project;

            $modal.open({
                templateUrl: '/tpl/projects/taskModal.html',
                controller: 'TaskCtrl',
                scope: scope,
                size: 'lg'
            }).result.then(function() {
                $scope.reload();
            });
        }
    }]);
});