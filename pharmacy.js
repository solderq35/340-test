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


  // Function used to implement SELECT for Pharmacy entity
  function getPharmacy(res, mysql, context, complete) {
    mysql.pool.query(
	
	  // SQL SELECT statement used to display the Pharmacy entity correctly
      "select pharmacy_id as id, pharmacy_name, pharmacy_address, pharmacy_contact from pharmacy",
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

  // Function used for searching for a Pharmacy entry that matches the "Pharmacy Name" search query
  function getPharmacyByName(req, res, mysql, context, complete) {
    
	// SQL query for search function. Sanitize the input as well as include the % character.
    var query =
      "select pharmacy_id as id, pharmacy_name, pharmacy_address, pharmacy_contact from pharmacy WHERE pharmacy.pharmacy_name LIKE " +
      mysql.pool.escape(req.params.s + "%");

    mysql.pool.query(query, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.pharmacy = results;
      complete();
    });
  }

  // Function used to get a specific Pharmacy entry to show on the Update page
  function getPharmacyEntry(res, mysql, context, id, complete) {
    
	// SQL query to select specific Pharmacy Entry
	var sql =
      "select pharmacy_id as id, pharmacy_name, pharmacy_address, pharmacy_contact FROM pharmacy WHERE pharmacy_id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.pharmacy = results[0];
      complete();
    });
  }

  /* General route that shows all Pharmacy entries, handles all Javascript functions and files
  used by the main Pharmacy page */
  router.get("/", function (req, res) {
    var callbackCount = 0;
	
	// Call delete, search JS files
    var context = {};
    context.jsscripts = [
      "deletefunction.js",
      "searchfunction.js",
    ];
    var mysql = req.app.get("mysql");
	
	// Call functions to display entity tables and error message on page
    getPharmacy(res, mysql, context, complete);
    get_insert_error(res, context, complete);
    get_search_error(res, context, complete);
	
	// Make errors disappear on reload
	search_error = "";
	insert_error="";
	update_error="";
	
	// Render page
    function complete() {
      callbackCount++;
      if (callbackCount >= 3) {
        res.render("pharmacy", context);
      }
    }
  });

  // Route used to display every Pharmacy entry that matches the search term (Pharmacy Name)
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
	
	// Call function for showing Pharmacy Entity
    getPharmacyByName(req, res, mysql, context, complete);
	
	// Render page
    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        res.render("pharmacy", context);
      }
    }
  });

  // Route for showing a specific Pharmacy entry to update
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
      res.redirect("/pharmacy");
    } else {
	  
	   /* If there was no search error as described above, call functions for showing the entities and 
	  error messages on the page */
	  search_error = "";
      getPharmacyEntry(res, mysql, context, req.params.id, complete);
      get_update_error(res, context, complete);
	  
	  // Render updated page
      function complete() {
        callbackCount++;
        if (callbackCount >= 2) {
          res.render("update-pharmacy", context);
		  update_error="";
        }
      }
    }
  });

  // Route used to insert new entries into Pharmacy entity
  router.post("/", function (req, res) {
    var mysql = req.app.get("mysql");
	
	// SQL query for inserting new entries 
    var sql =
      "INSERT INTO pharmacy (pharmacy_name,pharmacy_address,pharmacy_contact) VALUES (?,?,?)";
    
	// Javascript objects used for insertion
	var inserts = [
      req.body.pharmacy_name,
      req.body.pharmacy_address,
      req.body.pharmacy_contact,
    ];
	
	// Variables used to validate an input only contains either numbers and hyphens or letters and hyphens
    let num_hyphen_check = /^[0-9\s\-]+$/;
    let letter_hyphen_check = /^[A-Za-z\s\&\-\.]+$/;
    
	// Input validation for inserting into Pharmacy
	if (
      !inserts[0] === true ||
      !inserts[1] === true ||
      !inserts[2] === true ||
      letter_hyphen_check.test(inserts[0]) == false ||
      num_hyphen_check.test(inserts[2]) == false
    ) {
		
	  // Error message shown for errors on Insertion
      insert_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect("/pharmacy");
    } else {
      insert_error = "";
	  
	  // If there are no errors, then leave error message blank and perform the insertion
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        res.redirect("/pharmacy");
      });
    }
  });

  // Route used to update the Pharmacy entity
  router.put("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    
	// SQL query to update Pharmacy table
	var sql =
      "UPDATE pharmacy SET pharmacy_name=?, pharmacy_address=?, pharmacy_contact=? WHERE pharmacy_id = ?";
    
	// Javascript Objects used for Update
	var inserts = [
      req.body.pharmacy_name,
      req.body.pharmacy_address,
      req.body.pharmacy_contact,
      req.params.id,
    ];
    
	// Variables used to validate an input only contains either numbers and hyphens or letters and hyphens
	let num_hyphen_check = /^[0-9\s\-]+$/;
    let letter_hyphen_check = /^[A-Za-z\s\&\-\.]+$/;
    
	// Input validation for updating Pharmacy
	if (
      !inserts[0] === true ||
      !inserts[1] === true ||
      !inserts[2] === true ||
      letter_hyphen_check.test(inserts[0]) == false ||
      num_hyphen_check.test(inserts[2]) == false
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

  // Route to delete a Pharmacy entity entry
  router.delete("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
	
	// SQL query to delete the entry with the specified pharmacy_id
    var sql = "DELETE FROM pharmacy WHERE pharmacy_id = ?";
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
