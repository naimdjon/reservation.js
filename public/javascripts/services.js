'use strict';

var services = angular.module('reservationApp.services', []);

services.factory('reservationService', function ($http, $location) {
    var urlPath = $location.path();// || 'http://localhost:8000';
    var timelineData;

    var getTimelineData = function () {
        //console.log(":::"+timelineData);
        var promise = $http.get(urlPath + '/timelineData')
            .then(function (res) {
                timelineData = res.data;
                return timelineData;
            });
        return promise;
    };


    var getDaysOfMonths = function getDaysOfMonths(startDate, endDate) {
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
            headerMonth.widthOfMonth = (headerMonth.daysInMonth * cellWidth) - 1;
            headerMonths.push(headerMonth);
            counterDate.add(1).months();
        }
        return headerMonths;
    };


    var daysBetween = function (startDate, endDate) {
        if (!startDate || !endDate)
            return 0;
        var start = Date.parse(startDate, 'yyyy-MM-dd');
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


    var gridCellToStartDate = function (gridCell, scope) {
        var container = gridCell.parent();
        var scroll = container.scrollLeft();
        var offset = gridCell.offset().left - container.offset().left - 1 + scroll;
        var daysFromStart = Math.round(offset / cellWidth);
        /*console.log("daysFromStart:"+daysFromStart);
         console.log("scope.startDate:"+scope.startDate+", type:"+typeof(scope.startDate));*/
        var date = scope.startDate.clone().addDays(daysFromStart);
        //console.log("newdate:"+date+", type:"+typeof(date));
        return date;
    };


    var reservationDrag = function (reservationId, resourceId, newStart, newEnd) {
        console.log("timelineData:" + timelineData[0].reservations);
        var promise = $http.post(urlPath + '/reservationMove', JSON.stringify({reservationId: reservationId, resourceId: resourceId, newStart: newStart, newEnd: newEnd}))
            .then(function (res) {
                return  res.data;
            });
        return promise;
    };

    var reservationResize = function (reservationId, resourceId, newStart, newEnd) {
        var promise = $http.post(urlPath + '/reservationChangeDates', JSON.stringify({reservationId: reservationId, resourceId: resourceId, newStart: newStart, newEnd: newEnd}))
            .then(function (res) {
                return  res.data;
            });
        return promise;
    };


    var reserveUnit = function (newReservationForm) {
        var reservationOnName = newReservationForm.name, index = newReservationForm.index, start = newReservationForm.start, end = newReservationForm.end;
        var result;
        var resourceId = timelineData[index]._id;
        var promise = $http.post('/newReservation', JSON.stringify({reservationOnName: reservationOnName, resourceId: resourceId, start: start, end: end}))
            .then(function (res) {
                result = res.data;
                console.log(result["newReservationId"]);
                if (result && result["newReservationId"] && result["newReservationId"].length > 0)
                    timelineData[index].reservations.push({_id: result["newReservationId"], name: reservationOnName, start: start, end: end});
                return result;
            });
        return promise;
    };

    return {
        getTimelineData: getTimelineData,
        reserveUnit: reserveUnit,
        reservationDrag: reservationDrag,
        reservationResize: reservationResize,
        getDaysOfMonths: getDaysOfMonths,
        getHeaderMonths: getHeaderMonths,
        daysBetween: daysBetween,
        gridCellToStartDate: gridCellToStartDate
    };
});

function eq(moment1, moment2){
    return moment1.date()==moment2.date()
     && moment1.year()==moment2.year()
    && moment1.month()==moment2.month();
}

function assignReservationBlocks(timelineData,resourceId,earliestStart,end) {
    var reservationBlocks=[];
    //console.log("end:"+end.format('DD.MM.YYYY'));
    for(var i in timelineData) {
        //console.log("xxx:"+timelineData[i]._id);
        if(timelineData[i]._id==resourceId){
            for(var r in timelineData[i].reservations){
                var res=timelineData[i].reservations[r];
                var s=moment(res.start);
                var e=moment(res.end);
                //console.log("found res:"+s+"("+ s.format('DD.MM')+" --- "+earliestStart.format('DD.MM')+")"+", is before start:"+s.isBefore(earliestStart)+", isafter end:"+s.isAfter(end));
                if(s.isBefore(earliestStart) || s.isAfter(end) || eq(s,end)
                    || e.isBefore(earliestStart) || e.isBefore(s))
                    continue;
                if(reservationBlocks[s.date()]==undefined)reservationBlocks[s.date()]=[];
                reservationBlocks[s.date()].push(res);
            }
        }
    }
    return reservationBlocks;

}

services.factory('monthViewService', function (reservationService) {
    var generateMonthViewDays = function (start,$scope) {
        var runnerDate = start.clone();
        var startWeek = start.week();
        var datesOfMonths = [];
        datesOfMonths[0] = [];
        var day = runnerDate.day();
        if (day == 0)day = 7;
        for (var i = 1; i < day; i++)
            datesOfMonths[0].push({label:'none' + i});
        var end = runnerDate.clone().add('months', 1);
        //console.log("reservationBlocks:"+reservationBlocks[0]);
        var indexWeek = 0, previousWeek = startWeek;
        while (runnerDate.isBefore(end)) {
            if (runnerDate.week() != previousWeek) {
                ++indexWeek;
                previousWeek = runnerDate.week();
            }
            if (datesOfMonths[indexWeek] == undefined)datesOfMonths[indexWeek] = [];
            var dateWithBlock={};
            dateWithBlock.label=runnerDate.date();
            datesOfMonths[indexWeek].push(dateWithBlock);
            runnerDate = runnerDate.add('days', 1);
        }
        var remainingCells = (datesOfMonths[indexWeek - 1].length - datesOfMonths[indexWeek].length)
        for (var i = 0; i < remainingCells; i++)
            datesOfMonths[indexWeek].push({label:'none' + i});

        reservationService.getTimelineData().then(function (data) {
            var reservationBlocks=assignReservationBlocks(data,"524b53548aa4f388de1c2dda",start,end);
            for (var i=0;i<reservationBlocks.length;i++) {
               if(reservationBlocks[i]==undefined)continue;
                for(var j=0;j<reservationBlocks[i].length;j++) {
                    var res=reservationBlocks[i][j];
                    var resStart=moment(res.start,'YYYY-MM-DD');
                    var resEnd=moment(res.end,'YYYY-MM-DD');
                    var idxWeek=resStart.week()-startWeek;
                    if(datesOfMonths[idxWeek][resStart.day()].blocks==undefined)
                        datesOfMonths[idxWeek][resStart.day()].blocks=[]
                    datesOfMonths[idxWeek][resStart.day()].blocks.push({name:res.name,span:resEnd.diff(resStart,"days"),tooltip:res.start+","+res.end+", "+res.name+","+res._id});
                }
            }
        });
        return datesOfMonths;
    };
    return{
        generateMonthViewDays: generateMonthViewDays
    }
});