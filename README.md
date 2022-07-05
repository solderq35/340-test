# Hospital Website

## Site URL (Try it Yourself!)
**https://hospital-database-node.herokuapp.com/**

## About
Proof of concept CRUD (Create, Read, Update, Delete) site, with database interaction.

The site is meant to be used by a theoretical hospital. The user is able to insert new entries, update entries, delete entries, search and view existing entries for a variety of hospital-related applications.

 ### Technologies Used:
 * SQL (ClearDB) for database management
 * NodeJS for backend
 * Express Handlebars used for frontend templating of recurring site features
 * Deployed on Heroku

## Screenshots
![Overview](https://media.discordapp.net/attachments/833505136290299935/993939606959575171/unknown.png?width=1406&height=670)

![Search](https://media.discordapp.net/attachments/833505136290299935/993940525327597708/unknown.png?width=1440&height=648
)

![Update](https://media.discordapp.net/attachments/833505136290299935/993940900281589910/unknown.png?width=1440&height=557)

## Usage Setup
[More Info](https://youtu.be/ZZp0VIjTsbM)

* Make Heroku account and ClearDB account.
* Set up MySQL Workbench
* Create `dbcon.js` file using your ClearDB credentials, with `dbdon.js.example` file as a template.

**How to Run Locally**

* Run `npm install`
* Run `npm start`

**How to Deploy**

* Make a local branch herokubranch2 so credentials aren't leaked from dbcon.js
* git push -f heroku herokubranch2:master to push to heroku site