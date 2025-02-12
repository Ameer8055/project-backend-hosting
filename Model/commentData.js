const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    movieId: { type: String, required: true },
    userId: { type: String ,required: true },
    userName : {type : String, require:true},
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", commentSchema);
