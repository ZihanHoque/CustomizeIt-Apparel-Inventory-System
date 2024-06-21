// NODE.JS WEBSITE BACKEND
// HANDLES LITERALLY EVERYTHING

// importing some useful modules
var express = require("express"); // handles request/response cycles and routing
var http = require("http"); // server initializer
var path = require("path"); // filepathing tool
var multer = require("multer"); // parses all the formData sent in from the client side scripts
var mongoose = require("mongoose"); // nice little bridging API to go from mongoDB data to standard manipulatable javascript objects
var eventEmitter = require("node:events"); // the goblin workaround for asynchronous database functions

// instantiate a few modules
var events = new eventEmitter();
var formParser = multer();
var app = express();

// some express setup
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

// hard counters CTRL-SHIFT-I armchair hackers
const DBusername = process.env['MongoDB_Username'];
const DBpass = process.env['MongoDB_Password']

// initializing mongoDB
var uri = `mongodb+srv://${DBusername}:${DBpass}@itemdata.11hpdle.mongodb.net/ExampleData?retryWrites=true&w=majority&appName=ItemData`;
var ItemSchema = new mongoose.Schema({
  _id : String,
  Name : String,
  Links : [String],
  Description : String,
  Comments : [String],
  LastPurchased : Date,
  InCart : {type : Boolean, default : false},
  ImageDataURL : String
}, {autoCreate : false, autoIndex : false});

var UserSchema = new mongoose.Schema({
  Username : {type : String, unique : true},
  Password : String,
  Items : [ItemSchema]
});

// mongoose takes the mongoDB document schema i set earlier and turns it into a class i can instantiate and use
var Item = mongoose.model("Item", ItemSchema);
var User = mongoose.model("User", UserSchema);

// a few globals because cross url communication makes me >:( 
var message; 
var sessionUser;

// locally hosting for now
http.createServer(app).listen(3000);

