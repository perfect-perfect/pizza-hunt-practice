const { Schema, model } = require('mongoose');

// Schema is a constructor we imported from mongoose
//  - define the fields with specific data types
//  - we don't have to define the fields as MongoDb will allow the data anyways, but for clarity we should regulate what the data will look like
const CommentSchema = new Schema({
    writtenBy: {
        type: String
    },
    commentBody: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// when you call 'mongoose.model()' on a schema, Mongoose compiles a model for you from the schema
//  - the first argument 'Comment' is the singular name of the collection your model is for
//  - second arguement is the schema we are using to create the model
const Comment = model('Comment', CommentSchema);

module.exports = Comment;