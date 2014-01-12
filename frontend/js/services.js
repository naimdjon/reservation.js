'use strict';

var services = angular.module('reservationApp.services', []);


services.factory('bookingService', function ($http) {
    var bookings;
    var getBookingsForResource = function (resourceId,from) {
        var promise = $http.get('/bookings/'+resourceId+"/"+from)
            .then(function (res) {
                bookings = res.data;
                return bookings;
            });
        return promise;
    };
    var reserveUnit = function (newBookingForm) {
        var userEmail = newBookingForm.userEmail,resourceId=newBookingForm.resourceId, from = newBookingForm.fromDate, to = newBookingForm.toDate;
        var result;
        var promise = $http.put('/booking', JSON.stringify({to_be_cleaned:newBookingForm.to_be_cleaned,userEmail: userEmail, resourceId: resourceId, from: from.format('YYYY-MM-DD'), to: to.format('YYYY-MM-DD')}))
            .then(function (res) {
                result = res.data;
                console.log("newBookingId:"+result["newBookingId"]);
                return result;
            });
        return promise;
    };
    var greenPeriods=function(from,to){
        return $http.get('/green_periods/'+from+":"+to)
            .then(function (res) {
                return res.data;
            });
    };
    return {
        getBookingsForResource: getBookingsForResource,
        getGreenPeriods: greenPeriods,
        reserveUnit: reserveUnit
    };
});

function weekOfMonth(d){
    var firstDay=moment(d).date(1);
    return moment(d).isoWeek()-firstDay.isoWeek();
}

services.factory('monthViewService', function (bookingService) {
    function addBookingsToView(start, weeks,resourceId) {
        bookingService.getBookingsForResource(resourceId, start.format('YYYY-MM-DD')).then(function (data) {
            console.dir(data);
            data.forEach(function (booking) {
                var from = moment(booking.from),to=moment(booking.to);
                do{
                    var calendarDay = weeks[weekOfMonth(from)].days[from.weekday()];
                    if(calendarDay.month==from.month()){
                        calendarDay.isBusy = true;
                        calendarDay.booking = booking;
                    }
                }while (from.add('d', 1).isBefore(to) || from.isSame(to));
            });
        });
    }

    function markGreenPeriods(start,calendarView) {
        bookingService.getGreenPeriods(start.format('YYYY-MM-DD'),start.clone().add('m',1).format('YYYY-MM-DD'))
            .then(function (data) {
                calendarView.greenPeriods=data;
                calendarView.greenPeriods.forEach(function (greenPeriod) {
                    var from = moment(greenPeriod.from),to=moment(greenPeriod.to);
                    if(from.month()==start.month()){
                        do{
                            var calendarDay = calendarView.weeks[weekOfMonth(from)].days[from.weekday()];
                            calendarDay.isBusy?calendarDay.isBusyGreenDay=true:calendarDay.isGreenDay = true;
                        }while (from.add('d', 1).isBefore(to) || from.isSame(to));
                    }
                });
            });
    }

    function generateDates(weeks,start) {
        var end = start.clone().add('M', 1);
        var runnerDate = (start.clone()).isoWeekday(1);
        while (runnerDate.isBefore(end)) {
            var week = {week: runnerDate.week(), days: [], number: runnerDate.isoWeek()};
            for (var weekDay = 0; weekDay <= 6; weekDay++) {
                week.days.push({label: runnerDate.date(),month:runnerDate.month(), isCurrentMonth: (start.month() == runnerDate.month()), momentDate: runnerDate.clone()});
                runnerDate.add('d', 1);
            }
            weeks.push(week);
        }
    }


    var generateCalendarMonthView = function (start,resourceId) {
        var calendarView={weeks: []};
        generateDates(calendarView.weeks,start);
        addBookingsToView(start, calendarView.weeks,resourceId);
        markGreenPeriods(start, calendarView);
        return calendarView;
    };
    return{
         generateCalendarMonthView: generateCalendarMonthView //api
    }
});

