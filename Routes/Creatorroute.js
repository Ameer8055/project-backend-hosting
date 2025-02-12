const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const creatorModel = require("../Model/usersData");
const videoModel = require("../Model/videoData");

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

//PARTICULAR UPLOADER
router.get('/uploader/:id',verifytoken ,async (req, res) => {
    try {
        const uploader = await creatorModel.findById(req.params.id);
        if (!uploader) {
            return res.status(404).json({ message: 'Uploader not found' });
        }
        res.status(200).json(uploader);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//ALL UPLOADER for admin
router.get('/uploaders', verifytoken,async (req, res) => {
    try {
        const uploaders = await creatorModel.find({ role: 'uploader' });
        if (!uploaders) {
            return res.status(404).json({ message: 'Uploaders not found' });
        }
        res.status(200).json(uploaders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
//VIDEO OF PARTICULAR UPLOADER
router.get('/uploader/:id/videos', verifytoken,async (req, res) => {
    try {
        const videos = await videoModel.find({ uploader: req.params.id });
        if (!videos || videos.length === 0) {
            return res.status(404).json({ message: 'No videos found for this uploader' });
        }
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
//DELETING VIDEO
router.delete('/video/:id', verifytoken,async (req, res) => {
    try {
        const deletedVideo = await videoModel.findByIdAndDelete(req.params.id);
        if (!deletedVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//UPDATING VIDEO
router.patch('/update/:id', verifytoken, async (req, res) => {
    try {
        const updatedData = req.body; // This includes thumbnail if provided
        const updatedVideo = await videoModel.findByIdAndUpdate(
            req.params.id, 
            updatedData, 
            { new: true }
        );

        if (!updatedVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.status(200).json(updatedVideo);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


module.exports = router;
