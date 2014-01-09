'use strict';

describe('ReservationService', function () {
    beforeEach(module('reservationApp.services'));


    describe('definition', function () {
        it('should be defined', inject(function (bookingService) {
            expect(bookingService).toBeDefined();
        }));
    });

    describe('getDaysOfMonths', function () {
        var startDate,endDate;
        var dayOfMonth;
        beforeEach(inject(function (bookingService) {
            startDate=Date.today().set({day: 1,month:8,year:2013});
            endDate=startDate.clone().add(8).days();
            dayOfMonth=bookingService.getDaysOfMonths(startDate,endDate);
        }));

        it('should return 8 days between today  and 8 days from now', function() {
            expect(dayOfMonth.length).toBe(8);
        });

        it('should return correct day', function() {
            expect(dayOfMonth[0].day).toEqual('01');
        });

        it('should return correct month header for the timeline', function() {
            expect(dayOfMonth[0].month).toEqual('Sep/2013');
        });

        it('should return correct year', function() {
            expect(dayOfMonth[0].year).toEqual('2013');
        });

        it('should flag "7.09.2013" as a weekend', function(){
            expect(dayOfMonth[7].isWeekend).toBe(true);
        });
    });

    describe('getHeaderMonths', function () {
        var headerMonths;
        beforeEach(inject(function (bookingService) {
            var startDate=Date.today().set({day: 1,month:8,year:2013});
            headerMonths = bookingService.getHeaderMonths(startDate, startDate.clone().add(5).months());
        }));

        it('should return 5 headerMonths from current month and 5 months from now', function() {
            expect(headerMonths.length).toBe(5);
        });

        it('should return correct month with year formatting', function() {
            expect(headerMonths[0].monthWithYear).toBe('Sep/2013');
        });

        it('should calculate width for the monthWithYear header correctly', inject(function (bookingService) {
            expect(headerMonths[0].widthOfMonth).toBe(629);/*(30*21)-1*/
        }));
    });

    describe('daysBetween', function () {
        it('should return 8 as number of days between today and 8 days from today', inject(function (bookingService) {
            var numberOfDays = bookingService.daysBetween(Date.today(), Date.today().add(8).days());
            expect(numberOfDays).toBe(8);
        }));

        it('should return 0 if start year (getYear())  is 1901', inject(function (bookingService) {
            var start=Date.today().set({year:3801,month:0,day:1});
            var numberOfDays = bookingService.daysBetween(start, start.clone().add(8).days());
            expect(numberOfDays).toBe(0);
        }));

        it('should return 0 if end year (getYear()) is 8099', inject(function (bookingService) {
            var end=Date.today().set({year:9999});
            var numberOfDays = bookingService.daysBetween(end.clone().add(-2).days(), end);
            expect(numberOfDays).toBe(0);
        }));

    });



    describe('weekOfMonth', function () {
        moment.lang('nb');//make sure the week starts on monday
        it('should return 0 as week of month for [2014-1-1]',function(){
            var week = weekOfMonth('2014-1-1');
            expect(week).toBe(0);
        });

        it('should return 5 as week of month for [2014-06-30]',function(){
            moment.lang('nb');
            var week = weekOfMonth('2014-6-30');
            expect(week).toBe(5);
        });

        it('should return 0 as week of month for a first sunday of a month, i.e. [2014-6-1]',function(){
            var week = weekOfMonth('2014-6-1');
            expect(week).toBe(0);
        });

        it('should return 0 as week of month for a first monday of a month, i.e. [2014-12-1]',function(){
            var week = weekOfMonth('2014-12-1');
            expect(week).toBe(0);
        });

        it('should return 3as week of month for a wednesday of a month, i.e. [2014-8-20]',function(){
            var week = weekOfMonth('2014-8-20');
            expect(week).toBe(3);
        });

    });

});



