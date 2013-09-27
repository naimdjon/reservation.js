'use strict';

var directives=angular.module('reservationApp.directives', []);

directives.directive('bookingDrag', function (bookingHelper) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            var options = scope.$eval(attrs.bookingDrag);
            elm.draggable({
                axis: "x",
                grid: [cellWidth, cellWidth],
                start: function () {
                    var x = jQuery(this);
                    x.zIndex(x.zIndex() + 1);
                },
                stop: function () {
                    var block = jQuery(this);
                    var newStart = bookingHelper.gridCellToDate(block, scope);
                    block.zIndex(block.zIndex() - 1);
                    console.log("bookingid:" + options.reservationId +",resourceId:"+options.resourceId+ ", newStart:" + newStart);
                    bookingHelper.setNewStart(options.reservationId,options.resourceId,newStart)
                        .then(function(result){
                            console.log("done!");
                        });

                }
            });
        }
    };
})
    .directive('bookingSlideNew', function (bookingHelper) {
        var slideStart;
        var index;
        return{
            restrict: 'A',
            link: function (scope, e, attrs) {
                e.bind('mousemove', function (event) {
                    if (slideStarted && !e.hasClass("selectClass")) {
                        e.addClass("selectClass");
                        slideCells.push(e);
                    }
                });
                e.bind('mousedown', function (event) {
                    if (!slideStarted) {
                        slideStarted = true;
                        var gridCell = jQuery(this);
                        gridCell.addClass("selectClass");
                        slideCells.push(gridCell);
                        index=gridCell.parent().index();
                        slideStart  = bookingHelper.gridCellToDate(gridCell, scope);
                    }
                });
                e.bind('mouseup', function (event) {
                    if (slideStarted) {
                        slideStarted = false;
                        for (var i = 0; i < slideCells.length; i++) {
                            slideCells[i].removeClass("selectClass");
                        }
                        var slideEnd = bookingHelper.gridCellToDate(jQuery(this), scope);
                        if(slideStart.equals(slideEnd))
                            slideEnd.add(1).days();
                        console.log(slideEnd.compareTo(slideStart));
                        if(slideEnd.compareTo(slideStart)<0){
                            var temp=slideStart;
                            slideStart=slideEnd;
                            slideEnd=temp;
                        }
                        console.log("slideStart:"+slideStart.toString("yyyy-MM-dd")+" -- " + slideEnd.toString("yyyy-MM-dd"));
                        scope.openNewBookingDialog(index, slideStart.toString("yyyy-MM-dd"), slideEnd.toString("yyyy-MM-dd"));
                        //scope.$apply();
                    }
                });
            }
        }
    })
    .directive('bookingResize', function (bookingHelper) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                var options = scope.$eval(attrs.bookingDrag);
                elm.resizable({
                    handles: "e,w",
                    grid: cellWidth,
                    stop: function () {
                        var block = jQuery(this);
                        var newStart = bookingHelper.gridCellToDate(block, scope);
                        var width = block.outerWidth();
                        var numberOfDays = Math.round(width / cellWidth);
                        console.log("numberOfDays:" + numberOfDays + ",bookingid:" + options.bookingid + ", newStart:" + newStart);
                        alert("Not implemented on the server yet!");
                    }
                });
            }
        };
    });