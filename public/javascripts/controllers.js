
var controllers = angular.module('reservationApp.controllers', []);

controllers.controller("TimelineCtrl", function ($scope,$modal, $http, reservationHelper) {
    this.startDate = Date.today().set({day: 1});
    $scope.startDate = this.startDate;
    this.endDate = this.startDate.clone().add(1).years();
    this.headerMonths = reservationHelper.getHeaderMonths(this.startDate, this.endDate);
    this.daysOfMonths = reservationHelper.getDaysOfMonths(this.startDate, this.endDate);
    this.daysBetween = reservationHelper.daysBetween;
    reservationHelper.getTimelineData().then(function(data){
        $scope.timelineData = data;
    });




  $scope.openNewReservationDialog = function (index, slideStart, slideEnd) {
    $scope.newReservationForm={name:"",index:index,start:slideStart,end:slideEnd};
    var modalInstance = $modal.open({
      templateUrl: 'newReservationDialog',
      controller: ModalInstanceCtrl,
      windowClass:"modalDialog",
        resolve: {
            newReservationForm: function () {
                return $scope.newReservationForm;
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




var ModalInstanceCtrl = function ($scope, $modalInstance,reservationHelper,newReservationForm) {
  $scope.newReservation = newReservationForm;
  $scope.ok = function () {
      reservationHelper.reserveUnit(newReservationForm.name,newReservationForm.index, newReservationForm.start, newReservationForm.end)
          .then(function(result){
              if(result && (result["error"] && result["error"].length>0)) {
                  $scope.newReservationError=result["error"];
              }else{
                  $scope.newReservationError="";
                  $modalInstance.close();
              }
          });
  };

  $scope.cancel = function () {$modalInstance.dismiss('cancel');};
};
