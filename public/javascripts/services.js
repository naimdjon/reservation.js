'use strict';

var services = angular.module('reservationApp.services', []);

services.factory('reservationService', function ($http,$location) {
    var urlPath=$location.path() || 'http://localhost:8000';
    var timelineData;

    var getTimelineData=function(){
        var promise=$http.get(urlPath+'/timelineData')
           .then(function(res){
                timelineData = res.data;
                return timelineData;
            });
        return promise;
    };


    var getDaysOfMonths=function getDaysOfMonths(startDate, endDate) {
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


    var getHeaderMonths = function getHeaderMonths(startDate, endDate) {
        var headerMonths = [];
        var counterDate = startDate.clone();
        while (counterDate < endDate) {
            var headerMonth = []
            headerMonth.monthWithYear = counterDate.toString("MMM/yyyy");
            headerMonth.daysInMonth = Date.getDaysInMonth(counterDate.getFullYear(), counterDate.getMonth());
            headerMonth.widthOfMonth = (headerMonth.daysInMonth * cellWidth)-1;
            headerMonths.push(headerMonth);
            counterDate.add(1).months();
        }
        return headerMonths;
    };


    var daysBetween = function (startDate, endDate) {
            if (!startDate || !endDate)
                return 0;
            var start= Date.parse(startDate,'yyyy-MM-dd');
            var end = Date.parse(endDate, 'yyyy-MM-dd');
            if (start.getYear() == 1901 || end.getYear() == 8099)
                return 0;
            var count = 0, date = start.clone();
            while (date.compareTo(end) == -1) {
                count = count + 1;
                date.addDays(1);
            }
            return count;
        };


    var gridCellToDate = function (gridCell, scope) {
        var container = gridCell.parent();
        var scroll = container.scrollLeft();
        var offset = gridCell.offset().left - container.offset().left - 1 + scroll;
        var daysFromStart = Math.round(offset / cellWidth);
        var date = scope.startDate.clone().addDays(daysFromStart);
        return date;
    };


    var setNewStart = function (reservationId,resourceId,newStart) {
        var promise=$http.post(urlPath+'/setNewStartDate', JSON.stringify({reservationId:reservationId,resourceId:resourceId,newStart:newStart}))
            .then(function(res){
                return  res.data;
            });
        return promise;
    };


    var reserveUnit = function (newReservationForm) {
        var reservationOnName=newReservationForm.name,index=newReservationForm.index, start=newReservationForm.start, end=newReservationForm.end;
        var result;
        var resourceId = timelineData[index]._id;
        var promise=$http.post(urlPath+'/newReservation', JSON.stringify({reservationOnName:reservationOnName,resourceId: resourceId,start:start,end:end}))
            .then(function(res){
                result = res.data;
                console.log(result["newReservationId"]);
                if(result && result["newReservationId"] && result["newReservationId"].length>0)
                    timelineData[index].reservations.push({_id: result["newReservationId"], name: reservationOnName, start: start, end: end});
                return result;
            });
        return promise;
    };

    return {
        getTimelineData:  getTimelineData,
        reserveUnit: reserveUnit,
        setNewStart: setNewStart,
        getDaysOfMonths: getDaysOfMonths,
        getHeaderMonths: getHeaderMonths,
        daysBetween: daysBetween,
        gridCellToDate: gridCellToDate
    };
});