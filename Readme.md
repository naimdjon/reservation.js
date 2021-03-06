Reservation.js
----------------------
Reservation.js is a reservation system written entirely in Javascript. The front-end is written in AngularJS while for the backend it makes use of node.js and mongodb.

Demo
----
The demo of the application can be accessed here: http://reservation-js.herokuapp.com/



Dependencies
----
    express
    moment
    mongodb
    stylus
    nconf

    npm install express moment mongodb nconf stylus ejs

<!--express --sessions --css stylus --ejs reservation.js-->
<!--
fix the everyauth bug:
https://github.com/cbou/mongoose-auth/commit/43a5e3781d56b75fee26a5b8582b285db007f000
https://github.com/cbou/mongoose-auth/commit/edc2bd2a59b6d392e86b18dddd197d93e7538a26
change approval_prompt to auto in node_modules/everyauth/lib/modules/google.js
, approval_prompt: 'auto'
-->

License
-------
The reservation.js may be used free of charge under the conditions
of the following license:

The MIT License

Copyright (c) 2013 Naimdjon Takhirov - naimdjon@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
