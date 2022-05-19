# JeffLee Prototype
More info:
https://canvas.oregonstate.edu/courses/1870048/pages/learn-using-javascript-and-node-dot-js?module_item_id=21479576
https://canvas.oregonstate.edu/courses/1870048/assignments/8856861

## SETUP
General tips: Ctrl C
stop everything

Log into OSU VPN
Create new folder on ENGR servers.

Git clone or download the repository to your new ENGR server folder.

Run in terminal/Putty:
npm install
node main.js {PORT}
(1024 < PORT < 65535)

Go to http://flip{x}.engr.oregonstate.edu:{PORT}
Where {x} is the flip number you're currently on (1-3), and PORT is port you selected in previous step.

For permanent URL
npm i mysql express forever --save
alias forever='./node_modules/forever/bin/forever'
forever start main.js {PORT}
(1024 < PORT < 65535)
Go to http://flip{x}.engr.oregonstate.edu:{PORT}
Where {x} is the flip number you're currently on (1-3), and PORT is port you selected in previous step.

Delete permanent URL
forever list
see list of PIDs of your "forever" URL
forever stop {PID}

## SELECT Page tips
Handlebars etc
1.
In root folder, change patient.js file to desired entity name.
Now, go to {entityname}.js
In handleRenderingofPlanets function:
change lines

context.{new name of handlebars file} = results;
res.render('{new name of handlebars file}', context)
Make sure that "new name of handlebars file" matches handlbars file name in step 3.

ex: context.{doctorhb} = results;

2.
Go to 
main.js 
change app.use lines to redirect to the correct webpage.
app.use('/{desired webpage name}', require('./{webpage js file}'));
app.use('/doctor', require('./doctor.js'));


3. 
Go to views folder to check handlebar files
Ex: view/doctorhb.handlebars

Edit, rename handlebars file as needed. Follow the handlebars file name you set in step 1.

Follow the format, list all of the attributes for your desired entity. Pretty self explanatory.