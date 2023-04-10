 const router = require("express").Router();
 const User = require("../models/User");
 const CryptoJS = require("crypto-js");
 const jwt = require("jsonwebtoken");
 

 // REGISTER
 router.post("/register", async (req, res) => {
    const newUser = User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC
        ).toString(),
    });

    // the function below save the User in the DB
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
 });

 // LOGIN
 router.post("/login", async (req, res) => {

    // async/await is used when try/catch is implemented.
    try {
        const user = await User.findOne({ username: req.body.username })
        !user && res.status(401).json("Wrong Credentials!")

        const originalPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)
        .toString(CryptoJS.enc.Utf8);
        originalPassword !== req.body.password && res.status(401).json("Wrong Credentials!");

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn: "3d"}
        );
        // user is destructure below to hide the password & _doc is pass to user to remove other uuneeded details.
        const { password, ...others } = user._doc;

        // If everything is okay return the function below
        res.status(200).json({...others, accessToken});

        } catch (err) {
        res.status(500).json(err);
        }
    });

module.exports = router;