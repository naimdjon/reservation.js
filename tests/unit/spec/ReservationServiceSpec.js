'use strict';

describe('ReservationService', function () {
    beforeEach(module('reservationApp.services'));


    describe('definition', function () {
        it('should be defined', inject(function (reservationService) {
            expect(reservationService).toBeDefined();
        }));
    });

    describe('getDaysOfMonths', function () {
        var startDate,endDate;
        var dayOfMonth;
        beforeEach(inject(function (reservationService) {
            startDate=Date.today().set({day: 1,month:8,year:2013});
            endDate=startDate.clone().add(8).days();
            dayOfMonth=reservationService.getDaysOfMonths(startDate,endDate);
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
        beforeEach(inject(function (reservationService) {
            var startDate=Date.today().set({day: 1,month:8,year:2013});
            headerMonths = reservationService.getHeaderMonths(startDate, startDate.clone().add(5).months());
        }));

        it('should return 5 headerMonths from current month and 5 months from now', function() {
            expect(headerMonths.length).toBe(5);
        });

        it('should return correct month with year formatting', function() {
            expect(headerMonths[0].monthWithYear).toBe('Sep/2013');
        });

        it('should calculate width for the monthWithYear header correctly', inject(function (reservationService) {
            expect(headerMonths[0].widthOfMonth).toBe(629);/*(30*21)-1*/
        }));
    });

    describe('daysBetween', function () {
        it('should return 8 as number of days between today and 8 days from today', inject(function (reservationService) {
            var numberOfDays = reservationService.daysBetween(Date.today(), Date.today().add(8).days());
            expect(numberOfDays).toBe(8);
        }));

        it('should return 0 if start year (getYear())  is 1901', inject(function (reservationService) {
            var start=Date.today().set({year:3801,month:0,day:1});
            var numberOfDays = reservationService.daysBetween(start, start.clone().add(8).days());
            expect(numberOfDays).toBe(0);
        }));

        it('should return 0 if end year (getYear()) is 8099', inject(function (reservationService) {
            var end=Date.today().set({year:9999});
            var numberOfDays = reservationService.daysBetween(end.clone().add(-2).days(), end);
            expect(numberOfDays).toBe(0);
        }));

    });

});



