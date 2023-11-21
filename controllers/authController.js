const router = require("express").Router();

const { body, validationResult } = require("express-validator");

const { isGuest, isAuth } = require("../middlewares/gueards");

// ---------- guards implemented isGuest(), isAuth() -------------
router.get("/register", isGuest(), (req, res) => {
    res.render("register", { title: "Register" });
});

router.post(
    "/register",
    isGuest(), // .bail() stops the validations if the previous returns false
    body("username", 'Username must be at least 5 characters long and contain only alphanumeric chars!').trim().isLength({ min: 5 }).bail().isAlphanumeric(),
    body("password", 'Password must be at least 5 characters long and contain only alphanumeric chars!').trim().isLength({ min: 8 }).isAlphanumeric(),
    body("repeatPassword")
        .trim()
        .custom((value, { req }) => {
            if(value != req.body.password){
                throw new Error('Passwords don\'t match!');
            }
            return true;
        }),
    async (req, res) => {
        try {
            const errors = Object.values(validationResult(req).mapped());
            if(errors.length > 0){
                throw new Error(errors.map(e => e.msg).join('\n'));
            }
            await req.auth.register(req.body);
            res.redirect("/products");
        } catch (err) {
            const ctx = {
                title: "Register",
                errors: err.message.split('\n'),
                data: { username: req.body.username },
            };
            res.render("register", ctx);
        }
    }
);

router.get("/login", isGuest(), (req, res) => {
    res.render("login", { title: "Login" });
});

router.post("/login", isGuest(), async (req, res) => {
    try {
        await req.auth.login(req.body);
        res.redirect("/products");
    } catch (err) {
        const ctx = {
            title: "Login",
            error: err.message,
            data: { username: req.body.username },
        };
        res.render("login", ctx);
    }
});

router.get("/logout", isAuth(), (req, res) => {
    req.auth.logout();
    res.redirect("/products");
});

module.exports = router;
