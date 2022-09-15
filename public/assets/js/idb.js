// A file to handle all of the indexedDB fumctionality
// create the 'db' variable that will store the connected database object when the connection is complete
let db;

// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
// request variable acts as an event listerner for the datavase
//  - that event listener is created when we open the connection to the database using the 'indexedDB.open()' method
//      - as part of the browser's 'window' object, 'indexedDB' is a global variable
//          - thus we could say 'window.indexedDB', but there's no need to
//  - .open() takes two parameters
//      - the name of the IndexedDB database you'd like to create (if it doesn't exist) or connect to (if it does exist). we'll use the name 'pizza-hunt'
//      - the version of the database. By default we start with '1'
//          - this parameter is used to determine whether the databases's structure has changed between connections
//              - 'Think of it as changing  columns in SQL database" from section, but no idea what they are talking about
const request = indexedDB.open('pizza-hunt', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
//  - the listener we added will handle the event of a change that needs to be made to the database's structure.
//  - IndexedDB infers that a change needs to be made wehn the database if first connected or if the version number changes
//  - thus this 'onupgradeneeded' event will emit the first time we run this code and create the 'new_pizza' object store
//      - the event won't run again unless we delete the database from the browser or we changed the version number in the .open() method to a value of 2
request.onupgradeneeded = function(event) {
    // save a reference to the database
    const db = event.target.result;

    // structure of date we are storing
    // create an object store (table)(collection) called `new_pizza`, set it to have an auto incrementing primary key of sorts
    // we store a locally scoped connection to the database and use the '.createObjectStore()'method to create the objesct store that will hold the pizza data.
    db.createObjectStore('new_pizza', { autoIncrement: true })
};

//upon a succesful
//  - with the event handler 'onsucess' we set it up so that when we finalize the connection to the database, we can store the resulting database object to the global variable 'db' we created earlier
// - this event will also emit every time we interact with the database, so everytime it runs we check to see if the app is connected to the internet network
//      - if so we execute the 'uoloadPizza()'
request.onsuccess = function(event) {
    // when db is successfully created its object store (from onupgradeneeded event above) or simply establish a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    // 'navigator' is a global object that represents the state and the identity of the user agent
    if (navigator.online) {
        // we haven't created this yet, but we will soon, so let's comment it out for now
        uploadPizza();
    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
}

// This function will be executed if we attempt to submit a new pizza and there's no internet connection
// This 'saveRecord()' function will be used in the 'add-pizza.js' files form submission function if the 'fetch()' function's '.catch()' method is executed.
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    // with IndexedDB we don't always have that direct connection like we do with SQL and MongoDB databases
    //  - so we have to explicitly open a 'transaction', or temporary connection to the database.
    //      - this will help the IndexedDB database maintain an accurate reading of the data it stores so that data isn't in flux all the time
    //  - once we open the transaction, we directly access the 'new_pizza' object store.
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method
    pizzaObjectStore.add(record);
}

function uploadPizza() {
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();

    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
        // if there was data in indexedDB's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch ('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');

                // access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');

                // clear all items in your store
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
}

// listen for app coming back online
// instruct the app to listen for the browser regaining internet connection usinf the 'online' evvemt
window.addEventListener('online', uploadPizza);