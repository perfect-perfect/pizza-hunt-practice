// express is a back end application server framework for Node.js
// it is desiged for building web applications and APIs.
// it has been called the de facto standard server framework for Node.js
// express sets up the server tath allows use to ake requests and send responses from our database.
const express = require('express');

// mongoose is an ODM (Object Document Mapping)
// Schema based solution to model your application data.
//  
const mongoose = require('mongoose');


// initiates, creates, the server
const app = express();
// state which PORT we want th server ran on
//  - Port gives a destination on the host.
const PORT = process.env.PORT || 3001;

// app.use()
//  - this is a method executed by our Express.js server that mounts a function to the server that our requests will pass through before getting to the itended endpoint

// parse income JSON data and makes it accessible on req.body
//  - takes incoing POST data in the form of JSON and parses it into the 'req.body' JavaScript object
// We intercept our requests (post?) before it gets to the callback function
// takes teh raw data sent over the HTTP request and converts it into a JSON object
app.use(express.json());

// parse incoming string or array data
// express.urlenconded({ extended: true })
//  - it takes incoming POST data
//  - converts it to key/value pairings that can be accessed in the 'req.body' object
//  - 'extended: true' 
//      - informs the server that there may be sub-array data nested in it as well, so it needs to look as deep into the POST data as possible to parse all of the data correctly
app.use(express.urlencoded({ extended: true }));
// built-in middleware function in Express. It serves static files
//  - root argument specifies the root directory from which to serve static assests
// we are serving static html files that have to reference their respective javascript and css files. This allows us to reference those files in the html. We just had to serve the public folder as the root folder.
app.use(express.static('public'));

// tells the express server to use the routes located in ./routes
//  - the routes send the html files based on the URL request
//  - will add what the POST routes do once we do them
app.use(require('./routes'));

// tells mongoose which database we want to connect to
//  - if th environment variable 'MONGODB_URI' exists like on Heroku when we deploy later
//      - otherwise it will short-circuit to the local MongoDB server's database at 'mongodb://localhost:271017/pizza-hunt
//          - now we never created the database 'pizza-hunt' this is fine
//              - if Mongoose connects to a database that ins;t there, MongoD will find and connect to the database if it exists, it if doesn't exist it will create it.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-hunt', {
    // The second argument in the example is a set of configuration options Mongoose asks for more information about.
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Use this to log mongo queries being executed
mongoose.set('debug', true)

// the listen() method makes the express server listen for requests
// first variable PORT indicates whcih port we wii
app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
