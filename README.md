# JeffLee Prototype

More info (first link has mostly everything you need, second link has info on permanent URL, third link is just direct Github link to example repo):

https://canvas.oregonstate.edu/courses/1870048/pages/learn-using-javascript-and-node-dot-js?module_item_id=21479576

https://canvas.oregonstate.edu/courses/1870048/assignments/8856861

https://github.com/knightsamar/cs340_sample_nodejs_app

General Tip: Ctrl C to stop any node process in terminal

My attempt at a guide: https://github.com/solderq35/hospital-website/blob/osubranch/old%20stuff/guide2.md
(May need to dig around the "old stuff" folder for some template files I removed from the main fulders).

## SETUP
**Note: These are deprecated instrucctions from back when this was an OSU CS340 project. My MariaDB account from OSU has since expired so I have no idea how well this version still works on OSU flip servers. There are also several bug fixes missing from this version, such as the fact that error messages don't go away even when you refresh the page, only going away when you make a correct input. I keep this for legacy purposes I guess.**

Must run `source ./ddq.sql` first on ENGR servers, if you haven't already 

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

Note: you want to add `alias forever='./node_modules/forever/bin/forever'` to your `.bashrc` file in your ENGR directory, so you don't have to type this out every time.

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
