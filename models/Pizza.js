// import the 'Schema' contructor 'model' function
const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


// we create a Schema using the 'Schema' constructor we imported from mongoose
//  - define the fields with specific data types
//      - we don't have to define the fields as MongoDB will allow the data anyway, but for clairty and usability, we should regulate what the data will look like
const PizzaSchema = new Schema(
    {

        pizzaName: {
            type: String,
            // when required is set to true, it will require data to exist for that field 
            //  - with required you can actually provide a custom error message
            //      - required: 'You need to provide a pizza name!'
            required: true,
            // removes whitespace before and after the input string
            trim: true
        },
        createdBy: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // this is an example of a 'getter' function
            //  - it will transfom the data on every request on retrival, before it gets back to the controller.
            //  - sort of like middleware for your data
            // everytime we retrieve a pizza, the value in the 'createdAt' field will be formatted by the 'dateFormat()' function
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        size: {
            type: String,
            required: true,
            // 'enum' stands for 'enumerable'
            //  - a popular term in web development that refers to a set of data that can be iterated over (much like the 'for...in' loop to iterate through an object) ??? no idea what a 'for...in' loop is
            //  - it is validation
            //  - with this validation in place, we provide an array of options that this size field will accept
            //      - if a user attempts to enter pizza not listed - the validation will not allow it
            // if you want to provide a custome error message for the 'required' option here, you wouldn't recieve it. 
            //  - if you want custom message for enumerable values you need to look into implementing the 'validate' option mongoose lets you use, where you can create a custo function to test the values.
            enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
            default: "Large"
        },
        // we could also specify array  as the data type instead of brackets
        // the toppings field can have any number of custom toppings which may be hard to regulate, so we'll keep it as is
        toppings: [],
        // this associates the comments with posts
        comments: [
            {
                // tell mongoose to expect an ObjectId
                type: Schema.Types.ObjectId,
                // tell it the data comes from 'Comment'
                // 'ref' tells the 'Pizza' model which documents to search to find the right comments 
                ref: 'Comment'
            }
        ]
    },
    {
        // tell the schema to accept virtual properties
        // this isn;t explained to well
        toJSON: {

            virtuals: true,
            // we tell the ongoose model that it should use any getter function we've specified
            getters: true

        },
        // we don't need an id for this
        id: false
    }
);

// creates the virtual 'commentCount'
//  - virtuals allow you to add virtual properties to a document that aren't stored in the database
//  - they're normally computed values that get evaluated when you try to access their properties
// get total count of comments and replies on retrieval
// - you'll be able to access this with 'pizza.commentCount'
PizzaSchema.virtual('commentCount').get(function() {
    // here we're using the '.reduce()' method  to tally up the total of every comment with its replies
    //  - reduce() takes two parameters
    //      - 'accumulator'
    //          - here it is 'total'
    //      - 'currentValue'
    //          - here it is 'comment'
    //  - as .reduce() walks through the array, it passes the accumulating total and the current value of comment into the function, with the return of the function revising the total for the iteratin throguh the array.
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});


// create the Pizza model using the PizzaSchema
//  - we need to actually create the 'model' to get the prebuilt methods that Mongoose provides
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;