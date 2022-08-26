module.exports = (function () {
  // Declare Variables
  var express = require("express");
  var router = express.Router();
  var insert_error = "";
  var search_error = "";
  var update_error = "";

  // Function for creating error message for wrong input on INSERT
  function get_insert_error(res, context, complete) {
    context.insert_error = insert_error;
    complete();
  }

  // Function for creating error message for wrong input on SEARCH
  function get_search_error(res, context, complete) {
    context.search_error = search_error;
    complete();
  }

  // Function for creating error message for wrong input on UPDATE
  function get_update_error(res, context, complete) {
    context.update_error = update_error;
    complete();
  }

  /* Function used to implement SELECT for Medication entity
  (This function is used so that Medication ID can be shown in Diagnosis INSERT dropdown 
  menus as foreign key, as well as displaying Medication Name in Diagnosis Table as part of JOIN SELECT query.*/
  function getMedication(res, mysql, context, complete) {
    // SQL SELECT statement used to display the Medication entity correctly
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

  /* Function used to implement SELECT for Patient entity
  (This function is used so that Patient ID can be shown in Diagnosis INSERT dropdown 
  menus as foreign key, as well as displaying Patient Name in Diagnosis Table as part of JOIN SELECT query. */
  function getPatient(res, mysql, context, complete) {
    // SQL SELECT statement used to display the Patient entity correctly
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

  /* Function used to implement SELECT for Doctor entity
  (This function is used so that Doctor ID can be shown in Diagnosis INSERT dropdown 
  menus as foreign key, as well as displaying Doctor Name in Diagnosis Table as part of JOIN SELECT query. */
  function getDoctor(res, mysql, context, complete) {
    // SQL SELECT statement used to display the Doctor entity correctly
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

  /* Function used to implement SELECT for Pharmacy entity
  (This function is used so that Pharmacy ID can be shown in Diagnosis INSERT dropdown 
  menus as foreign key, as well as displaying Pharmacy Name in Diagnosis Table as part of JOIN SELECT query. */
  function getPharmacy(res, mysql, context, complete) {
    // SQL SELECT statement used to display the Pharmacy entity correctly
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

  // Function used to implement SELECT for Diagnosis entity
  function getDiagnosis(res, mysql, context, complete) {
    // SQL SELECT statement used to display the Diagnosis entity correctly
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

  // Function used for searching for a Diagnosis entry that matches the "Diagnosis Name" search query
  function getDiagnosisByName(req, res, mysql, context, complete) {
    // SQL query for search function. Sanitize the input as well as include the % character.
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

  // Function used to get a specific Diagnosis entry to show on the Update page
  function getDiagnosisEntry(res, mysql, context, id, complete) {
    // SQL query for selecting specific Diagnosis entry
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

  /* General route that shows all diagnosis entries, handles all Javascript functions and files
  used by the main diagnosis page */
  router.get("/", function (req, res) {
    var callbackCount = 0;
    var context = {};

    // Call delete, search JS files
    context.jsscripts = ["deletefunction.js", "searchfunction.js"];

    var mysql = req.app.get("mysql");

    // Call functions to display entity tables and error message on page
    getMedication(res, mysql, context, complete);
    getPatient(res, mysql, context, complete);
    getDoctor(res, mysql, context, complete);
    getPharmacy(res, mysql, context, complete);
    getDiagnosis(res, mysql, context, complete);
    get_insert_error(res, context, complete);
    get_search_error(res, context, complete);
    get_update_error(res, context, complete);

	// Make errors disappear on reload
	search_error = "";
	insert_error="";
	update_error="";

    // Render page
    function complete() {
      callbackCount++;
      if (callbackCount >= 8) {
        res.render("diagnosis", context);
      }
    }
  });

  // Route used to display every Diagnosis entry that matches the search term (Diagnosis Name)
  router.get("/search/:s", function (req, res) {
    var callbackCount = 0;
    var context = {};

    // Call Search and Delete Javascript files
    context.jsscripts = ["deletefunction.js", "searchfunction.js"];
    var mysql = req.app.get("mysql");
    search_error = "";

    // Call functions for showing entities and error messages on page
    getMedication(res, mysql, context, complete);
    getPatient(res, mysql, context, complete);
    getDoctor(res, mysql, context, complete);
    getPharmacy(res, mysql, context, complete);
    getDiagnosis(res, mysql, context, complete);
    getDiagnosisEntry(res, mysql, context, req.params.id, complete);
    get_update_error(res, context, complete);
    getDiagnosisByName(req, res, mysql, context, complete);

    // Render page
    function complete() {
      callbackCount++;
      if (callbackCount >= 8) {
        res.render("diagnosis", context);
      }
    }
  });

  // Route for showing a specific Diagnosis entry to update
  router.get("/:id", function (req, res) {
    callbackCount = 0;
    var context = {};

    // Call delete, search, update Javascript files
    context.jsscripts = [
      "deletefunction.js",
      "searchfunction.js",
      "updatefunction.js",
    ];

    var mysql = req.app.get("mysql");

    /* Display an error and refresh page if user tries to search without entering a search term.
	This prevents the user from accidentally navigating to a blank Update page from trying to search
	without entering a search term. */
    if (req.params.id === "search") {
      // Show error message if nothing is entered for search
      search_error = "Invalid Input, please enter a search term.";
      res.redirect("/diagnosis");
    } else {
      /* If there was no search error as described above, call functions for showing the entities and 
	  error messages on the page */
      getMedication(res, mysql, context, complete);
      getPatient(res, mysql, context, complete);
      getDoctor(res, mysql, context, complete);
      getPharmacy(res, mysql, context, complete);
      getDiagnosisEntry(res, mysql, context, req.params.id, complete);
      get_update_error(res, context, complete);
      search_error = "";

      // Render updated page
      function complete() {
        callbackCount++;
        if (callbackCount >= 6) {
          res.render("update-diagnosis", context);
		  update_error="";
        }
      }
    }
  });

  // Route used to insert new entries into Diagnosis entity
  router.post("/", function (req, res) {
    var mysql = req.app.get("mysql");

    // SQL query for inserting new entries
    var sql =
      "INSERT INTO diagnosis (diagnosis_name,medication_id,patient_id,doctor_id,pharmacy_id,charge,diagnosis_date) VALUES (?,?,?,?,?,?,?)";

    // Javascript objects used for insertion
    var inserts = [
      req.body.diagnosis_name,
      req.body.medication_id,
      req.body.patient_id,
      req.body.doctor_id,
      req.body.pharmacy_id,
      req.body.charge,
      req.body.diagnosis_date,
    ];

    // Variables used for validating if the "charge" attribute of Diagnosis is a number
    var chargecheck = Number(inserts[5]);
    var nancheck = isNaN(Number(inserts[5]));

    // Input validation for inserting into Diagnosis
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
      // Error message shown for errors on Insertion
      insert_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect("/diagnosis");
    } else {
      // If there are no errors, then leave error message blank and perform the insertion
      insert_error = "";
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        res.redirect("/diagnosis");
      });
    }
  });

  // Route used to update the Diagnosis entity
  router.put("/:id", function (req, res) {
    var mysql = req.app.get("mysql");

    // SQL query to update Diagnosis table
    var sql =
      "UPDATE diagnosis SET diagnosis_name=?, medication_id=?, patient_id=?, doctor_id=?, pharmacy_id=?, charge=?, diagnosis_date=? WHERE diagnosis_id = ?";

    // Javascript Objects used for Update
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

    // Variables for input validation of "charge" attribute of Diagnosis
    var chargecheck = Number(inserts[5]);
    var nancheck = isNaN(Number(inserts[5]));

    // Input validation for Updating Diagnosis
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
        // Error message that is displayed if wrong inputs are entered for Update
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect(req.get("/diagnosis"));
    } else {
      // Render the updated page if there are no input errors
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

  // Route to delete a diagnosis entity entry
  router.delete("/:id", function (req, res) {
    var mysql = req.app.get("mysql");

    // SQL query to delete the entry with the specified diagnosis_id
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
