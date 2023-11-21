const { post: commentPost } = require("../controllers/comments.js");

const productController = require('../controllers/productController.js');
const accessoryController = require('../controllers/accessoryController.js');
const homeController = require('../controllers/homeController.js');
const authController = require('../controllers/authController.js');
const { isAuth } = require("../middlewares/gueards.js");

module.exports = (app) => {

    app.use('/products', productController);
    app.use('/accessory', accessoryController);
    app.use('/auth', authController);

    app.post("/comments/:cubeId/create", isAuth(), commentPost);

    app.use('/', homeController);
    // catches only synchornised errors!!!
// if there are 4 params then the error always is the first param
// since the error pass all the other middlewares it can be catched lastly here
    app.use((err, req, res, next) => {
        console.log('-------',err.message);

        res.status(500).send('Somehing happened!');
    });
};
