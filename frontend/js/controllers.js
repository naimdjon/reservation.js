var controllers = angular.module('reservationApp.controllers', []);

controllers.controller("MonthViewCtrl", function ($scope,monthViewService,$modal) {
    moment.lang('nb');
    var resourceId=window.resourceId,email=window.userEmail;
    this.start = moment({day: 1});
    this.currentMonth = this.start.format('MMMM / YYYY');
    this.daysOfWeek = []
    this.months = []
    this.greenPeriods = []
    this.showWeekNumbers=true
    for (var i = 0; i < 12; i++)this.months.push(moment().month(i).format('MMMM'));
    for (var i = 0; i < 7; i++)this.daysOfWeek.push(moment().startOf('week').add('days', i).format('ddd'));
    this.calendarView = monthViewService.generateCalendarMonthView(this.start,resourceId);
    this.changeMonth = function (num) {
        var newStart=isNaN(num)?this.start.clone().month(num):this.start.clone().add('months',num);
        this.currentMonth = newStart.format('MMMM / YYYY');
        this.calendarView = monthViewService.generateCalendarMonthView(newStart,resourceId);
        this.start=newStart;
    }
    var monthView=this;
    this.newBooking = function (d) {
        openNewBookingDialog(email, resourceId, d.momentDate.clone(),$scope,$modal,monthView);
    };


});

var ModalInstanceCtrl = function ($scope, $modalInstance, bookingService, newBookingForm) {
    $scope.newBookingForm = newBookingForm;
    $scope.ok = function () {
        bookingService.reserveUnit(newBookingForm)
            .then(function (result) {
                if (result && (result["error"] && result["error"].length > 0)) {
                    $scope.newReservationError = result["error"];
                } else {
                    $scope.newReservationError = "";
                    $modalInstance.close();
                    newBookingForm.callback.changeMonth(0);
                }
            });
    };
    $scope.cancel = function () {$modalInstance.dismiss('cancel');};
};

var openNewBookingDialog = function (userEmail, resourceId, date, $scope,$modal,callback) {
    //console.log("userEmail:"+userEmail);
    $scope.newBookingForm = {
        userEmail: userEmail
        ,resourceId:resourceId
        ,fromDate:date.day(3)
        ,toDate:date.clone().add('d',6)
        ,from: date.format('DD/MM')
        ,to:date.clone().add('d',6).format('DD/MM')
        ,to_be_cleaned:false
        ,callback:callback
    };
    var modalInstance = $modal.open({
        templateUrl: 'newBookingDialog',
        controller: ModalInstanceCtrl,
        windowClass: "modalDialog",
        resolve: {newBookingForm: function () {return $scope.newBookingForm;}}
    });
    modalInstance.result.then(function(x){}, function () {
        console.log('Booking done!');
    });
};




