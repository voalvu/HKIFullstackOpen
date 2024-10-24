const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app'); // Ensure this is your Express app
const assert = require('node:assert');
const Image = require('../models/image'); // Assuming you have an Image model defined
const fs = require('fs');
const path = require('path');
const axios = require('axios')
const api = supertest(app);

beforeEach(async () => {
    await Image.deleteMany({}); // Clear the Image collection before each test
});

describe('img_test', () => {
    test('should save an image to the database', async () => {
        
                // Read the image file from the local filesystem
                const imagePath = path.join(__dirname, 'sample.jpg'); // Update with the correct path to your image
                const imageBuffer = fs.readFileSync(imagePath);

        const base64string = '...'; // Replace with your actual base64 string
        const buffer = Buffer.from(base64string, 'base64');
        const blogs = await api.get('/api/blogs')
        console.log(blogs.body[0])
        const img = new Image({
            filename: 'first-image',
            fileType: 'image/jpeg', // Specify the correct file type
            imageData: imageBuffer,
            fileSize: imageBuffer.length,
            blog:blogs.body[0].id
        }); 

/*         const image = new Image({
            filename,
            fileType,
            fileSize,
            imageData,
            blog,
          }); */

        const result = await img.save();
        assert.ok(result._id); // Check that the image was saved and has an ID
        console.log('img saved!');
        const imgs = await api.get("/api/images")

        const fetchedImageData = imgs.body[0].imageData; // Adjust this if the structure is different
        const fetchedImageBuffer = Buffer.from(fetchedImageData, 'base64'); // 
        fs.writeFile(path.join(__dirname,"fetched.jpg"),fetchedImageBuffer, (err)=>{
            if(err){
                console.log(err)
            }else{
                console.log("saved fetched image")
            }
        })
        
    });

    test('should retrieve an image by ID', async () => {
                // Read the image file from the local filesystem
                const imagePath = path.join(__dirname, 'sample.jpg'); // Update with the correct path to your image
                const imageBuffer = fs.readFileSync(imagePath);
        const blogs = await api.get('/api/blogs')
        console.log(blogs.body[0])
        const img = new Image({
            filename: 'first-image',
            fileType: 'image/jpeg', // Specify the correct file type
            imageData: imageBuffer,
            fileSize: imageBuffer.length,
            blog:blogs.body[0].id
        });

        const savedImg = await img.save();


        const response = await api.get(`/api/images/${savedImg._id}`).expect(200);
        console.log(response.body)
        assert.deepStrictEqual(response.body.filename, 'first-image');
    });

    test('should return 404 for non-existing image', async () => {
        const nonExistingId = '688872f1f1d1c2b1f8e4e1e1' //605c72f1f1d1c2b1f8e4e1e1'; // Replace with a valid ObjectId format
        const res = await api.get(`/api/images/${nonExistingId}`)
        assert.strictEqual(res.body,null)
    });
});

// Clean up after tests
after(async () => {
    await mongoose.connection.close();
});
