// NODE.JS WEBSITE BACKEND
// HANDLES LITERALLY EVERYTHING

// importing some useful modules
var express = require("express"); // handles request/response cycles and routing
var http = require("http"); // server initializer
var path = require("path"); // filepathing tool
var multer = require("multer"); // parses all the formData sent in from the client side scripts
var mongoose = require("mongoose"); // nice little bridging API to go from mongoDB data to standard manipulatable javascript objects
var eventEmitter = require("node:events"); // the goblin workaround for asynchronous database functions
var bodyparser = require("body-parser");

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
var uri = `mongodb+srv://${DBusername}:${DBpass}@customizeit.z3n8gu5.mongodb.net/testData?retryWrites=true&w=majority&appName=CustomizeIt`;

var itemSchema = new mongoose.Schema({
  colour : String,
  sizes : {
    XXS : Number,
    XS : Number,
    S : Number,
    M : Number,
    L : Number,
    XL : Number,
    XXL : Number
  }
}, {autoCreate : false});

var apparelSchema = new mongoose.Schema({
  apparelName : String,
  code : String,
  lastModified : Date,
  items : [itemSchema]
}, {autoCreate : false});

var locationSchema = new mongoose.Schema({
  locationName : String,
  apparel : [apparelSchema]
});

// mongoose takes the mongoDB document schema i set earlier and turns it into a class i can instantiate and use
var Item = mongoose.model("Item", itemSchema);
var Apparel = mongoose.model("Apparel", apparelSchema);
var Location = mongoose.model("Location", locationSchema);

var cursor;
var message;

// locally hosting for now
http.createServer(app).listen(3000);

app.get("/", (req, res) => {
  loadLocations();
  events.once("location-load-complete", () => {
    if(message != "success") {
      console.error(message);
    } else {
      res.render("locationSelect", {data : cursor});
    }
    message = "";
  });
});

app.post("/addLocation", bodyparser.text(), (req, res) => {
  addLocation(req.body);
  events.once("location-add-complete", () => {
    res.send(message);
    message = "";
  })
});

app.post("/deleteLocation", bodyparser.text(), (req, res) => {
  deleteLocation(req.body);
  events.once("location-delete-complete", () => {
    res.send(message);
    message = "";
  });
});

app.post("/selectLocation", bodyparser.text(), (req, res) => {
  var check = cursor.find((location) => location.locationName == req.body);
  if (check) {
    message = "success";
    cursor = check;
  } else {
    message = "location not found";
  }
  res.send(message);
  message = "";
});

app.get("/apparelSearch", (req, res) => {
  res.render("apparelSearch", {data : cursor});
});

app.post("/loadCursor", (req, res) => {
  if (cursor.apparel.length > 1) {
    cursor.apparel.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }
  res.json(cursor);  
});

app.post("/apparel/addColour", formParser.none(), (req, res) => {
  addColour(req);
  events.once("colour-addition-complete", () => {
    res.send(message);
    message = "";
  })
});

app.post("/apparel/deleteColour", formParser.none(), (req, res) => {
  deleteColour(req);
  events.once("colour-deletion-complete", () => {
    res.send(message);
    message = "";
  })
});

app.post("/apparel/delete", bodyparser.text(), (req, res) => {
  apparelDelete(req.body);
  events.once("apparel-deletion-complete", () => {
    res.send(message);
    message = "";
  });
});

app.post("/apparel/update", formParser.none(), (req, res) => { 
  apparelUpdate(req);
  events.once("apparel-update-complete", () => {
    res.send(message);
    message = "";
  })
});

app.post("/apparel/create", bodyparser.text(), (req, res) => {
  createApparel(req);
  events.once("apparel-creation-complete", () => {
    res.send(message);
    message = "";
  });
});

async function loadLocations() {
  await mongoose.connect(uri);  

  try {
    cursor = await Location.find({}).exec();
    message = "success";
    events.emit("location-load-complete");
  } catch (err) {
    message = err;
    events.emit("location-load-complete");
  }

  await mongoose.connection.close();
}

async function addLocation(locName) {
  await mongoose.connect(uri);

  try {
    var newLoc = new Location({locationName : locName});
    cursor.push(newLoc);
    await newLoc.save();
    message = "success";
    events.emit("location-add-complete");
  } catch (err) {
    message = err.toString();
    events.emit("location-add-complete");
  }

  await mongoose.connection.close();
}

async function deleteLocation(locName) {
  await mongoose.connect(uri);
  
  try {
    await Location.findOneAndDelete({locationName : locName});
    cursor.splice(cursor.findIndex((location) => location.locationName == locName), 1);
    message = "success";
    events.emit("location-delete-complete")
  } catch (err) {
    message = err.toString();
    events.emit("location-delete-complete");
  }

  await mongoose.connection.close();
}

async function addColour(req) {
  await mongoose.connect(uri);

  try {
    cursor.apparel.find((apparel) => apparel.apparelName == req.body.name).items.push(new Item({colour : req.body.newColour}));
    cursor.apparel.find((apparel) => apparel.apparelName == req.body.name).lastModified = new Date();
    await cursor.save();
    message = "success";
    events.emit("colour-addition-complete");
  } catch (err) {
    message = err.toString();
    events.emit("colour-addition-complete");
  }

  await mongoose.connection.close();
}

async function deleteColour(req) {
  await mongoose.connect(uri);

  try {
    cursor.apparel.find((apparel) => apparel.apparelName == req.body.name).items.splice(cursor.apparel.find((apparel) => apparel.apparelName == req.body.name).items.findIndex((item) => item.colour == req.body.selectedColour), 1);
    cursor.apparel.find((apparel) => apparel.apparelName == req.body.name).lastModified = new Date();
    await cursor.save();
    message = "success";
    events.emit("colour-deletion-complete")
  } catch (err) {
    message = err.toString();
    events.emit("colour-deletion-complete");
  }

  await mongoose.connection.close();
}

async function apparelDelete(apparelName) {
  await mongoose.connect(uri);

  try {
    cursor.apparel.splice(cursor.apparel.findIndex((apparel) => apparel.apparelName == apparelName), 1);
    await cursor.save();
  } catch (err) {
    message = err.toString();
    events.emit("apparel-deletion-complete");
  }
  
  await mongoose.connection.close();
}

async function apparelUpdate(req) {
  await mongoose.connect(uri);

  try {
    cursor.apparel.find((apparel) => apparel.apparelName == req.body.name).items.splice(cursor.apparel.find((apparel) => apparel.apparelName == req.body.name).items.findIndex((item) => item.colour == req.body.selectedColour), 1, new Item({colour : req.body.selectedColour, sizes : {XXS : req.body.XXS, XS : req.body.XS, S : req.body.S, M : req.body.M, L : req.body.L, XL : req.body.XL, XXL : req.body.XXL}}));
    cursor.apparel.find((apparel) => apparel.apparelName == req.body.name).lastModified = new Date();
    await cursor.save();
    message = "success";
    events.emit("apparel-update-complete");
  } catch (err) {
    message = err.toString();
    events.emit("apparel-update-complete");
  }
  
  await mongoose.connection.close();
}

async function createApparel(req) {
  await mongoose.connect(uri);

  try {
    cursor.apparel.push(JSON.parse(req.body));
    await cursor.save();
    message = "success";
    events.emit("apparel-creation-complete");
  } catch (err) {
    message = err.toString();
    events.emit("apparel-creation-complete");
  }

  await mongoose.connection.close();
}

// bugfixing notes:

// implement duplicate prevention on location name, apparel name, and item colour
// swap children.find searching for something like for element of children
// or maybe something like let arr = [] arr.push(...element.children);