module.exports = (function () {
  var express = require("express");
  var router = express.Router();
  var search_error = "";
  var insert_error = "";
  var update_error = "";
  function get_search_error(res, context, complete) {
    context.search_error = search_error;
    complete();
  }

  function get_insert_error(res, context, complete) {
    context.insert_error = insert_error;
    complete();
  }

  function get_update_error(res, context, complete) {
    context.update_error = update_error;
    complete();
  }

  function getPatient(res, mysql, context, complete) {
    mysql.pool.query(
      "select patient_id as id, patient_first_name, patient_last_name, left(cast(patient_birth as date), 10) as patient_birth, patient_address, patient_email, patient_contact from patient",
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

  /* Find people whose fname starts with a given string in the req */
  function getPatientByName(req, res, mysql, context, complete) {
    //sanitize the input as well as include the % character
    var query =
      "select patient_id as id, patient_first_name, patient_last_name, left(cast(patient_birth as date), 10) as patient_birth, patient_address, patient_email, patient_contact from patient WHERE patient.patient_first_name LIKE " +
      mysql.pool.escape(req.params.s + "%");
    mysql.pool.query(query, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.patient = results;
      complete();
    });
  }

  function getPatientEntry(res, mysql, context, id, complete) {
    var sql =
      "select patient_id as id, patient_first_name, patient_last_name, left(cast(patient_birth as date), 10) as patient_birth, patient_address, patient_email, patient_contact FROM patient WHERE patient_id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.patient = results[0];
      complete();
    });
  }

  /*Display all people. Requires web based javascript to delete users with AJAX*/

  router.get("/", function (req, res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = [
      "deletefunction.js",
      "filterpeople.js",
      "searchfunction.js",
      "updatefunction.js",
    ];
    var mysql = req.app.get("mysql");
    getPatient(res, mysql, context, complete);
    get_search_error(res, context, complete);
    get_insert_error(res, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 3) {
        res.render("patient", context);
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
    getPatientByName(req, res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        res.render("patient", context);
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
      res.redirect("/patient");
    } else {
      get_update_error(res, context, complete);
      getPatientEntry(res, mysql, context, req.params.id, complete);

      function complete() {
        callbackCount++;

        if (callbackCount >= 2) {
          res.render("update-patient", context);
        }
      }
    }
  });

  /* Adds a person, redirects to the people page after adding */

  router.post("/", function (req, res) {
    var mysql = req.app.get("mysql");
    var sql =
      "INSERT INTO patient (patient_first_name,patient_last_name,patient_birth,patient_address,patient_email,patient_contact) VALUES (?,?,?,?,?,?)";
    var inserts = [
      req.body.patient_first_name,
      req.body.patient_last_name,
      req.body.patient_birth,
      req.body.patient_address,
      req.body.patient_email,
      req.body.patient_contact,
    ];
    let num_hyphen_check = /^[0-9\-]+$/;
    let letter_hyphen_check = /^[a-zA-Z\-]+$/;
    if (
      !inserts[0] === true ||
      !inserts[1] === true ||
      !inserts[2] === true ||
      !inserts[3] === true ||
      !inserts[4] === true ||
      !inserts[5] === true ||
      letter_hyphen_check.test(inserts[0]) == false ||
      letter_hyphen_check.test(inserts[1]) == false ||
      num_hyphen_check.test(inserts[5]) == false
    ) {
      insert_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect("/patient");
    } else {
      insert_error = "";
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        res.redirect("/patient");
      });
    }
  });

  /* The URI that update data is sent to in order to update a person */

  router.put("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    var sql =
      "UPDATE patient SET patient_first_name=?, patient_last_name=?, patient_birth=?, patient_address=?, patient_email=?, patient_contact=? WHERE patient_id = ?";
    var inserts = [
      req.body.patient_first_name,
      req.body.patient_last_name,
      req.body.patient_birth,
      req.body.patient_address,
      req.body.patient_email,
      req.body.patient_contact,
      req.params.id,
    ];
    let num_hyphen_check = /^[0-9\-]+$/;
    let letter_hyphen_check = /^[a-zA-Z\-]+$/;
    if (
      !inserts[0] === true ||
      !inserts[1] === true ||
      !inserts[2] === true ||
      !inserts[3] === true ||
      !inserts[4] === true ||
      !inserts[5] === true ||
      letter_hyphen_check.test(inserts[0]) == false ||
      letter_hyphen_check.test(inserts[1]) == false ||
      num_hyphen_check.test(inserts[5]) == false
    ) {
      update_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect(req.get("/patient"));
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
    var sql = "DELETE FROM patient WHERE patient_id = ?";
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
