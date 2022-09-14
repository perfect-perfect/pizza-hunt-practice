const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
// Reply Schema
const ReplySchema = new Schema(
    {       
        // we'll need a unique identified instead of the default _id field that is created
        //  - we do this so we don't confuse it with the parent comment '_id'
        //  - so we'll add a custome 'replyId' field
        //  - it has a custome field name of 'replyId' but we're still going to have it generate the same type of 'ObjectId()' value that the '_id' field typically creates
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String
        },
        writtenBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);
// Schema is a constructor we imported from mongoose
//  - define the fields with specific data types
//  - we don't have to define the fields as MongoDb will allow the data anyways, but for clarity we should regulate what the data will look like
const CommentSchema = new Schema(
    {
        writtenBy: {
            type: String
        },
        commentBody: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        // Note that unlike our relationship between pizza and comment data
        //  - replies will be nested directly in a comment's document and not referred to
        replies: [ReplySchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// virutal to fet the total reply count
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

// when you call 'mongoose.model()' on a schema, Mongoose compiles a model for you from the schema
//  - the first argument 'Comment' is the singular name of the collection your model is for
//  - second arguement is the schema we are using to create the model
const Comment = model('Comment', CommentSchema);

module.exports = Comment;