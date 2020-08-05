# Fullstack TODO server

TODO API node server with MySQL

## Instructions

* Open `src/setup.sql` in MySQL Workbench and execute the script to import the database
* Set your MySQL credentials in `src/db/sql.ts`
* Make sure you have NodeJS v10 or newer installed
* Type `npm i`
* Set a JWT secret by typing `SET JWT_SECRET=<secret>`
* Type `npm start`
* Open your browser and go to http://localhost:4000
* WIN!

## Testing API in Postman

You may import `TODO API.postman_collection.json` into your Postman

This will add a collection to your Postman, which has all the types of API requests you can make

To set the authorization, right-click on the collection > Edit > Authorization > Bearer Token

(this token will be used for the whole collection automatically where needed) 