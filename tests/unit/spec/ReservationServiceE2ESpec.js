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

    beforeEach(inject(function(reservationService){
        reservationService.getTimelineData().then(function(data){
            timelineData=data;
        });
    }));

    describe('timelineData', function () {
        it('should send data to the server to get the timelineData', inject(function (reservationService) {
            reservationService.getTimelineData().then(function(data){
                timelineData=data;
            });
            $httpBackend.flush();
            expect(timelineData).toBeDefined();
        }));
    });

    describe('reserveUnit', function () {
        it('should send data to the server for reservation', inject(function (reservationService) {
            reservationService.getTimelineData().then(function(data){
                timelineData=data;
            });
            $httpBackend.flush();
            var newReservationForm={name:"test",start:Date.today(),end:Date.today().add(2).days(),index:0};
            var resultMessage='';
            reservationService.reserveUnit(newReservationForm).then(function(result){
                resultMessage=result["error"];
            });
            $httpBackend.flush();
            expect(resultMessage).toEqual("CheckError");
        }));
    });

});



