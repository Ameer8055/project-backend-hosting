const express = require('express');
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const commentModel = require('../Model/commentData');

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

// POST route for adding a new comment
router.post('/comments',verifytoken, async (req, res) => {
    const { movieId, userId, text, userName } = req.body;
    try {
        const newComment = new commentModel({ movieId, userId, text , userName });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: 'Error saving comment', error });
    }
});

// DELETE route for deleting a comment by ID
router.delete('/comments/:id', verifytoken ,async (req, res) => {
    const { id } = req.params;
    try {
        const deletedComment = await commentModel.findByIdAndDelete(id);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error });
    }
});

// PUT route for updating a comment by ID
router.put('/comments/:id', verifytoken ,async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    try {
        const updatedComment = await commentModel.findByIdAndUpdate(id, { text }, { new: true });
        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error });
    }
});

// GET route for retrieving comments by movieId
router.get('/comments/:movieId', verifytoken,async (req, res) => {
    const { movieId } = req.params;
    try {
        const comments = await commentModel.find({ movieId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments', error });
    }
}); // Closing brace for GET route

module.exports = router; // Ensure to export the router
