module.exports = (function () {
  var express = require("express");
  var router = express.Router();
  var errormessage = "";

  function geterrormessage(res, context, complete) {
    context.errormessage = errormessage;
    complete();
  }

  /* get people to populate in dropdown */
  function getMediPhar(res, mysql, context, complete) {
    mysql.pool.query(
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

  function getMedication(res, mysql, context, complete) {
    mysql.pool.query(
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

  /* get certificates to populate in dropdown */
  function getPharmacy(res, mysql, context, complete) {
    mysql.pool.query(
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

  /*Display all people. Requires web based javascript to delete users with AJAX*/

  router.get("/", function (req, res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = [
      "deletefunction.js",
      "filterpeople.js",
      "searchpeople.js",
    ];
    var mysql = req.app.get("mysql");
    //servePlanets(res,mysql,context,complete);
    getMediPhar(res, mysql, context, complete);
    getPharmacy(res, mysql, context, complete);
    getMedication(res, mysql, context, complete);
    geterrormessage(res, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 4) {
        res.render("mediphar", context);
      }
    }
  });

  /* Adds a person, redirects to the people page after adding */

  router.post("/", function (req, res) {
    console.log(req.body.medicationphar);
    console.log(req.body);
    var mysql = req.app.get("mysql");
    var sql =
      "INSERT INTO medication_pharmacy (medication_id,pharmacy_id) VALUES (?,?)";
    var inserts = [req.body.medication_id, req.body.pharmacy_id];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        errormessage =
          "Invalid Input! Please fill in all input fields, and please ensure that at least one of your inputs is different compared to the medication_id and pharmacy_id shown on the table below";
        res.redirect("/mediphar");
      } else {
        errormessage = "";
        res.redirect("/mediphar");
      }
    });
  });

  /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

  router.delete(
    "/medication_id/:medication_id/pharmacy_id/:pharmacy_id",
    function (req, res) {
      //console.log(req) //I used this to figure out where did pid and cid go in the request
      console.log(req.params.medication_id);
      console.log(req.params.pharmacy_id);
      var mysql = req.app.get("mysql");
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
