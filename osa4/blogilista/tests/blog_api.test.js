const { test, after, beforeEach, describe } = require( 'node:test')
const mongoose = require( 'mongoose')
const supertest = require( 'supertest')
const app = require( '../app')
const assert = require( 'node:assert')
const Blog = require( '../models/blog')
const User = require( '../models/user')
//const helper = require('./test_helper')

const api = supertest(app)


const initialBlogs = [{title:"first initial",author:"Test author 1",url:"testurl.test.url",likes:10},
    {title:"second initial",author:"Test author 2",url:"test2url.test.url",likes:0}]

beforeEach(async ()=>{
    await Blog.deleteMany({})
    const res = await Blog.insertMany(initialBlogs)
    //console.log(res)
})

test('blogs are returned as json', async () => {
    //console.log('entered test')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, 2)
  })

test('id field is "id" and not _id', async () =>{
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


//TODO: TEST ACCOUNT LOGIN TOKEN
describe('adding blogs',()=>{
  test('succeed with valid data is added',async ()=>
  {
    const validBlog = {
      title: "valid title",
      url:"url.url",
      author:"succesful author",
      likes:5,
    }
    await api
      .post('/api/blogs')
      .send(validBlog)
      .expect(201)
    const res = await api.get('/api/blogs')
    assert.strictEqual(res.body.length, initialBlogs.length+1)
  })
  test('set likes to 0 if not defined in post req', async ()=>{
    await api.post('/api/blogs')
    .send({title:"Added blog no likes",author:"blog adder",url:"added.blog.test.1"})
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const res = await api.get('/api/blogs')
    assert.strictEqual(res.body[res.body.length-1].likes, 0)
})
  test('valid data in added blog and not null/undef.',async () =>
    {
        await api.post('/api/blogs')
        .send({title:"Adde blog",author:"blog adder", likes:0, url:"added.blog.test.1"})
        .expect(201)
        .expect('Content-Type', /application\/json/)
        
    
        const res = await api.get('/api/blogs')
        assert.strictEqual(res.body.length,initialBlogs.length+1)
        // check for total attribute count is 5
        assert.strictEqual(Object.keys(res.body[initialBlogs.length]).length,5)
        // check that no field is null or undefined
        assert.strictEqual(Object.entries(res.body[initialBlogs.length]).every((k)=>{return k[1]!==null && k[1]!==undefined}),true)
    })

//TODO: TEST ACCOUNT LOGIN TOKEN
  test('invalid data is not added', async () => {
    const newBlog = {
      //title: "title",
      url:"url.url",
      author:"succesful author",
      likes:50,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    let response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, initialBlogs.length)

    const newBlogNoUrl = {
        title: "title",
        //url:"url.url",
        author:"succesful author",
        likes:50,
      }
      await api
      .post('/api/blogs')
      .send(newBlogNoUrl)
      .expect(400)
  
    response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, initialBlogs.length)

      const newBlogNoUrlOrTitle = {
          //title: "title",
          //url:"url.url",
          author:"succesful author",
          likes:50,
        }
        await api
        .post('/api/blogs')
        .send(newBlogNoUrlOrTitle)
        .expect(400)
    
      response = await api.get('/api/blogs')
    
      assert.strictEqual(response.body.length, initialBlogs.length)

  })
})
describe('deleting blogs',()=>{
test('succeed with valid id ', async ()=>{
  let res= await api.get('/api/blogs')
  console.log(res.body[0].id)
  await api
    .delete('/api/blogs/'+res.body[0].id)
    .expect(204)

  res= await api.get('/api/blogs')

  assert.strictEqual(res.body.length, initialBlogs.length-1)

  })

test('fail with invalid id', async ()=>{

  await api
    .delete('/api/blogs/'+"invalid49589345")
    .expect(400)

  res= await api.get('/api/blogs')

  assert.strictEqual(res.body.length, initialBlogs.length)

  })
})

describe('editing blog',()=>{
  test.only("edit single blog",async()=>{
    let res = await api.get('/api/blogs')
    const originalTitle = res.body[0].title
    const editedBlog = res.body[0]
    editedBlog.title = originalTitle+" edited !"
    await api.put('/api/blogs/'+res.body[0].id)
      .send(editedBlog)
      .expect(200)

    res = await api.get(`/api/blogs/${editedBlog.id}`)
    assert.strictEqual(res.body.title, originalTitle+" edited !")
  })
  test.only("no difference",async()=>{
    let res = await api.get('/api/blogs')
    await api.put('/api/blogs/'+res.body[0].id)
    .send(res.body[0])
    .expect(200)
    
  })
  test.only("add a like to blog",async()=>{
    let res = await api.get('/api/blogs')
    const likes = res.body[0].likes
    const editedBlog = res.body[0]
    editedBlog.likes = likes+1
    await api.put('/api/blogs/'+res.body[0].id)
      .send(editedBlog)
      .expect(200)

    res = await api.get(`/api/blogs/${editedBlog.id}`)
    assert.strictEqual(res.body.likes, likes+1)
  })
})



describe.only('test user creation',()=>{
  const testUsernames = ['testuser1','testuser2','testuser3']
  beforeEach(async ()=>{
    const users = await User.find({})
    const filtered = users.filter((u)=>testUsernames.includes(u.username))
    for( let u of filtered){
      await User.findByIdAndDelete(u._id)
    }
    
  })
  test.only('creating testuser1',async ()=>{
    const testUser1 = {username:"testuser1",password:"test123"}
    const res = await api.post('/api/users').send(testUser1).expect(201)
    const users = await User.find({username:"testuser1"})
    assert.strictEqual(users.length, 1)
  })

  test.only('creating testuser2 with passworld too short',async ()=>{
    const testUser2 = {username:"testuser2",password:"p"}
    const res = await api.post('/api/users').send(testUser2).expect(400)
    console.log(res.body)
    const users = await User.find({username:"testuser2"})
    assert.strictEqual(users.length, 0)
  })

  test.only('creating user without username',async ()=>{
    const testUser1 = {username:"",password:"pass"}
    const testUser2 = {username:null,password:"pass"}
    const testUser3 = {username:undefined,password:"pass"}

    const usersInitial = await User.find({})

    let res = await api.post('/api/users').send(testUser1).expect(400)
    console.log(res.body)
    res = await api.post('/api/users').send(testUser2).expect(400)
    console.log(res.body)
    res = await api.post('/api/users').send(testUser3).expect(400)
    console.log(res.body)
    const users = await User.find({})

    assert.strictEqual(usersInitial.length, users.length)
  })

  
  test.only('creating user with existing username',async ()=>{
    const testUser1 = {username:"testuser1",password:"pass"}
    const testUser2 = {username:"testuser1",password:"pass"}
    const testUser3 = {username:undefined,password:"pass"}

    const usersInitial = await User.find({})

    let res = await api.post('/api/users').send(testUser1).expect(201)
    console.log(res.body)
    res = await api.post('/api/users').send(testUser2).expect(400)
    console.log(res.body)
    const users = await User.find({})

    assert.strictEqual(usersInitial.length+1, users.length)
  })
})

  after(async () => {
    await mongoose.connection.close()
  })
