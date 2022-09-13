const router = require('express').Router();

const {
    addComment,
    removeComment
} = require('../../controllers/comment-controllers');

// api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// api/comments/<pizzaId>/<commentId>
// why two parameters to delete a comment?
//  - after deleting a particular comment, you need to know which pizza that comment originated from.
router.route('/:pizzaId/:commentId').delete(removeComment);

module.exports = router;