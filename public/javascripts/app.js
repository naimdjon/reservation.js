'use strict';

var cellWidth = 21;
var slideStarted = false; // indicates if the user started sliding in the timeline grid.
var slideCells = []; // the grid cells that have been marked with the slider.

var reservationApp=angular.module('reservationApp',
    [
        'ui.bootstrap',
        'reservationApp.services',
        'reservationApp.directives',
        'reservationApp.controllers'
    ]);
