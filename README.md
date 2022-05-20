

# JeffLee Prototype
More info (first link has mostly everything you need, second link has info on permanent URL):
https://canvas.oregonstate.edu/courses/1870048/pages/learn-using-javascript-and-node-dot-js?module_item_id=21479576

https://canvas.oregonstate.edu/courses/1870048/assignments/8856861

General Tip: Ctrl C to stop any node process in terminal

## SETUP
Must run `source ./{databasename}.sql` on MySQL first on ENGR servers, if you haven't already.

Log into OSU VPN (needed to host webpage if using node).

Create new folder on ENGR servers.

Git clone or download the repository to your new ENGR server folder.

Edit the dbcon.js to contain your own credentials

### NPM Modules
Run in terminal/Putty:
`npm install`

### Non Permanent URL Output
`node main.js {PORT}`

(1024 < PORT < 65535)

Go to `http://flip{x}.engr.oregonstate.edu:{PORT}` to view webpage (must be on OSU VPN)

Where {x} is the flip number you're currently on (1-3), and PORT is port you selected in previous step.

Ex: `http://flip2.engr.oregonstate.edu:9530/`

### Permanent URL Output
Run following in terminal:

`npm i mysql express forever --save`

`alias forever='./node_modules/forever/bin/forever'`

`forever start main.js {PORT}`

`ex: forever start main.js 9530`

(1024 < PORT < 65535)

Pick another number if taken.

Go to `http://flip{x}.engr.oregonstate.edu:{PORT}` to view webpage (must be on OSU VPN)

Where {x} is the flip number you're currently on (1-3), and PORT is port you selected in previous step.

Ex: `http://flip2.engr.oregonstate.edu:9530/`

Delete permanent URL:

`forever list`

see list of PIDs of your "forever" URL

`forever stop {PID}`

## SELECT Page Construction Tips

1.
In root folder, copy `patient.js` file, then rename this copy to desired entity name.

Ex: `doctor.js`

Enter this JS file.

Change line `var query = 'SELECT * FROM ENTITYNAME';`

Note: The entity name in the `var query` line should be **exactly as written in your SQL database dump file**

In `handleRenderingofPlanets` function:

change lines

`context.{HANDLEBARNAME} = results;`

`res.render('{HANDLEBARNAME}', context)`

Ex: `context.doctorhb = results;`

**Make sure that "HANDLEBARNAME" matches handlebars file name in step 3.**

2.
Go to 
`main.js `file in root directory.

change `app.use` lines to redirect to the correct webpage.

`app.use('/{NEW_WEBPAGE_NAME}', require('./{WEBPAGE_JS_FILE_NAME}'));`

Ex:`app.use('/doctor', require('./doctor.js'));`


3. 
Go to `views` folder.

Create new handlebars file with the same {HANDLEBARNAME} as you set back in step 1.

Ex: `doctorhb.handlebars`

Edit the handlebars file as shown below to include all attributes.

**Make sure all attribute names match how they are written in your SQL file.**

**Make sure that the second line below matches your handlebar file name.**

e.g. if your handlebar file name for this entity is `patienthb`, write `each patienthb` in line 2.

```
<table>
{{#each patienthb}}
  <tr>
    <td>{{patient_id}}</td>
    <td>{{patient_first_name}}</td>
	<td>{{patient_last_name}}</td>
    <td>{{patient_birth}}</td>
	<td>{{patient_address}}</td>
	<td>{{patient_email}}</td>
	<td>{{patient_contact}}</td>
  </tr>
{{/each}}
</table>
```
4. Optional:
Consider inserting your new webpages (as defined by {entityname}.js) into public > index.html to make site easier to navigate.

## INSERT Page Construction Tips
These are the lines I edited. You can compare the originals (https://github.com/knightsamar/cs340_sample_nodejs_app/blob/master/people.js) and https://github.com/knightsamar/cs340_sample_nodejs_app/blob/master/views/people.handlebars

If the line references here break due to later edits, ah well. 
#### For views > `people.handlebars`

/people webpage on Flip

**Note: Filter and Delete on this page are NOT updated**

In line 7, you need to edit `First name: <input type="text" name="ATTRIBUTE1"><br>`, where ATTRIBUTE1 = the first attribute you want inserted. 

In line 10, you need to edit `<option value="{{ATTRIBUTE2}}">{{manufacturer}}</option>` where ATTRIBUTE2 = second attribute you want inserted.

On line 9, edit this to be
`#each HANDLEBARNAME`
where HANDLEBARNAME = handlebar file name of the entity you want (check "views" folder).

On lines 39 to 42, fill out the row names of table you want.

On lines 47 to 49, fill in the attributes you want listed in the SELECT table.

On line 51: ` <td><a href="/PRIMARYJS/{{id}}">Update</a></td>`

where PRIMARYJS is the JS file you want to change

#### For people.js file
Line 6- Change `<form id="addperson" action="/PRIMARYJS" method="post">`

Line 17: change `mysql.pool.query("SELECT * from ENTITYNAME", function(error, results, fields){`

Where ENTITYNAME = entity name as defined in SQL data dump.

Line 22: Change 	`context.HANDLEBARNAME = results;`

Where HANDLEBARNAME = name of relevant handlebar file (check "views" folder)

Line 82: `res.render('PRIMARYJS', context);`

Line 99- change `res.render('PRIMARYJS', context);`

Line 133- `res.redirect('/PRIMARYJS');`

Line 142: Change 	`console.log(req.body.HANDLEBARNAME)`

Line 145: Change `var sql = "INSERT INTO ENTITYNAME (ATTRIBUTE1,ATTRIBUTE2) VALUES (?,?)";`

Where ENTITYNAME and ATTRIBUTE1,2 are as they are defined in SQL data dump.

Line 146: Change `var inserts = [req.body.ATTRIBUTE1, req.body.ATTRIBUTE2];`

Line 165: `var inserts = [req.body.ATTRIBUTE1, req.body.ATTRIBUTE2];`


#### pharmacy-insert-handlebars
Below, let Where PRIMARYJS = file name of the JS file you want to use. In this case, `pharmacy-insert`

Line 6- Change `<form id="addperson" action="/PRIMARYJS" method="post">`

Line 49- change `td><a href="/PRIMARYJS/{{id}}">Update</a></td>`

#### pharmacy-insert.js

line 82 - change `res.render('PRIMARYJS', context);`

Leaving it as `people` causes the wrong page to be shown.

Line 99- change `res.render('PRIMARYJS', context);`

Line 153- `res.redirect('/PRIMARYJS');`
