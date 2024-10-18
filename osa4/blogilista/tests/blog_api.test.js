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

let loginRes;

beforeEach(async ()=>{
    await Blog.deleteMany({})
    const res = await Blog.insertMany(initialBlogs)
    const users = await User.find({})
    const filtered = users.filter(u => u.username === "testguy")
    if(filtered.length===0)
      await api.post('/api/users').send({"username":"testguy","password":"testguy"})

    loginRes = await api.post('/api/login').send({"username":"testguy","password":"testguy"}).expect(200)
    console.log("LOOOOOOOOOOOG")
    console.log(loginRes.body.token)
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
describe.only('adding blogs',()=>{
    test.only('succeed with valid data is added',async ()=>
  {
    const validBlog = {
      title: "valid title",
      url:"url.url",
      author:"succesful author",
      likes:5,
    }
    await api
      .post('/api/blogs').set('Authorization',`Bearer ${loginRes.body.token}`)
      .send(validBlog)
      .expect(201)
    const res = await api.get('/api/blogs')
    assert.strictEqual(res.body.length, initialBlogs.length+1)
  })
  test.only('set likes to 0 if not defined in post req', async ()=>{
    await api.post('/api/blogs').set('Authorization',`Bearer ${loginRes.body.token}`)
    .send({title:"Added blog no likes",author:"blog adder",url:"added.blog.test.1"})
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const res = await api.get('/api/blogs')
    assert.strictEqual(res.body[res.body.length-1].likes, 0)
})
  test.only('valid data in added blog and not null/undef.',async () =>
    {
        await api.post('/api/blogs').set('Authorization',`Bearer ${loginRes.body.token}`)
        .send({title:"Adde blog",author:"blog adder", likes:0, url:"added.blog.test.1"})
        .expect(201)
        .expect('Content-Type', /application\/json/)
        
    
        const res = await api.get('/api/blogs')
        assert.strictEqual(res.body.length,initialBlogs.length+1)
        // check for total attribute count is 5
        assert.strictEqual(Object.keys(res.body[initialBlogs.length]).length,6)
        // check that no field is null or undefined
        assert.strictEqual(Object.entries(res.body[initialBlogs.length]).every((k)=>{return k[1]!==null && k[1]!==undefined}),true)
    })

//TODO: TEST ACCOUNT LOGIN TOKEN
  test.only('invalid data is not added', async () => {
    const newBlog = {
      //title: "title",
      url:"url.url",
      author:"succesful author",
      likes:50,
    }
  
    await api
      .post('/api/blogs').set('Authorization',`Bearer ${loginRes.body.token}`)
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
      .post('/api/blogs').set('Authorization',`Bearer ${loginRes.body.token}`)
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
        .post('/api/blogs').set('Authorization',`Bearer ${loginRes.body.token}`)
        .send(newBlogNoUrlOrTitle)
        .expect(400)
    
      response = await api.get('/api/blogs')
    
      assert.strictEqual(response.body.length, initialBlogs.length)

  })

  test.only('blog with invalid token is rejected', async()=>{
    const newBlogBadToken = {
      title: "blog with bad token",
      url:"url.url",
      author:"succesful author",
      likes:50,
    }
    // No token
      await api.post('/api/blogs').send(newBlogBadToken).expect(401)

    // Wrong token
      await api.post('/api/blogs').set('Authorization',`Bearer ${loginRes.body.token}a`).send(newBlogBadToken).expect(401)

    // Good token
      await api.post('/api/blogs').set('Authorization',`Bearer ${loginRes.body.token}`).send(newBlogBadToken).expect(201)
  })
})


describe.only('deleting blogs',()=>{
test.only('fail deleting blog with different user token ', async ()=>{
  let res= await api.get('/api/blogs')
  await api
    .delete('/api/blogs/'+res.body[0].id).set('Authorization',`Bearer ${loginRes.body.token}`)
    .expect(403)

  res= await api.get('/api/blogs')

  assert.strictEqual(res.body.length, initialBlogs.length)

  })

test.only('fail with invalid id', async ()=>{

  await api
    .delete('/api/blogs/'+"invalid49589345").set('Authorization',`Bearer ${loginRes.body.token}`)
    .expect(400)

  res= await api.get('/api/blogs')

  assert.strictEqual(res.body.length, initialBlogs.length)

  })
})

describe.only('editing blog',()=>{
  test.only("edit single blog",async()=>{
    let res = await api.get('/api/blogs')
    const originalTitle = res.body[0].title
    const editedBlog = res.body[0]
    editedBlog.title = originalTitle+" edited !"
    await api.put('/api/blogs/'+res.body[0].id).set('Authorization',`Bearer ${loginRes.body.token}`)
      .send(editedBlog)
      .expect(200)

    res = await api.get(`/api/blogs/${editedBlog.id}`)
    assert.strictEqual(res.body.title, originalTitle+" edited !")
  })
  test.only("no difference",async()=>{
    let res = await api.get('/api/blogs')
    await api.put('/api/blogs/'+res.body[0].id).set('Authorization',`Bearer ${loginRes.body.token}`)
    .send(res.body[0])
    .expect(200)
    
  })
  test.only("add a like to blog",async()=>{
    let res = await api.get('/api/blogs')
    const likes = res.body[0].likes
    const editedBlog = res.body[0]
    editedBlog.likes = likes+1
    await api.put('/api/blogs/'+res.body[0].id).set('Authorization',`Bearer ${loginRes.body.token}`)
      .send(editedBlog)
      .expect(200)

    res = await api.get(`/api/blogs/${editedBlog.id}`)
    assert.strictEqual(res.body.likes, likes+1)
  })
})



describe('test user creation',()=>{
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
    const users = await User.find({username:"testuser2"})
    assert.strictEqual(users.length, 0)
  })

  test.only('creating user without username',async ()=>{
    const testUser1 = {username:"",password:"pass"}
    const testUser2 = {username:null,password:"pass"}
    const testUser3 = {username:undefined,password:"pass"}

    const usersInitial = await User.find({})

    let res = await api.post('/api/users').send(testUser1).expect(400)
    res = await api.post('/api/users').send(testUser2).expect(400)

    res = await api.post('/api/users').send(testUser3).expect(400)
    const users = await User.find({})

    assert.strictEqual(usersInitial.length, users.length)
  })

  
  test.only('creating user with existing username',async ()=>{
    const testUser1 = {username:"testuser1",password:"pass"}
    const testUser2 = {username:"testuser1",password:"pass"}
    const testUser3 = {username:undefined,password:"pass"}

    const usersInitial = await User.find({})

    let res = await api.post('/api/users').send(testUser1).expect(201)
    res = await api.post('/api/users').send(testUser2).expect(400)
    const users = await User.find({})

    assert.strictEqual(usersInitial.length+1, users.length)
  })
})

  after(async () => {
    await mongoose.connection.close()
  })
