var controllers = angular.module('reservationApp.controllers', []);

//flat visning
controllers.controller("TimelineCtrl", function ($scope, $modal, $http, bookingService) {
    this.startDate = Date.today().set({day: 1});   //TODO convert to "moment" instead
    $scope.startDate = this.startDate;
    this.endDate = this.startDate.clone().add(1).years();
    this.headerMonths = bookingService.getHeaderMonths(this.startDate, this.endDate);
    this.daysOfMonths = bookingService.getDaysOfMonths(this.startDate, this.endDate);
    this.daysBetween = bookingService.daysBetween;
    bookingService.getTimelineData().then(function (data) {
        $scope.timelineData = data;
    });
    $scope.openNewReservationDialog = openNewReservationDialog;
});

var ModalInstanceCtrl = function ($scope, $modalInstance, bookingService, newReservationForm) {
    $scope.newReservationForm = newReservationForm;
    $scope.ok = function () {
        bookingService.reserveUnit(newReservationForm)
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

    $scope.today = function() { $scope.dt = new Date();};
    $scope.today();
    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {$scope.showWeeks = ! $scope.showWeeks;};
    $scope.clear = function () {$scope.dt = null;};
    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];
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
    //var cache = $cacheFactory('monthsBlocks');
    this.start = moment({day: 1});
    this.currentMonth = this.start.format('MMMM / YYYY');
    this.daysOfWeek = [];
    for (var i = 0; i < 7; i++)
        this.daysOfWeek.push(moment().startOf('week').add('days', i).format('ddd'));
    this.weeks=monthViewService.generateCalendarMonthView(this.start,$scope);

    this.newReservation = function () {
        openNewReservationDialog(1,'2014-01-10','2014-01-12',$scope,$modal);
    };
    this.changeMonth = function (num) {
        var newStart=this.start.clone().add('months',num);
        this.currentMonth = newStart.format('MMMM / YYYY');
        this.weeks=monthViewService.generateCalendarMonthView(newStart);
        this.start=newStart;
    }
});


