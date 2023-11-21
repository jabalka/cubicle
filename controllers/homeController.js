const router = require('express').Router();

const asyncWrapper = require('../util/asyncWrapper');


router.get('/', (req, res) => res.redirect('/products'));

router.get('/about', asyncWrapper( async (req, res) => {
    res.render('about', {title: 'About'});
}));

router.all('*', (req, res) => {
    res.render('404', {title: 'Not Fount'});
});

module.exports = router;