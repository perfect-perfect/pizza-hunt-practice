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