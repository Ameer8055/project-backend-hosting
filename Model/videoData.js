const mongoose = require('mongoose')

const videoSchema = mongoose.Schema(
    {
      title: { type: String, required: true },
      description: { type: String },
      uploader:{type:String},
      videoUrl: { type: String, required: true },
      thumbnailUrl: { type: String ,required :true},
      director:{type:String},
      year:{type:Number},
      genre: { type: String },
      views: { type: Number, default: 0 },
      price:{ type:String, enum:['free','paid'],default:'free'},
      blocked:{type:String,enum:['Yes','No'],default:'No'},
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('Video', videoSchema);
  