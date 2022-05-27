module.exports = (function () {
  var express = require("express");
  var router = express.Router();
  var errormessage = "";
  var errormessage2 = "";
  var errormessage3 = "";

  var valid = 0;

  function geterrormessage(res, context, complete) {
    context.errormessage = errormessage;
    complete();
  }

  function geterrormessage2(res, context, complete) {
    context.errormessage2 = errormessage2;
    complete();
  }
  function geterrormessage3(res, context, complete) {
    context.errormessage3 = errormessage3;
    complete();
  }

  //$('header').append(template(person));
  //   router.get('/', servePlanets);
  /* get people to populate in dropdown */
  function getPeople(res, mysql, context, complete) {
    mysql.pool.query(
      "SELECT medication_id AS medication_id, medication_id,medication_name FROM medication",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.medication = results;
        complete();
      }
    );
  }

  function getPeople2(res, mysql, context, complete) {
    mysql.pool.query(
      "select patient_id, concat(patient_first_name,' ', patient_last_name) as patient_fullname, patient_birth, patient_address, patient_email, patient_contact from patient",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.patient = results;
        complete();
      }
    );
  }
  function getPeople3(res, mysql, context, complete) {
    mysql.pool.query(
      "SELECT doctor_id, concat(doctor_first_name,' ', doctor_last_name) as doctor_fullname, doctor_contact from doctor",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.doctor = results;
        complete();
      }
    );
  }

  function getPeople4(res, mysql, context, complete) {
    mysql.pool.query(
      "SELECT * from pharmacy",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.pharmacy = results;
        complete();
      }
    );
  }

  function getPeople5(res, mysql, context, complete) {
    mysql.pool.query(
      "SELECT diagnosis_id as id, diagnosis_name, medication_id, medication_name, patient_id, concat(patient_first_name,' ', patient_last_name) as patient_fullname, doctor_id, concat(doctor_first_name,' ', doctor_last_name) as doctor_fullname,pharmacy_id, pharmacy_name, cast((charge/1.00) as decimal(16,2)) as 'charge', left(cast(diagnosis_date as date), 10) as diagnosis_date from diagnosis join medication using (medication_id) join patient using (patient_id) join doctor using (doctor_id) join pharmacy using (pharmacy_id) order by diagnosis_id",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        console.log(fields);
        console.log("hi");
        context.diagnosis = results;
        complete();
      }
    );
  }

  /* get certificates to populate in dropdown */
  function getCertificates(res, mysql, context, complete) {
    mysql.pool.query(
      "SELECT pharmacy_id AS pharmacy_id, pharmacy_id FROM pharmacy",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.pharmacy2 = results;
        complete();
      }
    );
  }

  function getPlanets(res, mysql, context, complete) {
    mysql.pool.query(
      "SELECT planet_id as id, name FROM bsg_planets",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.planets = results;
        complete();
      }
    );
  }

  function getPeoplebyHomeworld(req, res, mysql, context, complete) {
    var query =
      "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.homeworld = ?";
    console.log(req.params);
    var inserts = [req.params.homeworld];
    mysql.pool.query(query, inserts, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.people = results;
      complete();
    });
  }

  /* Find people whose fname starts with a given string in the req */
  function getPeopleWithNameLike(req, res, mysql, context, complete) {
    //sanitize the input as well as include the % character
    var query =
      "SELECT diagnosis_id as id, diagnosis_name, medication_id, medication_name, patient_id, concat(patient_first_name,' ', patient_last_name) as patient_fullname, doctor_id, concat(doctor_first_name,' ', doctor_last_name) as doctor_fullname,pharmacy_id, pharmacy_name, cast((charge/1.00) as decimal(16,2)) as 'charge', left(cast(diagnosis_date as date), 10) as diagnosis_date from diagnosis join medication using (medication_id) join patient using (patient_id) join doctor using (doctor_id) join pharmacy using (pharmacy_id) WHERE diagnosis.diagnosis_name LIKE " +
      mysql.pool.escape(req.params.s + "%");
    console.log(query);

    mysql.pool.query(query, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.diagnosis = results;
      complete();
    });
  }

  function getPerson(res, mysql, context, id, complete) {
    var sql =
      "SELECT diagnosis_id as id, diagnosis_name, medication_id, medication_name, patient_id, concat(patient_first_name,' ', patient_last_name) as patient_fullname, doctor_id, concat(doctor_first_name,' ', doctor_last_name) as doctor_fullname,pharmacy_id, pharmacy_name, cast((charge/1.00) as decimal(16,2)) as 'charge', left(cast(diagnosis_date as date), 10) as diagnosis_date from diagnosis join medication using (medication_id) join patient using (patient_id) join doctor using (doctor_id) join pharmacy using (pharmacy_id) WHERE diagnosis_id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.diagnosis = results[0];
      complete();
    });
  }

  /*Display all people. Requires web based javascript to delete users with AJAX*/

  router.get("/", function (req, res) {
    // function servePlanets2(req, res){

    var callbackCount = 0;
    var context = {};
    context.jsscripts = [
      "deletefunction.js",
      "filterpeople.js",
      "searchfunction.js",
    ];
    var mysql = req.app.get("mysql");
    //servePlanets(res,mysql,context,complete);
    getPeople(res, mysql, context, complete);
    getPeople2(res, mysql, context, complete);
    getPeople3(res, mysql, context, complete);
    getPeople4(res, mysql, context, complete);
    getPeople5(res, mysql, context, complete);
    geterrormessage(res, context, complete);
    geterrormessage2(res, context, complete);
    geterrormessage3(res, context, complete);

    // getCertificates(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 8) {
        res.render("diagnosis", context);
      }
    }
  });

  //router.get('/',servePlanets2);
  //router.get('/',servePlanets);

  /*Display all people from a given homeworld. Requires web based javascript to delete users with AJAX*/
  router.get("/filter/:homeworld", function (req, res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = [
      "deletefunction.js",
      "filterpeople.js",
      "searchpeople.js",
    ];
    var mysql = req.app.get("mysql");
    getPeoplebyHomeworld(req, res, mysql, context, complete);
    getPlanets(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 2) {
        res.render("diagnosis", context);
      }
    }
  });

  /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
  router.get("/search/:s", function (req, res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = [
      "deletefunction.js",
      "filterpeople.js",
      "searchfunction.js",
    ];
    var mysql = req.app.get("mysql");
    errormessage2 = "";
    getPeople(res, mysql, context, complete);
    getPeople2(res, mysql, context, complete);
    getPeople3(res, mysql, context, complete);
    getPeople4(res, mysql, context, complete);
    getPeople5(res, mysql, context, complete);
    getPerson(res, mysql, context, req.params.id, complete);
    geterrormessage3(res, context, complete);
    getPeopleWithNameLike(req, res, mysql, context, complete);
    getPlanets(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 9) {
        res.render("diagnosis", context);
      }
    }
  });

  /* Display one person for the specific purpose of updating people */

  router.get("/:id", function (req, res) {
    callbackCount = 0;
    var context = {};
    context.jsscripts = [
      "deletefunction.js",
      "searchfunction.js",
      "updatefunction.js",
    ];
    var mysql = req.app.get("mysql");
    if (req.params.id === "search") {
      errormessage2 = "Invalid Input, please enter a search term.";
      res.redirect("/diagnosis");
    } else {
      getPlanets(res, mysql, context, complete);
      getPeople(res, mysql, context, complete);
      getPeople2(res, mysql, context, complete);
      getPeople3(res, mysql, context, complete);
      getPeople4(res, mysql, context, complete);
      getPeople5(res, mysql, context, complete);
      getPerson(res, mysql, context, req.params.id, complete);
      geterrormessage3(res, context, complete);
      errormessage2 = "";
      function complete() {
        callbackCount++;
        if (callbackCount >= 8) {
          res.render("update-diagnosis", context);
        }
      }
    }
  });

  /* Adds a person, redirects to the people page after adding */

  router.post("/", function (req, res) {
    console.log(req.body.medicationphar);
    console.log(req.body);
    var mysql = req.app.get("mysql");
    var sql =
      "INSERT INTO diagnosis (diagnosis_name,medication_id,patient_id,doctor_id,pharmacy_id,charge,diagnosis_date) VALUES (?,?,?,?,?,?,?)";
    var inserts = [
      req.body.diagnosis_name,
      req.body.medication_id,
      req.body.patient_id,
      req.body.doctor_id,
      req.body.pharmacy_id,
      req.body.charge,
      req.body.diagnosis_date,
    ];
    //console.log(inserts[5]);

    var chargecheck = Number(inserts[5]);
    var nancheck = isNaN(Number(inserts[5]));

    //var chargecheck2 =
    if (
      !inserts[6] === true ||
      chargecheck <= 0 ||
      nancheck === true ||
      !inserts[5] === true ||
      !inserts[0] === true ||
      inserts[5] < 0
    ) {
      errormessage =
        "Invalid Input. Make sure you entered a positive numerical value for Charge, that you have entered a Description, and that you entered a valid Date.";
      res.redirect("/diagnosis");
      //console.log(chargecheck);
      console.log("string ddetected");
    } else {
      errormessage = "";
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        //console.log("Hello world!");
        //console.log(inserts[5]);
        res.redirect("/diagnosis");
      });
    }
  });

  /* The URI that update data is sent to in order to update a person */

  router.put("/:id", function (req, res) {
    var mysql = req.app.get("mysql");

    console.log(req.body);
    console.log(req.params.id);
    var sql =
      "UPDATE diagnosis SET diagnosis_name=?, medication_id=?, patient_id=?, doctor_id=?, pharmacy_id=?, charge=?, diagnosis_date=? WHERE diagnosis_id = ?";
    var inserts = [
      req.body.diagnosis_name,
      req.body.medication_id,
      req.body.patient_id,
      req.body.doctor_id,
      req.body.pharmacy_id,
      req.body.charge,
      req.body.diagnosis_date,
      req.params.id,
    ];
    var chargecheck = Number(inserts[5]);
    var nancheck = isNaN(Number(inserts[5]));
    if (
      !inserts[6] === true ||
      chargecheck <= 0 ||
      nancheck === true ||
      !inserts[5] === true ||
      !inserts[0] === true ||
      inserts[5] < 0
    ) {
      errormessage3 =
        "Invalid Input. Make sure you entered a positive numerical value for Charge, that you have entered a Description, and that you entered a valid Date.";
      res.redirect(req.get("/diagnosis"));
      console.log(errormessage3);
    } else {
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
          console.log(error);
          res.write(JSON.stringify(error));
          res.end();
        } else {
          res.status(200);
          res.end();
        }
      });
    }
    console.log(sql);
    console.log("dadada");
  });

  /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

  router.delete("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    var sql = "DELETE FROM diagnosis where diagnosis_id = ?";
    var inserts = [req.params.id];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.write(JSON.stringify(error));
        res.status(400);
        res.end();
      } else {
        res.status(202).end();
      }
    });
  });

  return router;
})();
