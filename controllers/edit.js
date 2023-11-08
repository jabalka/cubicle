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
            difficulty: Number(req.body.difficulty),
        };
        try {
            await req.storage.edit(req.params.id, cube);
            res.redirect("/details/" + req.params.id);
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
    },
};
