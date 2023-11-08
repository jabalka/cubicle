module.exports = {
    async edit(req, res) {
        const cube = await req.storage.getById(req.params.id);
        cube[`select${cube.difficulty}`] = true;

        if (!cube) {
            res.redirect("404");
        } else {
            const ctx = {
                title: "Edit Cube",
                cube,
            };
            res.render("edit", ctx);
        }
    },
    async post(req, res) {
        const cube = {
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            difficulty: Number(req.body.difficulty)
        };
        try{
            await req.storage.edit(req.params.id, cube);
            res.redirect("/");
        } catch(err) {
            // error occurs when trying to render the page as the cube can not be shown
            if(err.name == 'ValidationError'){
                const ctx = {
                    title: 'Edit Cube',
                    error: 'All fields are required! Image URL must be a valid URL',
                    cube
                };
                res.render('edit', {... ctx, id: req.params.id});
                // return res.redirect('edit/'+ req.params.id);
            };
        }
        //         const cubeId = req.params.cubeId

    },
};
