const express = require('express');
const router = express.Router();
const continueWatchingModel = require('../Model/continueWatchingData');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

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

// POST route to add/update continue watching data
router.post('/continue-watching', verifytoken,async (req, res) => {
    const { user, video, progress, thumbnailUrl, title } = req.body;
    try {
        const existingEntry = await continueWatchingModel.findOne({ user, video });
        if (existingEntry) {
            existingEntry.progress = progress;
            await existingEntry.save();
            return res.status(200).json({ message: 'Progress updated successfully' });
        } else {
            const newEntry = new continueWatchingModel({ user, video, progress, thumbnailUrl, title });
            await newEntry.save();
            return res.status(201).json({ message: 'Continue watching entry created' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error saving continue watching data', error });
    }
});

// GET route to retrieve continue watching data for a user
router.get('/continue-watching/:userId',verifytoken, async (req, res) => {
    try {
        const data = await continueWatchingModel.find({ user: req.params.userId }).populate('video');
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving continue watching data', error });
    }
});

// DELETE route to remove a continue watching entry
router.delete('/continue-watching/:id', verifytoken,async (req, res) => {
    try {
        const deletedEntry = await continueWatchingModel.findByIdAndDelete(req.params.id);
        if (!deletedEntry) {
            return res.status(404).json({ message: 'Continue watching entry not found' });
        }
        return res.status(200).json({ message: 'Continue watching entry deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting continue watching data', error });
    }
});

module.exports = router;
