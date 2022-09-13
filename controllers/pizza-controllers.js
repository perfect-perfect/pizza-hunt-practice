const { Pizza } = require('../models');

const pizzaController = {
    // the functions will go in here as methods
    // Because these methods will be used as the callback functions for the Express.js routes, each will take two parameters: 'req' and 'res'.

    // this style of writing object methods is another new feature of JavaScript.
    // we can now write them one of two ways
    // const dogObject = {
    //     bark: function() {
    //         console.log('Woof!');
    //     }
    // or
    //      bark() {
    //         console.log('Woof!');
    //     }
    // }
    

    // get all pizzas
    // will serve as the callback function for the 'GET /api/pizzas' route
    getAllPizza(req, res) {
        // uses Mongoose method 'find()' 
        //  - which is much like sequelizes 'findAll()'
        Pizza.find({})
            // when we return a pizza search we want to populate the comments
            //  - chain a .populate to your query.
            //  - pass in an object with the key 'path' plus the value of the field you want populated
            //      - 
            .populate({
                // where does 'comments' come from? it has to be the route path. it is the only thing named 'comments' 
                path: 'comments',
                // tell mongoose we don't want the __v field
                // if we didn't have it, it would mean that it would return ONLY the '__v' field
                select: '-__v'
            })
            .select('-__v')
            // sort() is a Mongoose method to order the response 
            //  - we are sorting by DESC order by the '_id' value
            //      - the gets the newest pizza because a timestamp value is hidden somewhere inside the MongoDb ObjectId
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get one pizza by id
    getPizzaById({ params }, res) {
        // uses mongoose's '.findOne()' method to find a single pizza by its '_id'
        //  - instead of accessing the entire 'req', we've destructured 'params' out of it, because that's the only data we need for this.
        Pizza.findOne({ _id: params.id })
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            .then(dbPizzaData => {
                // if no pizza is found, send 404
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }

                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    // create a pizza
    // method for handling 'POST /api/pizzas' to add a pizza to the database
    // we deconstruct the 'body' out of the Express.js 'req' object because we don't need to interface with any of the other data it provides.
    createPizza({ body }, res) {
        // we use the mongoose method '.create()' to create data
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            // send a 400 error if something goes wrong, as we likely sent the wrong type of data for one of the fields
            .catch(err => res.status(400).json(err));
    },

    // updata a pizza by id
    updatePizza({ params, body }, res) {
        // mongoose method '.findOneAndUpdate()'
        //  - finds a single document we want to update, then updates it, then returns the updated document.
        //      - if we don't set the third parameter '{ new: true }' it will return the original document
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with that id'})
                    return;
                }

                res.json(dbPizzaData);

            })
            .catch(err => res.status(404).json(err));
    },

    // delete pizza
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = pizzaController;