const { Comment, Pizza } = require('../models');

const commentController = {
    // add comment to pizza
    addComment({ params, body }, res) {
        console.log(body)
        Comment.create(body)
            .then(({ _id }) => {
                // We are adding data to the neseted array 'comments' in the Pizza model based on the params.pizzaId
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $push: { comments: _id } },
                    { new: true}
                );
            })
            // we're also returning the pizza Promise here so that we can do something with the results of the Mongoose operation
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // add a reply
    //  - as we did in addComment() and removeComment(), we're passing 'params' here as a parameter, so we'll need to make ure we pass it to 'addReply()' when we implement it later in the route.
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
            // params is a property of the req object, we destructured it out
            //  - we select to use the param which we named 'commentId' in the route.
            { _id: params.commentId },
            // the subdocument replies are being stored in a nested array
            //  - we'll update the array using the MongoDb fuctionality $push
            //      - the name of the array property is named 'replies'
            //      - the replies subdocument will come from the req.body, whcih we destructured
            { $push: { replies: body }},
            // when the docuement is updated mongoose will return the updated document
            { new: true }
        )
            // 
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            // using the MongoDB '$pull' operator to remove the specific reply from the replies array where the 'replyId' matches the value of 'params.replyId' passed in from the route
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        )
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.json(err));
    },

    // remove comment
    removeComment({ params }, res) {
        // first we delete the comment
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No comment with this id!' });
                }
                // then we remove the comment from the pizza
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    // use the Mongo $pull operation, that removes something from an array.
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            // since we returned the found and updated pizza object, we are now working with dbPizzaData
            // we take the uodated pizza
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                // send the updated pizza back
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    }

};

module.exports = commentController;