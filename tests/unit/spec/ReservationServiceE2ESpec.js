'use strict';

describe('', function () {
    beforeEach(module('reservationApp.services'));
    var $httpBackend;
    var timelineData;

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', '/timelineData').respond(
            [
                {
                    _id: 25,
                    name: "TestResource",
                    reservations: [
                        {
                            _id: 11,
                            name: "TestName",
                            start: "2013-09-29",
                            end: "2013-10-02d"
                        }
                    ]
                }
            ]
        );
        $httpBackend.when('POST', '/newReservation').respond({error: 'CheckError'});
    }));

    beforeEach(inject(function(bookingService){
        bookingService.getTimelineData().then(function(data){
            timelineData=data;
        });
    }));

    describe('timelineData', function () {
        it('should send data to the server to get the timelineData', inject(function (bookingService) {
            bookingService.getTimelineData().then(function(data){
                timelineData=data;
            });
            $httpBackend.flush();
            expect(timelineData).toBeDefined();
        }));
    });
    describe('reserveUnit', function () {
        it('should send data to the server for reservation', inject(function (bookingService) {
            bookingService.getTimelineData().then(function(data){
                timelineData=data;
            });
            $httpBackend.flush();
            var newReservationForm={name:"test",start:Date.today(),end:Date.today().add(2).days(),index:0};
            var resultMessage='';
            bookingService.reserveUnit(newReservationForm).then(function(result){
                resultMessage=result["error"];
            });
            $httpBackend.flush();
            expect(resultMessage).toEqual("CheckError");
        }));
    });

    describe('reservationDrag', function () {
        it('should get the correct enddate given a newStartDate', function () {
            var endDate = getEndDateFromStartDate(moment('20130902','YYYYMMDD'), 2);
            expect(endDate.format('DD.MM.YYYY')).toEqual('04.09.2013');
        });

        it('should get the correct numberOfDays between start and end', function () {
            var diff = diffDates(moment('20130902','YYYYMMDD'), moment('20130910','YYYYMMDD'));
            expect(8).toEqual(diff);
        });
    });

});



