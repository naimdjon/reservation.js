
var controllers = angular.module('reservationApp.controllers', []);

controllers.controller("TimelineCtrl", function ($scope,$modal, $http, reservationService) {
    this.startDate = Date.today().set({day: 1});
    $scope.startDate = this.startDate;
    this.endDate = this.startDate.clone().add(1).years();
    this.headerMonths = reservationService.getHeaderMonths(this.startDate, this.endDate);
    this.daysOfMonths = reservationService.getDaysOfMonths(this.startDate, this.endDate);
    this.daysBetween = reservationService.daysBetween;
    reservationService.getTimelineData().then(function(data){
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

    modalInstance.result.then(function (x) {
    }, function () {
      console.log('Modal dismissed at: ' + new Date()+"...");
    });
  };
});




var ModalInstanceCtrl = function ($scope, $modalInstance,reservationService,newReservationForm) {
  $scope.newReservationForm = newReservationForm;
  $scope.ok = function () {
      reservationService.reserveUnit(newReservationForm)
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
