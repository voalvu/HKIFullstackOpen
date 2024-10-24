// models/image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  imageData: { type: Buffer, required: true },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  }
});

imageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Image', imageSchema);
