# Revamped Guide

**General Advice**

Read one step after another.

Make sure you have actually mapped the correct main JS file to the correct handlebars file in `main.js`.

For best understanding, please have the template files and a finished / work in progress file open at same time to compare.

The guide goes through each file top to bottom. Input validation explanation will be explained separately at end.

I probably will miss some things. When in doubt, watch for the following recurring patterns (they will make more sense after reading rest of guide):

`context.JSENTITYNAME`

`res.redirect/render/write(JSENTITYNAME...)`

`context.jsscripts = [INSERT_JS_FUNCTIONS]`

`if(callbackCount >= NUMBER_OF_FUNCTIONS_CALLED){`

` var sql = [INSERT SQL QUERY]`

## SELECT Walkthrough

<h3> Main Javascript File </h3>

Template files to copy and edit:
`people.js` (normal), `people_certs.js` (foreign keys)

The `getPeople` function is generally what is used to control showing all entries in the desired data table.

In `getPeople` function, replace the SQL statement in `mysql.pool.query(...` with the SQL statement you actually want. For some entities, like `diagnosis`, you may want to do a more complex SQL statement such as joining from other tables.

**JSENTITYNAME**

Replace the `context.JSENTITYNAME = results;` line at the bottom of `getPeople` function with an easy to remember name.

**For simplicity's sake, I like to keep my handlebar file names and the main JS file names the same for a given entity.** For example, views/doctor.handlebars and doctor.js. This vastly simplifies things and prevents a lot of possible confusion. This is the name I will mean by JSENTITYNAME for the remainder of this document.

**Note that JSENTITYNAME is not necessarily the same as how you named the entity in your SQL schema.**

Next, in `router.get('/', function(req, res){...` function, replace the ` res.render('JSENTITYNAME', context);` with the name you want again, following tips from above.

<h4>How to Handle Foreign Keys</h4>

If the entity you want to SELECT has foreign keys, then you will need multiple SQL queries, one for each entity represented.

You can make multiple copies of the `getPeople` function (naming each one differently), and then call all of them from within `router.get('/', function(req, res){...`. This will let you use foreign keys from each entity you need. Refer to `diagnosis.js` for an example.

Remember to update `if(callbackCount >= N){` at bottom of `router.get('/', function(req, res){...` function, where N = number of functions you are calling in `router.get('/', function(req, res){...`. If you don't do this you will get error.

<h3> Handlebars File </h3>
Template files: `views/people.handlebars` (normal), `views/people_certs.handlebars` (foreign keys)

This part is fairly straightforwards. It's more important that you name your handlebar file correctly in your JS file.

Go to the `Current people` section near the bottom of this handlebars file and follow example syntax.

Note that if you renamed any entity attributes in your `getPeople` function in the main JS file (e.g. `SELECT X as Y FROM Z`), then you will have to call this entity `Y` in your handlebars file.

Any time you see the `each JSENTITYNAME`, be sure to edit it as needed, which we went over earlier. Just make sure you keep a consistent name structure for any given entity across files to avoid headache. Each time you need to call a foreign key, you will need to follow this up with another `#each JSENTITYNAME` (more on this below).

## INSERT Walkthrough

(Stuff covered in the any previous section may be skipped).

<h3> Main JS File </h3>
Template files: `people..js` (normal), `people_certs.js` (foreign keys)

In function `router.post('/', function(req, res){...`, replace the line `var sql = "INSERT INTO ..."` with the desired SQL query to insert the correct content into the entity you need.

Next, replace the line ` var inserts = [req.body.ENTITY1, req.body.ENTITY2...];` with the correct attributes of your entity.

Replace the `res.redirect('/JSENTITYNAME');` line at the bottom of the `router.post` function with the correct entity name.

<h3> Handlebars File </h3>
Template file: `views/people.handlebars` (normal), `views/people_certs.handlebars` (foreign keys)

In line `<form id="addperson" action="/MAINJSFILE" method="post">` near the top of the handlebars file, make sure to change this to the main JS file you are using for this entity.

In the Inputs section at the top, make sure you have the right file types and generally try to match any attribute names as defined in your `getPeople` function from main JS file.

Any time you see the `#each JSENTITYNAME`, be sure to edit it as needed, which we went over earlier.

<h4>Select/Dropdown Menus for Foreign Keys</h4>
For dropdown menus with foreign keys, refer to the "How to Handle Foreign Keys" section above. You need to create a separate `getPeople` style function for each entity involved and make sure your callbackCount variable value in `getPeople` is correct. Otherwise it's pretty straightforwards, refer to `views/diagnosis.handlebars` for example syntax.

## SEARCH Walkthrough

