const router = require("express").Router();
const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


// CREATE
// Anyone can see the cart, no need for verify.
router.post("/", async (req, res) => {
    const newOrder = Order (req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
})

// UPDATE
// Only Admin can update the order
router.put("/:id", verifyTokenAndAdmin, async (req, res)=> {
    try {
        const updatedOrder = await User.findByIdAndUpdate(
            req.params.id,
            {
                // This is used to set the new request in the body with new: true, added.
                $set: req.body,
            },
            {new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE 
// Only Admin can Delete Order
router.delete("/:id", verifyTokenAndAdmin, async (req, res)=>{
    try {
        await Order.findOneAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...");
    } catch (err) {
        res.status(500).json(err)
    }
});

// Get User Order
// Both admin and user can get the order.
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId});
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all Order
// Only admin can get all Order.
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
    
});

// Get Monthly Income
// Only Admin can get the income.
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    // This set the currentDate
    const date = new Date();
    // If it's 1st of September, it will output 1st of August because of the -1 in the function.
    const lastMonth = new Date(date.setMonth(date.getMonth() -1));
       // If it's 1st of August, it will output 1st of July because of the -1 in the function.
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth}}},
            {
               $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
              },
            },   
            {
                 $group: {
                    _id: "$month",
                    total: {$sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;