const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const adminModel = require('../Model/usersData');

const jwt=require('jsonwebtoken')
function verifytoken(req,res,next){
    let token=req.headers.token;
    try{
    if(!token) throw 'Unauthorized access';
    else{
        let payload=jwt.verify(token,'secretkey');
        if(!payload) throw 'Unauthorized access';
        next()
    }
}  catch(error) {
    console.log(error);

}
}

//BLOCKING A PARTICULAR USER
router.put('/user/:id/block',verifytoken ,async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await adminModel.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.blocked = user.blocked === 'yes' ? 'no' : 'yes';
        await user.save();

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send('Error updating user: ' + error.message);
    }
});

//DELETING A PARTICULAR USER
router.delete('/user/:id',verifytoken, async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await adminModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting user: ' + error.message);
    }
});

module.exports = router;