(Stuff covered in the any previous section may be skipped).
(Not included in the template foreign key files, but it's very easy to transition to an entity with foreign keys).

<h3>Search Function JS File</h3>
Template file: `public/searchpeople.js`

I recommend making an overarching search JS file and writing many functions within it, but you can make a separate search JS file for each entity if desired.

Change the function name to something memorable, and also change ` window.location = '/JSENTITYNAME/search/` to the correct entity name.

<h3> Main JS File </h3>
Template file: `people.js`

Edit function ` function getPeopleWithNameLike(req, res, mysql, context, complete) {...`.

First edit `var query =...` to follow the general syntax `var query = [SQL_SELECT_STATEMENT] WHERE [ATTRIBUTE_USED_AS_SEARCH_TERM] LIKE...`

Edit `context.JSENTITYNAME = results;` to be correct value.

-

For functions ` router.get('/search/:s', function(req, res){...` as well as function `context.jsscripts = [LISTOFJSFUNCTIONS];`, change `context.jsscripts = [LISTOFJSFUNCTIONS];` and make sure it is including your Search Function JS file that we worked on above (important to make sure all the functions run).

Now change `res.render('JSENTITYNAME', context);` to be correct as well, in both functions.

<h3> Handlebars File </h3>
Template File: `views/people.handlebars`

Edit `<form id='search_people'` so its labels are to your liking. But most importantly, edit ` <input type="button" value="Search" onclick="SEARCHFUNCTIONNAME()">` so it refers to the correct search function for your entity as defined in your search function JS file that we discussed above.

## DELETE Walkthrough

(Stuff covered in the any previous section may be skipped).

<h3>Delete Function JS File</h3>
Template file: `public/deleteperson.js`.

Similarly as to SEARCH, I recommend making a general purpose DELETE JS file for every entity, and simply writing several DELETE functions from within one JS file.

Rename this delete function to something memorable and edit the line `url: '/JSENTITYNAME/' + id,`.

Look at `function deletePeopleCert(pid, cid)` to understand how to write delete function for composite key table (e.g. MediPhar).

<h3>Main JS File</h3>
Template file: `people.js` (normal), `people_certs.js` (composite key)

Edit the function ` router.delete('/:id', function(req, res){...`.

In this function, edit the line `var sql = "...";` to contain the correct DELETE SQL query for your entity.

For functions ` router.get('/search/:s', function(req, res){...` as well as function `context.jsscripts = [LISTOFJSFUNCTIONS];`, change `context.jsscripts = [LISTOFJSFUNCTIONS];` and make sure it is including your Delete Function JS file that we worked on above (important to make sure all the functions run).

## UPDATE Walkthrough

(Stuff covered in the any previous section may be skipped).

<h3>Update Function JS File</h3>
Template file: `public/updateperson.js`

Similarly as to SEARCH, I recommend making a general purpose UPDATE JS file for every entity, and simply writing several UPDATE functions from within one JS file.

Name the function something memorable.

Edit the lines `url: '/JSENTITYNAME/' + id,`

and also `data: $('#UPDATE_HANDLEBARS_FILE').serialize(),`

<h3>Main JS File</h3>
Template file: `people.js` (normal), `diagnosis.js` (foreign keys)

Edit the function `getPerson(res, mysql, context, id, complete){...`.

(This function is needed to display the input field for updating one particular data table entry).

Edit the line in this function to be `var query = [SQL_SELECT_STATEMENT] WHERE [PRIMARY_KEY] = ?" `

Edit the line in the function:

`context.JSENTITYNAME` = results[0];`

-

Now for the function ` router.get('/:id', function(req, res){...`

In this function, edit the line `context.jsscripts = ["INSERT_UPDATE_JS_FUNCTION"];`, with INSERT_UPDATE_JS_FUNCTION being the function from the UPDATE Function JS File we defined above.

Edit the line `res.render('UPDATE_HANDLEBARS_FILE', context);` as well

-

Now, for function ` router.put('/:id', function(req, res){...`

In this function, we edit the line `var sql = [UPDATE_SQL_QUERY]`.

Then we edit the line `var inserts =[req.body.ATTRIBUTE1, req.body.ATTRIBUTE2 ..., req.body.params.id]`

<h3>Handlebars File</h3>
Template file: `views/update-person.handlebars` (normal), `views/update-diagnosis.handlebars` (foreign keys)

Due to how the example Repo was set up, you kinda have to make a separate handlebars file for each entity you want to update.

Edit line `<form id="UPDATE_HANDLEBARS_FILE" action="/people"`

Next, you will have to edit the input lines so that the user can input the updated values.

This is similar to the format you used in the `views/people.handlebars` file for INSERT functionality.

The difference is, you need to include an extra prefix for the desired entity, e,g,

`<input type="DATA TYPE" name="ATTRIBUTE1" value="{{ENTITY1.ATTRIBUTE1}}">`

Next, you need to edit line `<button onclick="UPDATE_FUNCTION_NAME({{ENTITY_PRIMARY_KEY}})">Update</button>`

Take note that UPDATE_FUNCTION_NAME needs to appear exactly as written in your Update Function JS file as explained above.

## Input Validation

The general logic of any input validation written for this program is

`Default: No error message shown;`

`If (invalid logic detected){`

    Don't Insert, Update, Search, or Delete;
    Show Error Message;

`}`
`Else`

`{`

` Perform the Insert, Update, Search, Delete`

    `Don't Show Error Message;`

`}`

To create the error messages with Handlebars:

Create a function with syntax

`function geterrormessage(res, context, complete){`

            context.errormessage = errormessage;
            complete();

` }`
Call `geterrormessage` in `router.get('/:id'` of main JS file to show error for UPDATE inputs. For INSERT, DELETE, SEARCH, call `geterrormessage` in `router.get/`.

Remember to increase the value of `if(callbackCount >= N)` as needed, as you call more functions. Not increasing the value of N will lead to errors.

`
