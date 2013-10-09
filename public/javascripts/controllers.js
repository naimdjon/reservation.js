var controllers = angular.module('reservationApp.controllers', []);

controllers.controller("TimelineCtrl", function ($scope, $modal, $http, reservationService) {
    this.startDate = Date.today().set({day: 1});
    $scope.startDate = this.startDate;
    this.endDate = this.startDate.clone().add(1).years();
    this.headerMonths = reservationService.getHeaderMonths(this.startDate, this.endDate);
    this.daysOfMonths = reservationService.getDaysOfMonths(this.startDate, this.endDate);
    this.daysBetween = reservationService.daysBetween;
    reservationService.getTimelineData().then(function (data) {
        $scope.timelineData = data;
    });

    $scope.openNewReservationDialog = function (index, slideStart, slideEnd) {
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
    };
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


controllers.controller("MonthViewCtrl", function ($scope,monthViewService,$cacheFactory) {
    moment.lang('nb');
    var cache = $cacheFactory('monthsBlocks');
    this.start = moment({day: 1});
    this.currentMonth = this.start.format('MMMM / YYYY');
    this.daysOfWeek = [];
    for (var i = 0; i < 7; i++)
        this.daysOfWeek.push(moment().startOf('week').add('days', i).format('ddd'));
    this.datesOfMonths=monthViewService.generateMonthViewDays(this.start,$scope);

    this.newReservation = function () {
        console.log("nnnnnn");
    };
    var sstart=moment();
    var eend=moment().add('d',5);
    this.blocks=[
        {id:1,start:sstart,end:eend,name:"NNNNaimdjon"}
    ];

    this.changeMonth = function (num) {
        var newStart=this.start.clone().add('months',num);
        this.currentMonth = newStart.format('MMMM / YYYY');
        this.datesOfMonths=monthViewService.generateMonthViewDays(newStart);
        this.start=newStart;
    }

    this.blockPosition=function(block) {
        var position=cache.get(block.id);
        if(!(position == undefined))return position;
        var date=block.start;
        var startOfMonth=date.clone().startOf('month');
        var indexWeek=1+date.week()-startOfMonth.week();
        var top=110*indexWeek;
        var left=40+(169*(date.day()-1));
        console.log("top:"+top+", left:"+left+", for: "+date.format('DD.MMMM')+", day:"+date.day());
        startOfMonth.week();
        position={left:left,top:top}
        cache.put(block.id,position);
        return position;

    };
});


