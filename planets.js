module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function servepatients(req, res){
        console.log("You asked me for some planets?")
        var query = 'SELECT patient_id, patient_first_name, patient_last_name FROM patient';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfpatients(error, results, fields){
          console.log(error)
          console.log(results)
          console.log(fields)
          //take the results of that query and store ti inside context
          context.planets = results;
		  console.log(results)
          //pass it to handlebars to put inside a file
          res.render('planets', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfpatients)

        //res.send('Here you go!');
    }

    router.get('/', servepatients);
   // router.get('/:fancyId', serveOnePlanet);
    return router;
}();
