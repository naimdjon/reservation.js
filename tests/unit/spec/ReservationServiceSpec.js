'use strict';

describe('ReservationService', function () {
    beforeEach(module('reservationApp.services'));

    describe('definition', function () {
        it('should be defined', inject(function (reservationService) {
            expect(reservationService).toBeDefined();
        }));
    });

    describe('getDaysOfMonths', function () {
        it('should return 5 days between today  and 5 days from now', inject(function (reservationService) {
            var dayOfMonth = reservationService.getDaysOfMonths(Date.today(), Date.today().add(5).days());
            expect(dayOfMonth.length).toBe(5);
        }));

        it('should return correct day', inject(function (reservationService) {
            var dayOfMonth = reservationService.getDaysOfMonths(Date.today(), Date.today().add(5).days());
            expect(Date.today().toString('dd')).toEqual(dayOfMonth[0].day);
        }));

        it('should return correct month header for the timeline', inject(function (reservationService) {
            var dayOfMonth = reservationService.getDaysOfMonths(Date.today(), Date.today().add(5).days());
            expect(Date.today().toString('MMM/yyyy')).toEqual(dayOfMonth[0].month);
        }));

        it('should return correct year', inject(function (reservationService) {
            var dayOfMonth = reservationService.getDaysOfMonths(Date.today(), Date.today().add(5).days());
            expect(Date.today().toString('yyyy')).toEqual(dayOfMonth[0].year);
        }));

        it('should flag weekends', inject(function (reservationService) {
            var dayOfMonth = reservationService.getDaysOfMonths(Date.monday(), Date.today().next().sunday());
            expect(dayOfMonth[5].isWeekend).toBe(true);
        }));
    });

    describe('getHeaderMonths', function () {
        it('should return 5 headerMonths from current month and 5 months from now', inject(function (reservationService) {
            var headerMonths = reservationService.getHeaderMonths(Date.today(), Date.today().add(5).months());
            expect(headerMonths.length).toBe(5);
        }));

        it('should return correct month with year formatting', inject(function (reservationService) {
            var headerMonth = reservationService.getHeaderMonths(Date.today(), Date.today().add(5).days());
            expect(headerMonth[0].monthWithYear).toBe(Date.today().toString("MMM/yyyy"));
        }));

        it('should calculate width for the monthWithYear header correctly', inject(function (reservationService) {
            var start=Date.today().set({day: 1,month:8,year:2013});
            var headerMonth = reservationService.getHeaderMonths(start, start.clone().add(5).days());
            expect(headerMonth[0].widthOfMonth).toBe(629);/*30*21-1*/
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



