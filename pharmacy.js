module.exports = (function () {
  var express = require("express");
  var router = express.Router();
  var insert_error = "";
  var search_error = "";
  var update_error = "";
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

  function getPharmacy(res, mysql, context, complete) {
    mysql.pool.query(
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

  /* Find people whose fname starts with a given string in the req */
  function getPharmacyByName(req, res, mysql, context, complete) {
    //sanitize the input as well as include the % character
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

  function getPharmacyEntry(res, mysql, context, id, complete) {
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

  /*Display all people. Requires web based javascript to delete users with AJAX*/

  router.get("/", function (req, res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = [
      "deletefunction.js",
      "filterpeople.js",
      "searchfunction.js",
    ];
    var mysql = req.app.get("mysql");
    getPharmacy(res, mysql, context, complete);
    get_insert_error(res, context, complete);
    get_search_error(res, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 3) {
        res.render("pharmacy", context);
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
      "updatefunction.js",
    ];
    var mysql = req.app.get("mysql");
    search_error = "";
    getPharmacyByName(req, res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        res.render("pharmacy", context);
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
      res.redirect("/pharmacy");
    } else {
      search_error = "";
      getPharmacyEntry(res, mysql, context, req.params.id, complete);
      get_update_error(res, context, complete);
      function complete() {
        callbackCount++;
        if (callbackCount >= 2) {
          res.render("update-pharmacy", context);
        }
      }
    }
  });

  /* Adds a person, redirects to the people page after adding */

  router.post("/", function (req, res) {
    var mysql = req.app.get("mysql");
    var sql =
      "INSERT INTO pharmacy (pharmacy_name,pharmacy_address,pharmacy_contact) VALUES (?,?,?)";
    var inserts = [
      req.body.pharmacy_name,
      req.body.pharmacy_address,
      req.body.pharmacy_contact,
    ];
    let num_hyphen_check = /^[0-9\-]+$/;
    let letter_hyphen_check = /^[a-zA-Z\-]+$/;
    if (
      !inserts[0] === true ||
      !inserts[1] === true ||
      !inserts[2] === true ||
      letter_hyphen_check.test(inserts[0]) == false ||
      num_hyphen_check.test(inserts[2]) == false
    ) {
      insert_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect("/pharmacy");
    } else {
      insert_error = "";
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        res.redirect("/pharmacy");
      });
    }
  });

  /* The URI that update data is sent to in order to update a person */

  router.put("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    var sql =
      "UPDATE pharmacy SET pharmacy_name=?, pharmacy_address=?, pharmacy_contact=? WHERE pharmacy_id = ?";
    var inserts = [
      req.body.pharmacy_name,
      req.body.pharmacy_address,
      req.body.pharmacy_contact,
      req.params.id,
    ];
    let num_hyphen_check = /^[0-9\-]+$/;
    let letter_hyphen_check = /^[a-zA-Z\-]+$/;
    if (
      !inserts[0] === true ||
      !inserts[1] === true ||
      !inserts[2] === true ||
      letter_hyphen_check.test(inserts[0]) == false ||
      num_hyphen_check.test(inserts[2]) == false
    ) {
      update_error =
        "Invalid Input! Please fill in all input fields, and make sure you have entered the correct input format as well for each input field.";
      res.redirect(req.get("/medication"));
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
