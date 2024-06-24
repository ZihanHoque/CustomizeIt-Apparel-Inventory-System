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
var uri = `mongodb+srv://${DBusername}:${DBpass}@customizeit.z3n8gu5.mongodb.net/Inventory?retryWrites=true&w=majority&appName=CustomizeIt`;

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
  res.render("locationSelect", {data : cursor});
});

app.post("/addLocation", (req, res) => {
  addLocation(req.body);
  events.once("location-add-complete", () => {
    res.send(message);
    message = "";
  })
});

app.post("/deleteLocation", (req, res) => {
  deleteLocation(req.body);
  events.once("location-delete-complete", () => {
    res.send(message);
    message = "";
  });
});

app.post("/selectLocation", (req, res) => {
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
  cursor.apparel.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
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

app.post("/apparel/delete", (req, res) => {
  apparelDelete(req);
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

app.post("/apparel/create", (req, res) => {
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
  } catch (err) {
    console.error(err);
  }

  await mongoose.connection.close();
}

async function addLocation(locName) {
  await mongoose.connect(uri);

  try {
    var newLoc = new Location({locationName : locName});
    await newLoc.save();
    message = "success";
    events.emit("location-add-complete");
  } catch (err) {
    message = err;
    events.emit("location-add-complete");
  }

  await mongoose.connection.close();
}

async function deleteLocation(locName) {
  await mongoose.connect(uri);
  
  try {
    await Location.findOneAndDelete({locationName : locName}).exec();
    message = "success";
    events.emit("location-delete-complete")
  } catch (err) {
    message = err;
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
    message = err;
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
    message = err;
    events.emit("colour-deletion-complete");
  }

  await mongoose.connection.close();
}

async function apparelDelete(req) {
  await mongoose.connect(uri);

  try {
    cursor.apparel.splice(cursor.apparel.findIndex((apparel) => apparel.apparelName == req.body), 1);
    await cursor.save();
  } catch (err) {
    message = err;
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
    events.emit("apparel-deletion-complete");
  } catch (err) {
    message = err;
    events.emit("apparel-deletion-complete");
  }
  
  await mongoose.connection.close();
}

async function createApparel(req) {
  await mongoose.connect(uri);

  try {
    cursor.apparel.push(req.body);
    await cursor.save();
    message = "success";
    events.emit("apparel-creation-complete");
  } catch (err) {
    message = err;
    events.emit("apparel-creation-complete");
  }

  await mongoose.connection.close();
}