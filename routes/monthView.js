exports.index = function(req, res){
  daysOfWeek=[];
  for (var i =0; i<7; i++) {
      daysOfWeek.push(moment().day(i+1).format('ddd'));
  }
  console.log(daysOfWeek);
  res.render('monthView', {
      title: 'Reservation.js, monthView',
      daysOfWeek:daysOfWeek//not used right now, since the view is rendered with angular.
  });
};



