
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

`alias forever='./node_modules/forever/bin/forever`

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

Change line `var query = 'SELECT * FROM {entityname}';`

Ex: `var query = 'SELECT * FROM patient';`

Note: The entity name in the `var query` line should be **exactly as written in your SQL database dump file**

In `handleRenderingofPlanets` function:

change lines

`context.{new name of handlebars file} = results;`

`res.render('{new name of handlebars file}', context)`

Ex: 
`context.doctorhb = results`

`res.render('doctorhb', context)`

**Make sure that "new name of handlebars file" matches handlebars file name in step 3.**

2.
Go to 
`main.js `file in root directory.

change `app.use` lines to redirect to the correct webpage.

`app.use('/{desired webpage name}', require('./{webpage js file}'));`

Ex:`app.use('/doctor', require('./doctor.js'));`


3. 
Go to `views` folder.

Create new handlebars file with the same {new name of handlebars file} as you set back in step 1.

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