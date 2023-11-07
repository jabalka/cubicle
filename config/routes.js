
const { catalog } = require("../controllers/catalog");
const { about } = require("../controllers/about.js");
const { details } = require("../controllers/details.js");
const { create, post: createPost } = require("../controllers/create.js");
const { edit, post: editPost } = require("../controllers/edit");
const { notFound } = require("../controllers/notFound.js");

module.exports = (app) => {
    
    app.get("/", catalog);
    app.get("/about", about);
    app.get("/details/:id", details);
    app.get("/create", create);
    app.post("/create", createPost);

    app.get("/edit/:id", edit);
    app.post("/edit/:id", editPost);

    app.all("*", notFound);
};