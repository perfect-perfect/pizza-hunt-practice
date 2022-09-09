const router = require('express').Router();

// instead of importing the entire object and having to do 'pizzaController.getAllPizza()' we can simply destructure the method names out of the imported object and use those names directly
const {
    getAllPizza,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
} = require('../../controllers/pizza-controllers');

// set up GET all and POST at /api/pizzas
router
    .route('/')
    // see how we simply provide the name of the controller method as the callback
    //  - that's why we set up those methods to accept 'req' and 'res' parameters.
    .get(getAllPizza)
    .post(createPizza);

// set up GET one, PUT, and DELETE at /api/pizzas/:id
router
    .route('/:id')
    .get(getPizzaById)
    .put(updatePizza)
    .delete(deletePizza);


// this code
// router.route('/').get(getCallbackFunction).post(postCallbackfunction);

// is the same as this
// router.get('/', getCallbackFunction);
// router.post('/', postCallbackFunction)

// Becaue we aren't actually writting the route functionality, this will keep the route files a lot cleaner and to the point.
module.exports = router;