
var controllers = angular.module('reservationApp.controllers', []);

controllers .controller("TimelineDatesCtrl", function ($scope,$modal, $http, bookingHelper) {
    //$scope.startDate=Date.today().add(-1).months().set({day:1});
    this.startDate = Date.today().set({day: 1});
    $scope.startDate = this.startDate;
    this.endDate = this.startDate.clone().add(1).years();
    this.headerMonths = getHeaderMonths(this.startDate, this.endDate);
    this.daysOfMonths = getDaysOfMonths(this.startDate, this.endDate);
    this.daysBetween = function (startDate, endDate) {
        if (!startDate || !endDate) {
            return 0;
        }
        var start= Date.parse(startDate,'yyyy-MM-dd');
        var end = Date.parse(endDate, 'yyyy-MM-dd');
        if (start.getYear() == 1901 || end.getYear() == 8099) {
            return 0;
        }
        var count = 0, date = start.clone();
        while (date.compareTo(end) == -1) {
            count = count + 1;
            date.addDays(1);
        }
        return count;
    };
    bookingHelper.getTimelineData().then(function(data){
        $scope.timelineData = data;
    });
  $scope.openNewBookingDialog = function (index, slideStart, slideEnd) {
    $scope.bookingForm={name:"",index:index,start:slideStart,end:slideEnd};
    var modalInstance = $modal.open({
      templateUrl: 'changeBookingDialog',
      controller: ModalInstanceCtrl,
      windowClass:"modalDialog",
        resolve: {
            bookingForm: function () {
                var bookingForm = $scope.bookingForm;
                return  bookingForm;
            }
        }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      console.log('Modal dismissed at: ' + new Date()+"...");
    });
  };
});

var ModalInstanceCtrl = function ($scope, $modalInstance,bookingHelper,bookingForm) {
  $scope.bookingForm = bookingForm;
  $scope.ok = function () {
      bookingHelper.reserveUnit(bookingForm.name,bookingForm.index, bookingForm.start, bookingForm.end)
          .then(function(result){
              if(result && (result["error"] && result["error"].length>0)) {
                  $scope.newBookingError=result["error"];
              }else{
                  $scope.newBookingError="";
                  $modalInstance.close();
              }
          });
  };

  $scope.cancel = function () {$modalInstance.dismiss('cancel');};
};

function getDaysOfMonths(startDate, endDate) {
    var daysOfMonths = [];
    var counterDate = startDate.clone();
    while (counterDate < endDate) {
        var dayOfMonth = []
        dayOfMonth.day = counterDate.toString("dd");
        dayOfMonth.month = counterDate.toString("MMM/yyyy");
        dayOfMonth.year = counterDate.toString("yyyy");
        dayOfMonth.isWeekend = !counterDate.is().weekday();
        daysOfMonths.push(dayOfMonth);
        counterDate.add(1).days();
    }
    return daysOfMonths;
}

function getHeaderMonths(startDate, endDate) {
    var headerMonths = [];
    var counterDate = startDate.clone();
    while (counterDate < endDate) {
        var headerMonth = []
        headerMonth.monthWithYear = counterDate.toString("MMM/yyyy");
        headerMonth.daysInMonth = Date.getDaysInMonth(counterDate.getFullYear(), counterDate.getMonth());
        headerMonth.widthOfMonth = (headerMonth.daysInMonth * cellWidth) - 1;
        headerMonths.push(headerMonth);
        counterDate.add(1).months();
    }
    return headerMonths;
}