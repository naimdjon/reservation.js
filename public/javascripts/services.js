'use strict';

var services = angular.module('reservationApp.services', []);


services.factory('bookingService', function ($http, $location) {
    var urlPath = $location.path();// || 'http://localhost:8000';
    var timelineData;
    var reservations;
    var getTimelineData = function () {
        var promise = $http.get(urlPath + '/timelineData')
            .then(function (res) {
                timelineData = res.data;
                return timelineData;
            });
        return promise;
    };

    var getReservations = function (resourceId,yearMonth) {
        var promise = $http.get(urlPath + '/bookings/'+resourceId+"/"+yearMonth)
            .then(function (res) {
                reservations = res.data;
                return reservations;
            });
        return promise;
    };

    //flat view
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

    //flat view
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

    //flat view
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

    //flat view
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

    //flat view
    var reservationDrag = function (reservationId, resourceId, newStart, newEnd) {
        console.log("timelineData:" + timelineData[0].reservations);
        var promise = $http.post(urlPath + '/reservationMove', JSON.stringify({reservationId: reservationId, resourceId: resourceId, newStart: newStart, newEnd: newEnd}))
            .then(function (res) {
                return  res.data;
            });
        return promise;
    };

    //flat view
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
        getReservations: getReservations,
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

function weekOfMonth(d){
    var firstDay=moment(d).date(1);
    return moment(d).isoWeek()-firstDay.isoWeek();
}

services.factory('monthViewService', function (bookingService, $location) {
    var path = $location.absUrl();
    var resourceId = path.substr(path.indexOf("monthView/") + 10).replace('/', ''); //todo: configure ngRoute for this.

    function addBookingsToView(start, weeks) {
        bookingService.getReservations(resourceId, start.format('YYYY.MM.DD')).then(function (data) {
            data.forEach(function (booking) {
                var from = moment(booking.from);
                do{
                    var calendarDay = weeks[weekOfMonth(from)].days[from.weekday()];
                    calendarDay.isBusy = true;
                    calendarDay.booking = booking;
                }while (from.add('d', 1).isBefore(moment(booking.to)));
            });
        });
    }

    var generateCalendarMonthView = function (start, $scope) {
        var weeks = [];
        var end=start.clone().add('M',1);
        var runnerDate = (start.clone()).isoWeekday(1);
        while (runnerDate.isBefore(end)){
            var week={week:runnerDate.week(),days:[]};
            for(var weekDay=0; weekDay<=6;weekDay++) {
                week.days.push({label:runnerDate.date(),isCurrentMonth:(start.month()==runnerDate.month())});
                runnerDate.add('d',1);
            }
            weeks.push(week);
        }
        addBookingsToView(start, weeks);
        return weeks;
    };
    return{
        generateCalendarMonthView: generateCalendarMonthView  //api
    }
});

