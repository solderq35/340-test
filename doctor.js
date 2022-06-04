module.exports = (function () {
  // Declare Variables
  var express = require("express");
  var router = express.Router();
  var search_error = "";
  var insert_error = "";
  var update_error = "";

  // Function for creating error message for wrong input on INSERT
  function get_search_error(res, context, complete) {
    context.search_error = search_error;
    complete();
  }

  // Function for creating error message for wrong input on SEARCH
  function get_insert_error(res, context, complete) {
    context.insert_error = insert_error;
    complete();
  }

  // Function for creating error message for wrong input on UPDATE
  function get_update_error(res, context, complete) {
    context.update_error = update_error;
    complete();
  }

  // Function used to implement SELECT for Doctor entity
  function getDoctor(res, mysql, context, complete) {
    mysql.pool.query(
	
	  // SQL SELECT statement used to display the Doctor entity correctly
      "SELECT doctor_id as id, doctor_first_name, doctor_last_name, doctor_contact from doctor",
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

  // Function used for searching for a Doctor entry that matches the "Doctor Name" search query
  function getDoctorByName(req, res, mysql, context, complete) {
    
	// SQL query for search function. Sanitize the input as well as include the % character.
    var query =
      "SELECT doctor_id as id, doctor_first_name, doctor_last_name, doctor_contact from doctor WHERE doctor.doctor_first_name LIKE " +
      mysql.pool.escape(req.params.s + "%");
    console.log(query);

    mysql.pool.query(query, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.doctor = results;
      complete();
    });
  }

   // Function used to get a specific Doctor entry to show on the Update page
  function getDoctorEntry(res, mysql, context, id, complete) {
    
	// SQL query to select specific Doctor entry
	var sql =
      "SELECT doctor_id as id, doctor_first_name, doctor_last_name, doctor_contact FROM doctor WHERE doctor_id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.doctor = results[0];
      complete();
    });
  }

  /* General route that shows all doctor entries, handles all Javascript functions and files
  used by the main doctor page */
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
    getDoctor(res, mysql, context, complete);
    get_search_error(res, context, complete);
    get_insert_error(res, context, complete);
    get_update_error(res, context, complete);

    // Render page
    function complete() {
      callbackCount++;
      if (callbackCount >= 4) {
        res.render("doctor", context);
      }
    }
  });

  // Route used to display every Doctor entry that matches the search term (Doctor First Name)
  router.get("/search/:s", function (req, res) {
    var callbackCount = 0;
    var context = {};
	
	// Call Search and Delete Javascript files
    context.jsscripts = [
      "deletefunction.js",
      "searchfunction.js",
    ];
    var mysql = req.app.get("mysql");
    search_error = "";
	
	// Call function for showing Doctor Entity
    getDoctorByName(req, res, mysql, context, complete);
	
	// Render page
    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        res.render("doctor", context);
      }
    }
  });

  // Route for showing a specific Doctor entry to update
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
      res.redirect("/doctor");
    } else {
		
	   /* If there was no search error as described above, call functions for showing the entities and 
	  error messages on the page */
      getDoctorEntry(res, mysql, context, req.params.id, complete);
      get_update_error(res, context, complete);

      // Render updated page
      function complete() {
        callbackCount++;
        if (callbackCount >= 2) {
          res.render("update-doctor", context);
        }
      }
    }
  });

   // Route used to insert new entries into Doctor entity
  router.post("/", function (req, res) {
    var mysql = req.app.get("mysql");
	
	// SQL query for inserting new entries 
    var sql =
      "INSERT INTO doctor (doctor_first_name,doctor_last_name,doctor_contact) VALUES (?,?,?)";
    
	// Javascript objects used for insertion
	var inserts = [
      req.body.doctor_first_name,
      req.body.doctor_last_name,
      req.body.doctor_contact,
    ];
	
	// Variables used to validate an input only contains either numbers and hyphes or letters and hyphens
    let num_hyphen_check = /^[0-9\s\-]+$/;
    let letter_hyphen_check = /^[A-Za-z\s\-]+$/;
	
	// Input validation for inserting into Doctor
    if (
      !inserts[0] === true ||
      !inserts[1] === true ||
      inserts[2] === true ||
      num_hyphen_check.test(inserts[2]) == false ||
      letter_hyphen_check.test(inserts[0]) == false ||
      letter_hyphen_check.test(inserts[1]) == false
    ) {
		
	  // Error message shown for errors on Insertion
      insert_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect("/doctor");
    } else {
		
	  // If there are no errors, then leave error message blank and perform the insertion
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        insert_error = "";
        res.redirect("/doctor");
      });
    }
  });

  // Route used to update the Doctor entity
  router.put("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
   
   // SQL query to update Doctor table
   var sql =
      "UPDATE doctor SET doctor_first_name=?, doctor_last_name=?, doctor_contact=? WHERE doctor_id = ?";
    
	// Javascript Objects used for Update
	var inserts = [
      req.body.doctor_first_name,
      req.body.doctor_last_name,
      req.body.doctor_contact,
      req.params.id,
    ];
	
	// Variables used to validate an input only contains either numbers and hyphes or letters and hyphens
    let num_hyphen_check = /^[0-9\s\-]+$/;
    let letter_hyphen_check = /^[A-Za-z\s\-]+$/;
	
	// Input validation for updating Doctor
    if (
      !inserts[0] === true ||
      !inserts[1] === true ||
      !inserts[2] === true ||
      num_hyphen_check.test(inserts[2]) == false ||
      letter_hyphen_check.test(inserts[0]) == false ||
      letter_hyphen_check.test(inserts[1]) == false
    ) {
		
      // Error message that is displayed if wrong inputs are entered for Update
      update_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect(req.get("/doctor"));
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

  // Route to delete a doctor entity entry
  router.delete("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
	
	// SQL query to delete the entry with the specified doctor_id
    var sql = "DELETE FROM doctor WHERE doctor_id = ?";
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
