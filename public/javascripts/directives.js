'use strict';

var directives=angular.module('reservationApp.directives', []);

directives.directive('reservationDrag', function (reservationService) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            var options = scope.$eval(attrs.reservationDrag);
            elm.draggable({
                axis: "x",
                grid: [cellWidth, cellWidth],
                start: function () {
                    var x = jQuery(this);
                    x.zIndex(x.zIndex() + 1);
                },
                stop: function () {
                    var block = jQuery(this);
                    var newStart = reservationService.gridCellToStartDate(block, scope);
                    var diff = options.diff;
                    var newEnd = newStart.clone().add(parseInt(diff)).days();
                    block.zIndex(block.zIndex() - 1);
                    //console.log("newEnd:"+newEnd+",diff:"+diff);
                    //console.log("diff:"+diff+"resid:" + options.  +",resourceId:"+options.resourceId+ ", newStart:" + newStart);
                    reservationService.reservationDrag(options.reservationId,options.resourceId,newStart,newEnd)
                        .then(function(result){
                            console.log("stoppped!");
                    });

                }
            });
        }
    };
})
    .directive('reservationSlideNew', function (reservationService,$modal) {
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
                        slideStart  = reservationService.gridCellToStartDate(gridCell, scope);
                    }
                });
                e.bind('mouseup', function (event) {
                    if (slideStarted) {
                        slideStarted = false;
                        for (var i = 0; i < slideCells.length; i++)
                            slideCells[i].removeClass("selectClass");
                        var slideEnd = reservationService.gridCellToStartDate(jQuery(this), scope);
                        if(slideStart.equals(slideEnd))
                            slideEnd.add(1).days();
                        if(slideEnd.compareTo(slideStart)<0){
                            var temp=slideStart;
                            slideStart=slideEnd;
                            slideEnd=temp;
                        }
                        scope.openNewReservationDialog(index, slideStart.toString("yyyy-MM-dd"), slideEnd.toString("yyyy-MM-dd"),scope,$modal);
                    }
                });
            }
        }
    })
    .directive('reservationResize', function (reservationService) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                var options = scope.$eval(attrs.reservationResize);
                //console.dir(options);
                elm.resizable({
                    handles: "e,w",
                    grid: cellWidth,
                    stop: function (e,ui) {
                        var newDays=ui.size.width/cellWidth;
                        var block = jQuery(this);
                        var newStart = reservationService.gridCellToStartDate(block, scope);
                        var newEnd = newStart.clone().add(newDays).days();//reservationService.gridCellToEndDate(block, scope);
                        var width = block.outerWidth();
                        var numberOfDays = Math.round(width / cellWidth);
                        reservationService.reservationResize(options.reservationId,options.resourceId,newStart,newEnd)
                            .then(function(result){
                                console.log("resized:"+result);
                        });
                    }
                });
            }
        };
    });