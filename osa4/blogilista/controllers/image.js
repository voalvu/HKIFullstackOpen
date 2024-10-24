const imageRouter = require('express').Router();
const Image = require('../models/image.js');
const jwt = require('jsonwebtoken');
const userExtractor = require("../utils/middleware.js").userExtractor;


imageRouter.post('/', userExtractor, async (request, response) => {
  try {
    let { filename, fileType, fileSize, imageData, blog } = request.body;
    console.log(imageData)
    imageData = imageData.split(',')[1]
    console.log(imageData)
    const image = new Image({
      filename,
      fileType,
      fileSize,
      imageData,
      blog,
    });

    await image.save();
    response.status(201).json(image);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Error creating image' });
  }
});

imageRouter.get('/', async (request, response) => {
  
    const images_res = await Image.find({})
    response.status(200).json(images_res);
});

imageRouter.get('/:id', async (request, response) => {
  try {
    const img = await Image.findById(request.params.id);

    if (!img) {
      return response.status(404).json({ error: 'Image not found' });
    }

    // Set the content type based on the stored file type
    response.set('Content-Type', img.fileType);

    // Check if imageData is a Buffer or a base64 string
    if (img.imageData instanceof Buffer) {
      // Send the image data directly if it's a Buffer
      response.send(img.imageData);
    } else {
      // If it's a base64 string, decode it
      try {
        const base64Data = img.imageData.toString(); // Convert to string if it's a Buffer
        const imgBuffer = Buffer.from(base64Data, 'base64'); // Decode base64 to Buffer
        
        console.log("base64Data",base64Data)
        response.send(imgBuffer);
      } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'An error occurred while decoding the image data' });
      }
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'An error occurred while fetching the image' });
  }
});

module.exports = imageRouter;