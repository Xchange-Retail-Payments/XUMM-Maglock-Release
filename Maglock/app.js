var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const server = require('http').Server(app);
server.listen(3001);
const io = require('socket.io')(server);
app.io = io;

var get = require('./routes/index.js');

let qr = 0;
let success = 0;

io.on('connection', socket => {
  console.log('a user connected')

  async function QR(){
		qr = get.qr;
	
		await qr
	 socket.emit('qr', qr);
	
	//console.log('\x1b[34m%s\x1b[0m',"QRCode Sent: " + qr)
}
  setInterval(QR, 1000)
  
  async function suc(){
		success = get.success;
		await success
	 socket.emit('success', success);
	
	//console.log('\x1b[34m%s\x1b[0m',"QRCode Sent: " + qr)
}
	setInterval(suc, 1000)
	
})

/* const SerialPort = require('serialport')
const sp_readline = SerialPort.parsers.Readline // we use readline parser

const sPort = new SerialPort('/dev/cu.usbmodem14201', { baudRate: 115200 });
const parser = sPort.pipe(new sp_readline({ delimiter: '\n' }));
// Read the port data
sPort.on("open", () => {
  console.log('serial port open');
});
parser.on('data', data =>{
  let lastValue 
      // we use additional variable to avoid constant 
      // sending data to connected socket
      if (lastValue !== data) {
        console.log(Buffer.from(data).toString())
      }
      lastValue = data
      //console.log(lastValue)
  
 // socket.emit('data', data)
});
 */
/* sPort.write('hello from node\n', (err) => {
  if (err) {
    return console.log('Error on write: ', err.message);
  }
  console.log('message written');
}); */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
