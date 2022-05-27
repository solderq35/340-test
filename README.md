

# JeffLee Prototype
More info (first link has mostly everything you need, second link has info on permanent URL, third link is just direct Github link to example repo):

https://canvas.oregonstate.edu/courses/1870048/pages/learn-using-javascript-and-node-dot-js?module_item_id=21479576

https://canvas.oregonstate.edu/courses/1870048/assignments/8856861

https://github.com/knightsamar/cs340_sample_nodejs_app

General Tip: Ctrl C to stop any node process in terminal

## SETUP
Must run `source ./ddq.sql` AND `cs340_bsg_for_sample_webapp.sql`on MySQL first on ENGR servers, if you haven't already (we plan to phase out reliance on `cs340_bsg_for_sample_webapp.sql` in the near future, but for now we haven't removed some legacy functions.

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
