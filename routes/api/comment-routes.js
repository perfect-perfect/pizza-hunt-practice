const router = require('express').Router();

const {
    addComment,
    removeComment,
    addReply,
    removeReply
} = require('../../controllers/comment-controllers');

// api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// api/comments/<pizzaId>/<commentId>
// why two parameters to delete a comment?
//  - after deleting a particular comment, you need to know which pizza that comment originated from.
router.route('/:pizzaId/:commentId')
    // remember that the callback function of a route method has 'req' and 'res' as parameters, so we don't have to explicitly pass any arguments to 'addReply'
    // this is a PUT route, instead of a POST because technically we're not creating a new reply source, we're just updating the existing comment resource.
    .put(addReply)
    .delete(removeComment);
// .delete(removeReply) requires the specific replyId so it needs a route containing it. 
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);
module.exports = router;