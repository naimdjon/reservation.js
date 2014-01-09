var controllers = angular.module('reservationApp.controllers', []);

controllers.controller("TimelineCtrl", function ($scope, $modal, $http, reservationService) {
    this.startDate = Date.today().set({day: 1});   //TODO convert to "moment" instead
    $scope.startDate = this.startDate;
    this.endDate = this.startDate.clone().add(1).years();
    this.headerMonths = reservationService.getHeaderMonths(this.startDate, this.endDate);
    this.daysOfMonths = reservationService.getDaysOfMonths(this.startDate, this.endDate);
    this.daysBetween = reservationService.daysBetween;
    reservationService.getTimelineData().then(function (data) {
        $scope.timelineData = data;
    });
    $scope.openNewReservationDialog = openNewReservationDialog;

    /*$scope.openNewReservationDialog = function (index, slideStart, slideEnd) {
        $scope.newReservationForm = {name: "", index: index, start: slideStart, end: slideEnd};
        var modalInstance = $modal.open({
            templateUrl: 'newReservationDialog',
            controller: ModalInstanceCtrl,
            windowClass: "modalDialog",
            resolve: {
                newReservationForm: function () {
                    return $scope.newReservationForm;
                }
            }
        });

        modalInstance.result.then(function (x) {
        }, function () {
            console.log('Modal dismissed at: ' + new Date() + "...");
        });
    };*/
});

var ModalInstanceCtrl = function ($scope, $modalInstance, reservationService, newReservationForm) {
    $scope.newReservationForm = newReservationForm;
    $scope.ok = function () {
        reservationService.reserveUnit(newReservationForm)
            .then(function (result) {
                if (result && (result["error"] && result["error"].length > 0)) {
                    $scope.newReservationError = result["error"];
                } else {
                    $scope.newReservationError = "";
                    $modalInstance.close();
                }
            });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var openNewReservationDialog = function (index, slideStart, slideEnd,$scope,$modal) {
    $scope.newReservationForm = {name: "", index: index, start: slideStart, end: slideEnd};
    var modalInstance = $modal.open({
        templateUrl: 'newReservationDialog',
        controller: ModalInstanceCtrl,
        windowClass: "modalDialog",
        resolve: {
            newReservationForm: function () {
                return $scope.newReservationForm;
            }
        }
    });
    modalInstance.result.then(function(x){}, function () {
        console.log('Modal dismissed');
    });
};

controllers.controller("MonthViewCtrl", function ($scope,monthViewService,$cacheFactory,$modal) {
    moment.lang('nb');
    ///$scope.openNewReservationDialog=openNewReservationDialog;
    var cache = $cacheFactory('monthsBlocks');
    this.start = moment({day: 1});
    this.currentMonth = this.start.format('MMMM / YYYY');
    this.daysOfWeek = [];
    for (var i = 0; i < 7; i++)
        this.daysOfWeek.push(moment().startOf('week').add('days', i).format('ddd'));
    this.datesOfMonths=monthViewService.generateMonthViewDays(this.start,$scope);

    this.newReservation = function () {
        //console.log("not implemented [newReservation]");
        openNewReservationDialog(1,'2014-01-10','2014-01-12',$scope,$modal);
    };
    this.changeMonth = function (num) {
        var newStart=this.start.clone().add('months',num);
        this.currentMonth = newStart.format('MMMM / YYYY');
        this.datesOfMonths=monthViewService.generateMonthViewDays(newStart);
        this.start=newStart;
    }
});


