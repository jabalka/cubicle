const { Router } = require('express');
const { isGuest, isAuth, isOwner } = require('../middlewares/gueards');
const { preloadCube } = require('../middlewares/preload');

const router = Router();

router.get('/', async (req, res) => {
    const cubes = await req.storage.getAll(req.query);

    const ctx = {
        title: "Cubicle",
        cubes,
        search: req.query.search || '',
        from: req.query.from || '',
        to: req.query.to || ''
    };

    res.render("index", ctx);
});

router.get('/create', isAuth(), (req, res) => {
    res.render('create', {title: 'Create Cube'});
});

router.post('/create', isAuth(), async (req, res)  => {
    const cube = {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        difficulty: Number(req.body.difficulty),
        author: req.user._id
    };

    try{
        await req.storage.create(cube);
    } catch(err){
        if(err.name == 'ValidationError'){
            return res.render('create', {title: 'Create Cube', error: 'All fields are required! Image URL must be a valid URL'});
        }
    }
    res.redirect('/');
});

router.get('/details/:id', preloadCube(), async (req, res) => {
    const cube = req.data.cube;

    if(cube == undefined){
        res.redirect('/404');
    } else {
        cube.isOwner = req.user && (cube.authorId == req.user._id);
        cube.isUser = req.user;

        const ctx = {
            title: 'Cubicle',
            cube,
        };
        res.render('details', ctx);
    }
});

router.get('/edit/:id', preloadCube(), isOwner(), async (req, res) => {
    const cube = req.data.cube;
    
    if (!cube) {
        res.redirect("/404");
    } else {
        cube[`select${cube.difficulty}`] = true;
        const ctx = {
            title: "Edit Cube",
            cube,
        };
        res.render("edit", ctx);
    }
});

router.post('/edit/:id', preloadCube(), isOwner(), async(req, res) => {
    const cube = {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        difficulty: Number(req.body.difficulty),
    };
    try {
        await req.storage.edit(req.params.id, cube);
        res.redirect("/products/details/" + req.params.id);
    } catch (err) {
        if (err.name == "ValidationError") {
            const cube = await req.storage.getById(req.params.id);
            cube[`select${cube.difficulty}`] = true;
            cube.name = req.body.name;
            cube.description = req.body.description;
            cube.imageUrl = req.body.imageUrl;
            cube.difficulty = Number(req.body.difficulty);
            const ctx = {
                title: "Edit Cube",
                error: "All fields are required! Image URL must be a valid URL",
                cube,
            };
            return res.render("edit", ctx);
        }
    }
});

router.get('/attach/:cubeId', async(req, res) => {
    const cube = await req.storage.getById(req.params.cubeId);
    const accessories = await req.storage.getAllAccessories((cube.accessories || []).map(a => a._id));
    res.render('attach', {
        title:'Attach Stickers',
        cube,
        accessories
    });
});
router.post('/attach/:cubeId', async(req, res) => {
    const cubeId = req.params.cubeId;
    const stickerId = req.body.accessory;

    await req.storage.attachSticker(cubeId, stickerId);
    
    res.redirect(`/products/details/${cubeId}`);
})




module.exports = router;