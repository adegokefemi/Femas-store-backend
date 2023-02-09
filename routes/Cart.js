const router = require("express").Router();
const Cart = require("../models/Cart");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


// CREATE
// Anyone can see the cart, no need for verify.
router.post("/", async (req, res) => {
    const newCart = Cart (req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status.apply(500).json(err);
    }
})

// UPDATE
// Admin can update the cart, user can also update it's cart also.
router.put("/:id", verifyTokenAndAuthorization, async (req, res)=> {
    try {
        const updatedCart = await User.findByIdAndUpdate(
            req.params.id,
            {
                // This is used to set the new request in the body with new: true, added.
                $set: req.body,
            },
            {new: true }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE 
// Both the Admin and User can delete their carts.
router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try {
        await Cart.findOneAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted...");
    } catch (err) {
        res.status(500).json(err)
    }
});

// Get User Cart
// Both admin and user can get the cart.
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findById({ userId: req.params.userId});
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all Cart
// Only admin we get all cart
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
    
});

module.exports = router;