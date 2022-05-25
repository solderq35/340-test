module.exports = function(){
    var express = require('express');
    var router = express.Router();

 //   router.get('/', servePlanets);
    /* get people to populate in dropdown */
    function getPeople(res, mysql, context, complete){
        mysql.pool.query("SELECT medication_id AS medication_id, medication_id FROM medication", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.medication2 = results;
            complete();
        });
    }

function geterrormessage(res, context, complete){

    
            context.errormessage = errormessage;
            complete();

    }
	

    function getPeople2(res, mysql, context, complete){
        mysql.pool.query("SELECT * from medication_pharmacy", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.mediphar = results;
            complete();
        });
    }

    /* get certificates to populate in dropdown */
    function getCertificates(res, mysql, context, complete){
		mysql.pool.query("SELECT pharmacy_id AS pharmacy_id, pharmacy_id FROM pharmacy", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.pharmacy2 = results;
            complete();
        });
    }

    function getPlanets(res, mysql, context, complete){
        mysql.pool.query("SELECT planet_id as id, name FROM bsg_planets", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets  = results;
            complete();
        });
    }

    function getPeoplebyHomeworld(req, res, mysql, context, complete){
      var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.homeworld = ?";
      console.log(req.params)
      var inserts = [req.params.homeworld]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    /* Find people whose fname starts with a given string in the req */
    function getPeopleWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.fname LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    function getPerson(res, mysql, context, id, complete){
        var sql = "SELECT character_id as id, fname, lname, homeworld, age FROM bsg_people WHERE character_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            complete();
        });
    }
	

    /*Display all people. Requires web based javascript to delete users with AJAX*/


router.get('/', function(req, res){
   // function servePlanets2(req, res){
		
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletedoctor.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
		//servePlanets(res,mysql,context,complete);
        getPeople(res, mysql, context, complete);
        getCertificates(res, mysql, context, complete);
		getPeople2(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('mediphar', context);
            }

        }
    });

//router.get('/',servePlanets2);
//router.get('/',servePlanets);

    /*Display all people from a given homeworld. Requires web based javascript to delete users with AJAX*/
    router.get('/filter/:homeworld', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getPeoplebyHomeworld(req,res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('mediphar', context);
            }

        }
    });

    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getPeopleWithNameLike(req, res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('people', context);
            }
        }
    });

    /* Display one person for the specific purpose of updating people */

     router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updateperson.js"];
        var mysql = req.app.get('mysql');
        getPerson(res, mysql, context, req.params.id, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-person', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        console.log(req.body.medicationphar)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO medication_pharmacy (medication_id,pharmacy_id) VALUES (?,?)";
        var inserts = [req.body.medication_id, req.body.pharmacy_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
				//let alert = require('alert'); 
				//alert("Hello! I am an alert box!!");
			//	res.redirect('/mediphar');
//var alert = require("alert")
			//	alert('howdy')
                
              //  res.write(JSON.stringify(error));
               // res.end();

			//	return false;
				res.redirect('/duplicate.html');
		
            }else{
                res.redirect('/mediphar');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE bsg_people SET fname=?, lname=?, homeworld=?, age=? WHERE character_id=?";
        var inserts = [req.body.medication_id, req.body.pharmacy_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/medication_id/:medication_id/pharmacy_id/:pharmacy_id', function(req, res){
        //console.log(req) //I used this to figure out where did pid and cid go in the request
        console.log(req.params.medication_id)
        console.log(req.params.pharmacy_id)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM medication_pharmacy WHERE medication_id = ? AND pharmacy_id = ?";
        var inserts = [req.params.medication_id, req.params.pharmacy_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400); 
                res.end(); 
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
