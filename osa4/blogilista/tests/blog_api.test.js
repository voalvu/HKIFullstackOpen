const { test, after, beforeEach } = require( 'node:test')
const mongoose = require( 'mongoose')
const supertest = require( 'supertest')
const app = require( '../app')
const assert = require( 'node:assert')
const Blog = require( '../models/blog')
//const helper = require('./test_helper')

const api = supertest(app)

const initialBlogs = [{author:"Test author 1",url:"testurl.test.url",likes:10},
    {author:"Test author 2",url:"test2url.test.url",likes:0}]

beforeEach(async ()=>{
    await Blog.deleteMany({})
    const res = await Blog.insertMany(initialBlogs)
    console.log(res)
})

test.only('blogs are returned as json', async () => {
    console.log('entered test')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, 2)
  })

test.only('id field is "id" and not _id', async () =>{
    const res = await api
    .get('/api/blogs')
    .expect(200)

    // this is probably not great perfomance wise ?
/*     const truths = [];
    res.body.forEach((blog)=>truths.push(mongoose.isValidObjectId(blog.id) && !blog.hasOwnProperty("_id")))
    for(let t of truths){
        assert.strictEqual(true, t)
    }
 */
    // probably better for performance if there was a lot of blogs
    const allValid = res.body.every(blog => 
        mongoose.isValidObjectId(blog.id) && !blog.hasOwnProperty("_id")
    );

    assert.strictEqual(allValid, true);
})
  after(async () => {
    await mongoose.connection.close()
  })