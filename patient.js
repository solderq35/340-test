module.exports = (function () {
  // Declare Variables
  var express = require("express");
  var router = express.Router();
  var search_error = "";
  var insert_error = "";
  var update_error = "";
  
  // Function for creating error message for wrong input on SEARCH
  function get_search_error(res, context, complete) {
    context.search_error = search_error;
    complete();
  }

  // Function for creating error message for wrong input on INSERT
  function get_insert_error(res, context, complete) {
    context.insert_error = insert_error;
    complete();
  }

  // Function for creating error message for wrong input on UPDATE
  function get_update_error(res, context, complete) {
    context.update_error = update_error;
    complete();
  }

  // Function used to implement SELECT for Patient entity
  function getPatient(res, mysql, context, complete) {
    mysql.pool.query(
	
	  // SQL SELECT statement used to display the Patient entity correctly
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

   // Function used for searching for a Patient entry that matches the "Patient Name" search query
  function getPatientByName(req, res, mysql, context, complete) {
  
    // SQL query for search function. Sanitize the input as well as include the % character.
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

  // Function used to get a specific Patient entry to show on the Update page
  function getPatientEntry(res, mysql, context, id, complete) {
    
	// SQL query to select specific Patient Entry
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

  /* General route that shows all Patient entries, handles all Javascript functions and files
  used by the main Patient page */
  router.get("/", function (req, res) {
    var callbackCount = 0;
	
	// Call delete, search, update JS files
    var context = {};
    context.jsscripts = [
      "deletefunction.js",
      "searchfunction.js",
      "updatefunction.js",
    ];
    var mysql = req.app.get("mysql");
	
	// Call functions to display entity tables and error message on page
    getPatient(res, mysql, context, complete);
    get_search_error(res, context, complete);
    get_insert_error(res, context, complete);

	// Make errors disappear on reload
	search_error = "";
	insert_error="";
	update_error="";

    // Render page
    function complete() {
      callbackCount++;
      if (callbackCount >= 3) {
        res.render("patient", context);
      }
    }
  });

  // Route used to display every Patient entry that matches the search term (Patient First Name)
  router.get("/search/:s", function (req, res) {
    var callbackCount = 0;
    var context = {};
	
	// Call Search, Delete Javascript files
    context.jsscripts = [
      "deletefunction.js",
      "searchfunction.js",
    ];
    var mysql = req.app.get("mysql");
    search_error = "";
	
	// Call function for showing Patient Entity
    getPatientByName(req, res, mysql, context, complete);
	
	// Render page
    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        res.render("patient", context);
      }
    }
  });

  // Route for showing a specific Patient entry to update
  router.get("/:id", function (req, res) {
    callbackCount = 0;
    var context = {};
	
	// Call delete, search, update Javascript files
    context.jsscripts = [
      "deletefunction.js",
      "searchfunction.js",
      "updatefunction.js",
    ];
	
	/* Display an error and refresh page if user tries to search without entering a search term.
	This prevents the user from accidentally navigating to a blank Update page from trying to search
	without entering a search term. */
    var mysql = req.app.get("mysql");
	
	// Show error message if nothing is entered for search
    if (req.params.id === "search") {
      search_error = "Invalid Input, please enter a search term.";
      res.redirect("/patient");
    } else {
		
	   /* If there was no search error as described above, call functions for showing the entities and 
	  error messages on the page */
      get_update_error(res, context, complete);
      getPatientEntry(res, mysql, context, req.params.id, complete);


      // Render updated page
      function complete() {
        callbackCount++;

        if (callbackCount >= 2) {
          res.render("update-patient", context);
		  update_error="";
        }
      }
    }
  });

  // Route used to insert new entries into Patient entity
  router.post("/", function (req, res) {
    var mysql = req.app.get("mysql");
    
	// SQL query for inserting new entries 
	var sql =
      "INSERT INTO patient (patient_first_name,patient_last_name,patient_birth,patient_address,patient_email,patient_contact) VALUES (?,?,?,?,?,?)";
    
	// Javascript objects used for insertion
	var inserts = [
      req.body.patient_first_name,
      req.body.patient_last_name,
      req.body.patient_birth,
      req.body.patient_address,
      req.body.patient_email,
      req.body.patient_contact,
    ];
	
	// Variables used to validate an input only contains either numbers and hyphens or letters and hyphens
    let num_hyphen_check = /^[0-9\s\-]+$/;
    let letter_hyphen_check = /^[A-Za-z\s\&\-\.]+$/;
	
	// Input validation for inserting into Patient
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
		
	  // Error message shown for errors on Insertion
      insert_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect("/patient");
    } else {
		
	  // If there are no errors, then leave error message blank and perform the insertion
      insert_error = "";
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        res.redirect("/patient");
      });
    }
  });

  // Route used to update the Patient entity
  router.put("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
	
	// SQL query to update Patient table
    var sql =
      "UPDATE patient SET patient_first_name=?, patient_last_name=?, patient_birth=?, patient_address=?, patient_email=?, patient_contact=? WHERE patient_id = ?";
    
	// Javascript Objects used for Update
	var inserts = [
      req.body.patient_first_name,
      req.body.patient_last_name,
      req.body.patient_birth,
      req.body.patient_address,
      req.body.patient_email,
      req.body.patient_contact,
      req.params.id,
    ];
	
	// Variables used to validate an input only contains either numbers and hyphens or letters and hyphens
    let num_hyphen_check = /^[0-9\s\-]+$/;
    let letter_hyphen_check = /^[A-Za-z\s\&\-\.]+$/;
	
	// Input validation for updating Patient
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
		
	  // Error message that is displayed if wrong inputs are entered for Update
      update_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect(req.get("/patient"));
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

  // Route to delete a Patient entity entry
  router.delete("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    
	// SQL query to delete the entry with the specified patient_id
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
