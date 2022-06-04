module.exports = (function () {
  // Declare Variables
  var express = require("express");
  var router = express.Router();
  var insert_error = "";
  var update_error = "";
  var search_error = "";
  
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

  // Function for creating error message for wrong input on SEARCH
  function get_search_error(res, context, complete) {
    context.search_error = search_error;
    complete();
  }

  // Function used to implement SELECT for Medication entity
  function getMedication(res, mysql, context, complete) {
    mysql.pool.query(
	
	  // SQL SELECT statement used to display the Medication entity correctly
      "SELECT medication_id as id, medication_name, manufacturer FROM medication",
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

  // Function used for searching for a Medication entry that matches the "Medication Name" search query
  function getMedicationByName(req, res, mysql, context, complete) {
    
	// SQL query for search function. Sanitize the input as well as include the % character.
    var query =
      "SELECT medication_id as id, medication_name, manufacturer FROM medication WHERE medication.medication_name LIKE " +
      mysql.pool.escape(req.params.s + "%");
    mysql.pool.query(query, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.medication = results;
      complete();
    });
  }

  // Function used to get a specific Medication entry to show on the Update page
  function getMedicationEntry(res, mysql, context, id, complete) {
   
    // SQL query to select specific Medication Entry
    var sql =
      "select medication_id as id, medication_name, manufacturer FROM medication WHERE medication_id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.medication = results[0];
      complete();
    });
  }

  /* General route that shows all medication entries, handles all Javascript functions and files
  used by the main medication page */
  router.get("/", function (req, res) {
    var callbackCount = 0;
	
	// Call delete, search, update JS files
    var context = {};
    context.jsscripts = [
      "deletefunction.js",
      "filterpeople.js",
      "searchfunction.js",
    ];
    var mysql = req.app.get("mysql");

    // Call functions to display entity tables and error message on page
    getMedication(res, mysql, context, complete);
    get_insert_error(res, context, complete);
    get_update_error(res, context, complete);
    get_search_error(res, context, complete);
	
	 // Render page
    function complete() {
      callbackCount++;
      if (callbackCount >= 4) {
        res.render("medication", context);
      }
    }
  });

  // Route used to display every Medication entry that matches the search term (Medication Name)
  router.get("/search/:s", function (req, res) {
    var callbackCount = 0;
    var context = {};
	
	// Call Search, Update, Delete Javascript files
    context.jsscripts = [
      "deletefunction.js",
      "searchfunction.js",
      "updatefunction.js",
    ];
    var mysql = req.app.get("mysql");
    search_error = "";
	
	// Call function for showing Medication Entity
    getMedicationByName(req, res, mysql, context, complete);
    
	// Render page
	function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        res.render("medication", context);
      }
    }
  });

  // Route for showing a specific Medication entry to update
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
    if (req.params.id === "search") {
		
	  // Show error message if nothing is entered for search
      search_error = "Invalid Input, please enter a search term.";
      res.redirect("/medication");
    } else {
		
	  /* If there was no search error as described above, call functions for showing the entities and 
	  error messages on the page */
      get_update_error(res, context, complete);
      get_search_error(res, context, complete);
      getMedicationEntry(res, mysql, context, req.params.id, complete);
      
	  // Render updated page
	  function complete() {
        callbackCount++;
        if (callbackCount >= 3) {
          res.render("update-medication", context);
        }
      }
    }
  });

  // Route used to insert new entries into Medication entity
  router.post("/", function (req, res) {
    var mysql = req.app.get("mysql");
    
	// SQL query for inserting new entries 
	var sql =
      "INSERT INTO medication (medication_name,manufacturer) VALUES (?,?)";
    
	// Javascript objects used for insertion
	var inserts = [req.body.medication_name, req.body.manufacturer];
    
	// Variables used to validate an input only contains either numbers and hyphens or letters and hyphens
	let num_hyphen_check = /^[0-9\s\-]+$/;
    let letter_hyphen_check = /^[A-Za-z\s\&\-]+$/;
    
	// Input validation for inserting into Medication
	if (
      !inserts[0] === true ||
      !inserts[1] === true ||
      letter_hyphen_check.test(inserts[0]) == false ||
      letter_hyphen_check.test(inserts[1]) == false
    ) {
		
	  // Error message shown for errors on Insertion
      insert_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect("/medication");
    } else {
		
	  // If there are no errors, then leave error message blank and perform the insertion
      insert_error = "";
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        res.redirect("/medication");
      });
    }
  });
  
  // Route used to update the Medication entity
  router.put("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
	
	// SQL query to update Medication table
    var sql =
      "UPDATE medication SET medication_name=?, manufacturer=? WHERE medication_id = ?";
	  
	// Javascript Objects used for Update
    var inserts = [
      req.body.medication_name,
      req.body.manufacturer,
      req.params.id,
    ];
	
	// Variables used to validate an input only contains either numbers and hyphens or letters and hyphens
    let num_hyphen_check = /^[0-9\s\-]+$/;
    let letter_hyphen_check = /^[A-Za-z\s\&\-\.]+$/;
	
	// Input validation for updating Medication
    if (
      !inserts[0] === true ||
      !inserts[1] === true ||
      letter_hyphen_check.test(inserts[0]) == false ||
      letter_hyphen_check.test(inserts[1]) == false
    ) {
		
	  // Error message that is displayed if wrong inputs are entered for Update
      update_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect(req.get("/medication"));
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


  // Route to delete a Medication entity entry
  router.delete("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
	
	// SQL query to delete the entry with the specified medication_id
    var sql = "DELETE FROM medication WHERE medication_id = ?";
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
