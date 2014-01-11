'use strict';

var services = angular.module('reservationApp.services', []);


services.factory('bookingService', function ($http) {
    var bookings;
    var getBookingsForResource = function (resourceId,yearMonth) {
        var promise = $http.get('/bookings/'+resourceId+"/"+yearMonth)
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

    return {
        getBookingsForResource: getBookingsForResource,
        reserveUnit: reserveUnit
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

services.factory('monthViewService', function (bookingService) {
    function addBookingsToView(start, weeks,resourceId) {
        bookingService.getBookingsForResource(resourceId, start.format('YYYY-MM-DD')).then(function (data) {
            data.forEach(function (booking) {
                var from = moment(booking.from),to=moment(booking.to);
                do{
                    var calendarDay = weeks[weekOfMonth(from)].days[from.weekday()];
                    calendarDay.isBusy = true;
                    calendarDay.booking = booking;
                }while (from.add('d', 1).isBefore(to) || from.isSame(to));
            });
        });
    }

    var generateCalendarMonthView = function (start,resourceId) {
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
        addBookingsToView(start, weeks,resourceId);
        return weeks;
    };
    return{
        generateCalendarMonthView: generateCalendarMonthView  //api
    }
});

