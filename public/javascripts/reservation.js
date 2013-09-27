"use strict";
var prefixURL="http://localhost:8000";
var cellWidth = 21;
var reservationApp = angular.module('reservationApp', ['ui.bootstrap']);
var slideStarted = false;
var slideCells = [];
var slideWeekendCells = [];

reservationApp.factory('bookingHelper', function ($http) {
    var timelineData;
    var getTimelineData=function(){
        var promise=$http.get(prefixURL+'/timelineData')
           .then(function(res){
                timelineData = res.data;
                return timelineData;
            });
        return promise;
    };

    var gridCellToDate = function (gridCell, scope) {
        var container = gridCell.parent();
        var scroll = container.scrollLeft();
        var offset = gridCell.offset().left - container.offset().left - 1 + scroll;
        var daysFromStart = Math.round(offset / cellWidth);
        var date = scope.startDate.clone().addDays(daysFromStart);
        return date;
    };

    var getResourceIdFromIndex = function (index) {
        return timelineData[index]._id;
    };

    var setNewStart = function (reservationId,resourceId,newStart) {
        var result;
        var promise=$http.post(prefixURL+'/setNewStart', JSON.stringify({reservationId:reservationId,resourceId:resourceId,newStart:newStart}))
            .then(function(res){
                return  res.data;
            });
        return promise;
    };
    var reserveUnit = function (reservationOnName,index, start, end) {
        var result;
        var promise=$http.post(prefixURL+'/newReservation', JSON.stringify({reservationOnName:reservationOnName,resourceId:getResourceIdFromIndex(index),start:start,end:end}))
            .then(function(res){
                result = res.data;
                if(result && (!result["error"] || !result["error"].length>0))
                    timelineData[index].series.push({id: 100, name: reservationOnName, start: start, end: end});
                return result;
            });
        return promise;
    };
    return {
        getTimelineData:  getTimelineData,
        reserveUnit: reserveUnit,
        setNewStart: setNewStart,
        getResourceIdFromIndex: getResourceIdFromIndex,
        gridCellToDate: gridCellToDate
    };
});


reservationApp.directive('bookingDrag', function (bookingHelper) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            var options = scope.$eval(attrs.bookingDrag);
            elm.draggable({
                axis: "x",
                grid: [cellWidth, cellWidth],
                start: function () {
                    var x = jQuery(this);
                    x.zIndex(x.zIndex() + 1);
                },
                stop: function () {
                    var block = jQuery(this);
                    var newStart = bookingHelper.gridCellToDate(block, scope);
                    block.zIndex(block.zIndex() - 1);
                    console.log("bookingid:" + options.reservationId +",resourceId:"+options.resourceId+ ", newStart:" + newStart);
                    bookingHelper.setNewStart(options.reservationId,options.resourceId,newStart)
                        .then(function(result){
                            console.log("done!");
                        });

                }
            });
        }
    };
})
    .directive('bookingSlideNew', function (bookingHelper) {
        var slideStart;
        var index;
        return{
            restrict: 'A',
            link: function (scope, e, attrs) {
                e.bind('mousemove', function (event) {
                    if (slideStarted && !e.hasClass("selectClass")) {
                        e.addClass("selectClass");
                        slideCells.push(e);
                    }
                });
                e.bind('mousedown', function (event) {
                    if (!slideStarted) {
                        slideStarted = true;
                        var gridCell = jQuery(this);
                        gridCell.addClass("selectClass");
                        slideCells.push(gridCell);
                        index=gridCell.parent().index();
                        slideStart  = bookingHelper.gridCellToDate(gridCell, scope);
                    }
                });
                e.bind('mouseup', function (event) {
                    if (slideStarted) {
                        slideStarted = false;
                        for (var i = 0; i < slideCells.length; i++) {
                            slideCells[i].removeClass("selectClass");
                        }
                        var slideEnd = bookingHelper.gridCellToDate(jQuery(this), scope);
                        if(slideStart.equals(slideEnd))
                            slideEnd.add(1).days();
                        console.log(slideEnd.compareTo(slideStart));
                        if(slideEnd.compareTo(slideStart)<0){
                            var temp=slideStart;
                            slideStart=slideEnd;
                            slideEnd=temp;
                        }
                        console.log("slideStart:"+slideStart.toString("yyyy-MM-dd")+" -- " + slideEnd.toString("yyyy-MM-dd"));
                        scope.openNewBookingDialog(index, slideStart.toString("yyyy-MM-dd"), slideEnd.toString("yyyy-MM-dd"));
                        //scope.$apply();
                    }
                });
            }
        }
    })
    .directive('bookingResize', function (bookingHelper) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                var options = scope.$eval(attrs.bookingDrag);
                elm.resizable({
                    handles: "e,w",
                    grid: cellWidth,
                    stop: function () {
                        var block = jQuery(this);
                        var newStart = bookingHelper.gridCellToDate(block, scope);
                        var width = block.outerWidth();
                        var numberOfDays = Math.round(width / cellWidth);
                        console.log("numberOfDays:" + numberOfDays + ",bookingid:" + options.bookingid + ", newStart:" + newStart);
                    }
                });
            }
        };
    });

reservationApp.controller("TimelineDatesCtrl", function ($scope,$modal, $http, bookingHelper) {
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
        /*if(startDate.indexOf("Z")>-1){
            start=JSON.parse(startDate);
        }else
            start= Date.parse(startDate,'yyyy-MM-dd');
        console.log("startDate:"+startDate+", start:"+start);
        var end;
        if (endDate.indexOf("Z") > -1) {
            end = JSON.parse(endDate);
        } else
            end = Date.parse(endDate, 'yyyy-MM-dd');*/
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
    /*$http.get('http://localhost:8000/timelineData')
               .then(function(res){
                  var timeline=res.data;
                  console.log(timeline);
                  $scope.timelineData=timeline;
                });*/
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