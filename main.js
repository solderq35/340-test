/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/

var express = require("express");
var mysql = require("./dbcon.js");
var bodyParser = require("body-parser");

var app = express();
var handlebars = require("express-handlebars").create({
  defaultLayout: "main",
  helpers: {
    decifix: function (numbah) {
      return numbah.toFixed(2);
    },
  },
});

app.engine("handlebars", handlebars.engine);
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static("public"));
app.set("view engine", "handlebars");
app.set("port", process.argv[2]);
app.set("mysql", mysql);
//app.use("/people_certs", require("./people_certs.js"));
//app.use("/people", require("./people.js"));
app.use("/pharmacy", require("./pharmacy.js"));
app.use("/doctor", require("./doctor.js"));
app.use("/medication", require("./medication.js"));
app.use("/patient", require("./patient.js"));
app.use("/diagnosis", require("./diagnosis.js"));
app.use("/mediphar", require("./mediphar.js"));
app.use("/", express.static("public"));

//app.use('/medication', require('./medication.js'));
//app.use('/patient', require('./patient.js'));
//app.use('/pharmacy', require('./pharmacy.js'));
//app.use('/diagnosis', require('./diagnosis.js'));
//app.use('/mediphar', require('./mediphar.js'));
//app.use('/mediphar3', require('./mediphar3.js'));
//app.use('/pharmacy-insert2', require('./pharmacy-insert2.js'));
//app.use('/doctor', require('./doctor.js'));

app.use(function (req, res) {
  res.status(404);
  res.render("404");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render("500");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started succesfully");
});
