# Hospital Website

## Site URL (Try it Yourself!)
**https://hospital-website1.herokuapp.com/**

### Backup host if Heroku free plan expires after November 2022:
**https://hospital-website.onrender.com/**

## About
Proof of concept CRUD (Create, Read, Update, Delete) site, with database interaction.

The site is meant to be used by a theoretical hospital. The user is able to insert new entries, update entries, delete entries, search and view existing entries for a variety of hospital-related applications.

 ### Technologies Used:
 * SQL (ClearDB) for database management
 * NodeJS for backend
 * Express Handlebars used for frontend templating of recurring site features
 * Deployed on Heroku

## Screenshots

Screenshot of Pharmacy page:
![Overview](https://media.discordapp.net/attachments/833505136290299935/993971873102712952/unknown.png?width=715&height=670)

Screenshot of Pharmacy Page after Searching for pharmacy named "Kroger":
![Search](https://media.discordapp.net/attachments/833505136290299935/993972274262720532/unknown.png?width=729&height=670
)

Screenshot of Pharmacy page after filling out the "Add new Pharmacy" form and adding a new Pharmacy "Johnson Pharmacy": ![Add](https://media.discordapp.net/attachments/833505136290299935/993972712802369556/unknown.png?width=770&height=670)

Screenshot of Pharmacy page after deleting " Albertsons" pharmacy:
![Delete](https://media.discordapp.net/attachments/833505136290299935/993973355545890867/unknown.png?width=796&height=670)

Screenshot of Pharmacy Update Page after clicking on "Update" for pharmacy "Wallgreens&":
![Update](https://media.discordapp.net/attachments/833505136290299935/993973421958504469/unknown.png)

Screenshot of Pharmacy page after I updated "Wallgreens&" pharmacy to have the name "Wallgreens" instead:
![Update2](https://media.discordapp.net/attachments/833505136290299935/993973534525239436/unknown.png?width=749&height=670)

## Usage Setup
[More Info](https://youtu.be/ZZp0VIjTsbM)

* Make Heroku account and ClearDB account.
* Set up MySQL Workbench
* Create `dbcon.js` file using your ClearDB credentials, with `dbdon.js.example` file as a template.

**How to Run Locally**

* Run `npm install`
* Run `npm start`

**How to Deploy**
* Heroku Instructions
	* Make a local branch herokubranch2 so ClearDB credentials aren't leaked from dbcon.js
	* git push -f heroku herokubranch2:master to push to heroku site
	
* Render.com instructions
	* https://render.com/docs/deploy-node-express-app
	* Delete package-lock.json, install yarn (render.com works better with yarn?)
	* Make a private cloned repository so ClearDB credentials aren't leaked (probably not best method but it works). Wasn't sure how to get render.com running in command line interface.

