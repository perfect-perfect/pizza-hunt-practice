// import the 'Schema' contructor 'model' function
const { Schema, model } = require('mongoose');

// we create a Schemausing the 'Schema' constructor we imported from mongoose
//  - define the fields with specific data types
//      - we don't have to define the fields as MongoDB will allow the data anyway, but for clairty and usability, we should regulate what the data will look like
const PizzaSchema = new Schema({

    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default: "Large"
    },
    // we could also specify array  as the data type instead of brackets
    toppings: []
})

// create the Pizza model using the PizzaSchema
//  - we need to actually create the 'model' to get the prebuilt methods that Mongoose provides
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;