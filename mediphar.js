module.exports = (function () {
  // Declare Variables
  var express = require("express");
  var router = express.Router();
  var insert_error = "";

  // Function for creating error message for wrong input on INSERT
  function get_insert_error(res, context, complete) {
    context.insert_error = insert_error;
    complete();
  }

  // Function used to implement SELECT for MediPhar entity
  function getMediPhar(res, mysql, context, complete) {
    mysql.pool.query(
      // SQL SELECT statement used to display the MediPhar entity correctly
      "SELECT medication_id AS medication_id, medication_id, medication_name FROM medication",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.medication2 = results;
        complete();
      }
    );
  }

  /* Function used to implement SELECT for Medication entity
  (This function is used so that Medication ID can be shown in MediPhar INSERT dropdown 
  menus as foreign key, as well as displaying Medication Name in MediPhar Table as part of JOIN SELECT query.*/
  function getMedication(res, mysql, context, complete) {
    mysql.pool.query(
      // SQL SELECT statement used to display the Medication entity correctly
      "SELECT medication_id, medication_name, pharmacy_id, pharmacy_name from medication_pharmacy join medication using (medication_id) join pharmacy using (pharmacy_id)",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.mediphar = results;
        complete();
      }
    );
  }

  /* Function used to implement SELECT for Pharmacy entity
  (This function is used so that Pharmacy ID can be shown in MediPhar INSERT dropdown 
  menus as foreign key, as well as displaying Pharmacy Name in MediPhar Table as part of JOIN SELECT query. */
  function getPharmacy(res, mysql, context, complete) {
    mysql.pool.query(
      // SQL SELECT statement used to display the Pharmacy entity correctly
      "SELECT pharmacy_id AS pharmacy_id, pharmacy_id, pharmacy_name FROM pharmacy",
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

  /* General route that shows all MediPhar entries, handles all Javascript functions and files
  used by the main MediPhar page */
  router.get("/", function (req, res) {
    var callbackCount = 0;
    var context = {};

    // Call delete, search JS files
    context.jsscripts = ["deletefunction.js", "searchpeople.js"];
    var mysql = req.app.get("mysql");

    // Call functions to display entity tables and error message on page
    getMediPhar(res, mysql, context, complete);
    getPharmacy(res, mysql, context, complete);
    getMedication(res, mysql, context, complete);
    get_insert_error(res, context, complete);

    // Render page
    function complete() {
      callbackCount++;
      if (callbackCount >= 4) {
        res.render("mediphar", context);
      }
    }
  });

  // Route used to insert new entries into MediPhar entity
  router.post("/", function (req, res) {
    var mysql = req.app.get("mysql");

    // SQL query for inserting new entries
    var sql =
      "INSERT INTO medication_pharmacy (medication_id,pharmacy_id) VALUES (?,?)";

    // Javascript objects used for insertion
    var inserts = [req.body.medication_id, req.body.pharmacy_id];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      // Input validation for inserting into MediPhar
      if (error) {
        // Error message shown for errors on Insertion
        insert_error =
          "Invalid Input! Please fill in all input fields, and please ensure that at least one of your inputs is different compared to the medication_id and pharmacy_id shown on the table below";
        res.redirect("/mediphar");
      } else {
        // If there are no errors, then leave error message blank and perform the insertion
        insert_error = "";
        res.redirect("/mediphar");
      }
    });
  });

  // Route to delete a MediPhar entity entry
  router.delete(
    "/medication_id/:medication_id/pharmacy_id/:pharmacy_id",
    function (req, res) {
      var mysql = req.app.get("mysql");

      // SQL query to delete the entry with the specified medication_id and pharmacy_id
      var sql =
        "DELETE FROM medication_pharmacy WHERE medication_id = ? AND pharmacy_id = ?";
      var inserts = [req.params.medication_id, req.params.pharmacy_id];
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.status(400);
          res.end();
        } else {
          res.status(202).end();
        }
      });
    }
  );

  return router;
})();
