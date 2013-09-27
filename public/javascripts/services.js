'use strict';

var factories = angular.module('reservationApp.services', []);

factories.factory('bookingHelper', function ($http,$location) {
    var urlPath=$location.path();
    var timelineData;
    var getTimelineData=function(){
        var promise=$http.get(urlPath+'/timelineData')
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
        var promise=$http.post(urlPath+'/setNewStart', JSON.stringify({reservationId:reservationId,resourceId:resourceId,newStart:newStart}))
            .then(function(res){
                return  res.data;
            });
        return promise;
    };
    var reserveUnit = function (reservationOnName,index, start, end) {
        var result;
        var promise=$http.post(urlPath+'/newReservation', JSON.stringify({reservationOnName:reservationOnName,resourceId:getResourceIdFromIndex(index),start:start,end:end}))
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