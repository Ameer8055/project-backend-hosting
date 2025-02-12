const express = require("express");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const jwt = require("jsonwebtoken");

const userModel = require("../Model/usersData");

//SIGN UP
router.post("/create", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await userModel.create({ name, email, password, role });
    res.status(201).json({ message: "user created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const user = await userModel.findOne({ email: req.body.Email });
  if (!user) {
    return res.status(400).json({ message: "not found" });
  }

  try {
    if (user.password === req.body.password) {
      const payload = { Email: user.email, password: user.password };
      const token = jwt.sign(payload, "secretkey");
      return res.status(200).send({ user: user, token: token });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Invalid Login" });
  }
});

  
// Update Subscription
router.put("/update-subscription/:id", async (req, res) => {
    try {
        const { subscription } = req.body; // Get the subscription type from the request body
        const userId = req.params.id; // Get the user ID from the URL parameters

        // Update the user's subscription
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { subscription },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router ;