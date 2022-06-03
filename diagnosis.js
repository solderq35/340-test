module.exports = (function () {
  var express = require("express");
  var router = express.Router();
  var insert_error = "";
  var search_error = "";
  var update_error = "";
  var valid = 0;

  function get_insert_error(res, context, complete) {
    context.insert_error = insert_error;
    complete();
  }

  function get_search_error(res, context, complete) {
    context.search_error = search_error;
    complete();
  }
  function get_update_error(res, context, complete) {
    context.update_error = update_error;
    complete();
  }

  function getMedication(res, mysql, context, complete) {
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

  function getPatient(res, mysql, context, complete) {
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
  function getDoctor(res, mysql, context, complete) {
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

  function getPharmacy(res, mysql, context, complete) {
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

  function getDiagnosis(res, mysql, context, complete) {
    mysql.pool.query(
      "SELECT diagnosis_id as id, diagnosis_name, medication_id, medication_name, patient_id, concat(patient_first_name,' ', patient_last_name) as patient_fullname, doctor_id, concat(doctor_first_name,' ', doctor_last_name) as doctor_fullname,pharmacy_id, pharmacy_name, cast((charge/1.00) as decimal(16,2)) as 'charge', left(cast(diagnosis_date as date), 10) as diagnosis_date from diagnosis join medication using (medication_id) join patient using (patient_id) join doctor using (doctor_id) join pharmacy using (pharmacy_id) order by diagnosis_id",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }

        context.diagnosis = results;
        complete();
      }
    );
  }

  /* Find people whose fname starts with a given string in the req */
  function getDiagnosisByName(req, res, mysql, context, complete) {
    //sanitize the input as well as include the % character
    var query =
      "SELECT diagnosis_id as id, diagnosis_name, medication_id, medication_name, patient_id, concat(patient_first_name,' ', patient_last_name) as patient_fullname, doctor_id, concat(doctor_first_name,' ', doctor_last_name) as doctor_fullname,pharmacy_id, pharmacy_name, cast((charge/1.00) as decimal(16,2)) as 'charge', left(cast(diagnosis_date as date), 10) as diagnosis_date from diagnosis join medication using (medication_id) join patient using (patient_id) join doctor using (doctor_id) join pharmacy using (pharmacy_id) WHERE diagnosis.diagnosis_name LIKE " +
      mysql.pool.escape(req.params.s + "%");

    mysql.pool.query(query, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.diagnosis = results;
      complete();
    });
  }

  function getDiagnosisEntry(res, mysql, context, id, complete) {
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
    getMedication(res, mysql, context, complete);
    getPatient(res, mysql, context, complete);
    getDoctor(res, mysql, context, complete);
    getPharmacy(res, mysql, context, complete);
    getDiagnosis(res, mysql, context, complete);
    get_insert_error(res, context, complete);
    get_search_error(res, context, complete);
    get_update_error(res, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 8) {
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
    search_error = "";
    getMedication(res, mysql, context, complete);
    getPatient(res, mysql, context, complete);
    getDoctor(res, mysql, context, complete);
    getPharmacy(res, mysql, context, complete);
    getDiagnosis(res, mysql, context, complete);
    getDiagnosisEntry(res, mysql, context, req.params.id, complete);
    get_update_error(res, context, complete);
    getDiagnosisByName(req, res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 8) {
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
      search_error = "Invalid Input, please enter a search term.";
      res.redirect("/diagnosis");
    } else {
      getMedication(res, mysql, context, complete);
      getPatient(res, mysql, context, complete);
      getDoctor(res, mysql, context, complete);
      getPharmacy(res, mysql, context, complete);
      getDiagnosisEntry(res, mysql, context, req.params.id, complete);
      get_update_error(res, context, complete);
      search_error = "";
      function complete() {
        callbackCount++;
        if (callbackCount >= 6) {
          res.render("update-diagnosis", context);
        }
      }
    }
  });

  /* Adds a person, redirects to the people page after adding */

  router.post("/", function (req, res) {
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

    var chargecheck = Number(inserts[5]);
    var nancheck = isNaN(Number(inserts[5]));

    if (
      !inserts[0] === true ||
      !inserts[1] === true ||
      !inserts[2] === true ||
      !inserts[3] === true ||
      !inserts[4] === true ||
      !inserts[5] === true ||
      !inserts[6] === true ||
      chargecheck <= 0 ||
      nancheck === true ||
      inserts[5] < 0
    ) {
      insert_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect("/diagnosis");
    } else {
      insert_error = "";
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        res.redirect("/diagnosis");
      });
    }
  });

  /* The URI that update data is sent to in order to update a person */

  router.put("/:id", function (req, res) {
    var mysql = req.app.get("mysql");

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
      !inserts[0] === true ||
      !inserts[1] === true ||
      !inserts[2] === true ||
      !inserts[3] === true ||
      !inserts[4] === true ||
      !inserts[5] === true ||
      !inserts[6] === true ||
      chargecheck <= 0 ||
      nancheck === true ||
      inserts[5] < 0
    ) {
      update_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect(req.get("/diagnosis"));
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
