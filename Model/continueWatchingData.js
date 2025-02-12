const mongoose = require('mongoose');

const continueWatchingSchema = mongoose.Schema(
    {
        user: { type:String, required: true },
        video: { type: String, required: true },
        progress: { type: Number, required: true, min: 0, max: 100 },
        timestamp: { type: Date, default: Date.now },
        thumbnailUrl: { type: String , required:true},
        title:{type:String , required:true}
    },
    { timestamps: true }
);

module.exports = mongoose.model('ContinueWatching', continueWatchingSchema);
