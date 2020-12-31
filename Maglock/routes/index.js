var express = require('express');
var router = express.Router();

var socket = require('socket.io-client')('http://localhost:3001');

let dotenv = require('dotenv');
let request = require('request')
const cors = require('cors')
const app = express ();
dotenv.config();
app.use(cors())
var apikey = process.env.apikey;
var apisecret = process.env.apisecret; 
var Host = process.env.HOSTNAME;

let UUID;
let qr;
let Loginaddress;
let signed;
let success;

const SerialPort = require('serialport')
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

/* GET home page. */
router.get('/', function(req, res, next) {
/*   var hello = "hello"
  socket.emit('test', hello) */
  res.render('index', { title: 'Xumm Door Entry' });
});

router.get('/pay', function(req, res, next) {

async function XummSign(){
  const value = "20" 
  var options = {
    method: 'POST',
    url: 'https://xumm.app/api/v1/platform/payload',
    headers: {
    'content-type': 'application/json',
    'x-api-key': apikey,
    'x-api-secret': apisecret,
    authorization: 'Bearer' + apisecret
    },
    body: {
      "options": {
        "submit": true,
        "return_url": {
          "web": "",
          "app": ""
            }    
          },
        "txjson": {
          "TransactionType": "Payment",
          "Destination": "r9s6TQwdnynumSAvCXMctnDUzeYrKH8825", 
          "Amount": value,
          "Fee": "12"
        }
        
      },
    json: true,
    jar: 'JAR'
  };

  request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    
    UUID = body.uuid;
    qr = body.refs.qr_png;
   // next = body.next.always
    module.exports.UUID = body.uuid;
    module.exports.qr = body.refs.qr_png;
   // module.exports.next = body.next.always;
    
    //console.log(body);
    
    console.log('\x1b[34m%s\x1b[0m',"QRcode URL: " + qr);
    console.log('\x1b[34m%s\x1b[0m',"UUID: " + UUID);
});
}

XummSign()
setTimeout(PaymentStatus, 25000)

async function PaymentStatus(){
	
	await UUID
	var data = String(UUID);
	
	var options = {
			  method: 'GET',
			  url: 'https://xumm.app/api/v1/platform/payload/' + data,
			  headers: {
				    'x-api-key': apikey,
				    'x-api-secret': apisecret,
				    'content-type': 'application/json'
				  },
				};
			request(options, function (error, response, body) {
			  if (error) throw new Error(error);

			var jsonBody = JSON.parse(body)
      success = jsonBody.meta.signed;
      module.exports.success = jsonBody.meta.resolved;
			if(success === true){
        console.log("Successful Payment")
        console.log("Now to release the door")
       // .write("w");
        sPort.write("o");
        console.log("Door Released");
        setTimeout(close, 10000)
        
      } else {

        console.log("Payment Error")

      }
			});
}
 res.render('pay', { title: 'pay' });
});


var home = '/index.ejs';
function close(req, res, next){
  sPort.write("f")
  console.log("Door Closed")
  var nul = null
  module.exports.success = nul;
  //req.redirect(home)
}
module.exports = router;
