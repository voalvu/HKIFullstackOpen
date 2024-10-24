import { useState, useEffect } from 'react'
import './App.css'
import blogService from './services/blogService'
import AddBlogPopup from './components/AddBlogPopup';
import EditBlogPopup from './components/EditBlogPopup';

import loginService from './services/login'
import imageService from './services/imageService'

function App() {
  const [blogs, setBlogs] = useState([])
  const [blogsLiked, setBlogsLiked] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successNotification, setSuccessNotification] = useState(null)
  const [errorNotification, setErrorNotification] = useState(null)
  const [singleBlog, setSingleBlog] = useState(null)
  const [addEntryOpen, setAddEntryOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [newBlogEntry, setNewBlogEntry] = useState(null)
  const [registerFormOpen, setRegisterFormOpen] = useState(false)
  
  useEffect(() => {
    console.log('running blogs getAll effect')
    blogService.getAll()    
      .then(res => {        
        console.log('blogs getAll promise fulfilled')
        //console.log(res.data)   
        setBlogs(res.data)      
      })
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
      }},
      [])
/*   useEffect(() => {
    console.log('blog clicked')
    
  }, [singleBlog]) */

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      console.log(user)
      setUsername('')
      setPassword('')

      setSuccessNotification({message:"Logged in"})
      setTimeout(() => {
        setSuccessNotification(null)
      }, 5000)
    } catch (exception) {
      setErrorNotification({message:exception.response.data.error})
      setTimeout(() => {
        setErrorNotification(null)
      }, 5000)
    }
  }

const removeOne = (blog) => {
  if (window.confirm('Are you sure you want to delete this blog?')) {

  blogService.removeOne(blog, user)
    .then(() => {
      setBlogs(blogs.filter(b => b.id !== blog.id))
    })
  }
}

const addLike = (blog) =>{
  console.log(blogsLiked)
  console.log("adding like")
  const editedBlog = { ...blog, likes: blog.likes + 1 };
  console.log(editedBlog)
  blogService.editBlog(blog, editedBlog, user)
    .then((res) => {
      console.log(res.data)
      setBlogs(blogs.map(b => b.id === blog.id ? res.data : b));
      console.log('setting likes')
      setBlogsLiked(blogsLiked.concat(blog.id))
    });

}

const removeLike = (blog)=>{
  console.log(blogsLiked)
  console.log("removing like")
  const editedBlog = { ...blog, likes: blog.likes - 1 };
  blogService.editBlog(blog, editedBlog, user)
    .then((res) => {
      console.log(res.data)
      setBlogs(blogs.map(b => b.id === blog.id ? res.data : b));
      console.log('setting likes')
      setBlogsLiked(blogsLiked.filter(b => b !== blog.id))
    });
}

const loginForm = () => (
  <form onSubmit={handleLogin}>
    <div>
      username
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
        <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>     
)

const handleRegister = async (event) => {
  setRegisterFormOpen(true)
  event.preventDefault()
  console.log('logging in with', username, password)

  try {
    const user = await loginService.login({
      username, password,
    })

    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    ) 
    blogService.setToken(user.token)
    setUser(user)
    console.log(user)
    setUsername('')
    setPassword('')

    setSuccessNotification({message:"Logged in"})
    setTimeout(() => {
      setSuccessNotification(null)
    }, 5000)
  } catch (exception) {
    setErrorNotification({message:exception.response.data.error})
    setTimeout(() => {
      setErrorNotification(null)
    }, 5000)
  }
}

const registerForm = () => (
  <form onSubmit={handleRegister}>
  <div>
    username
      <input
      type="text"
      value={username}
      name="Username"
      onChange={({ target }) => setUsername(target.value)}
    />
  </div>
  <div>
    password
      <input
      type="password"
      value={password}
      name="Password"
      onChange={({ target }) => setPassword(target.value)}
    />
  </div>
  <button type="submit">login</button>
</form> 
)

const registerButton = () => (
  <button onClick={()=>setRegisterFormOpen(true)}> register </button>
)
 
const handleLogout = () =>{
  setUser(null)
  window.localStorage.removeItem('loggedBlogappUser')
  setSuccessNotification({message:"Logged out"})
  setTimeout(() => {
    setSuccessNotification(null)
  }, 5000)
}

const logoutButton = () => (
  <form onSubmit={handleLogout}>
    <button type="submit">log out</button>
  </form>      
)

const Notification = ({ message, notifType}) =>{
  return (<div className={notifType}><h2>{message}</h2></div>)
}

const handleLink = (blog) => {
  console.log("HAnLGIN SINGEL BLOG")
  console.log(blog)
  setSingleBlog(blog)
}



const BlogEntryForm = () => {
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingGif, setLoadingGif] = useState(false);

  const handleNewBlogEntry = async (event) => {
    event.preventDefault();

    if (!image) {
      console.error('No image selected');
      setErrorNotification({message:'No image selected. (you must add img to ur blog entry ;) )'})
      setTimeout(() => {
        setErrorNotification(null)
      }, 5000)
      return; // Exit if no image is selected
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      const imageData = e.target.result; // This is the base64-encoded image data
      try {
        setLoadingGif(true);
        // Prepare the image object to send to the backend
        const imageResponse = await imageService.addOne(singleBlog, {
          name: image.name,
          type: image.type,
          size: image.size,
          data: imageData, // Send the base64 image data
        }, user);
        // Create the new blog entry
        const newEntry = {
          subtitle: subtitle,
          content: content,
          image: imageResponse ? imageResponse.data.id : null, // Store the image ID in the blog entry
        };

        const newSingleBlog = { ...singleBlog };
        console.log("new single blog")
        console.log(newSingleBlog,user)
        newSingleBlog.entries = newSingleBlog.entries.concat(newEntry);
        setLoadingGif(true);
        const editedResponse = await blogService.editBlog(singleBlog, newSingleBlog, user);
        console.log(editedResponse.body, editedResponse.data);
        //const updatedBlog = await blogService.getOne(newSingleBlog.id)
        //setSingleBlog(newSingleBlog);
        setSingleBlog(blogs.filter(blog => singleBlog.id===blog.id)[0])
        console.log('changed single blog to have new entry');
        setSubtitle('');
        setContent('');
        setImage(null);
        setAddEntryOpen(false);
        console.log('reset the entry state vars');
      } catch (error) {
        console.error('Error uploading image or creating blog entry:', error);
      } finally {
        setLoadingGif(false); // Set the loading GIF to false after the operation is complete
        setSuccessNotification({message:"hurray! new blog entry added :)"})
        setTimeout(() => {
          setSuccessNotification(null)
        }, 5000)
      }
    };

    // Read the image file as a data URL (base64)
    reader.readAsDataURL(image);
  };

  useEffect(() => {
    console.log("SINGLE BLOG HAS CHANGED","SINGLE BLOG HAS CHANGED","SINGLE BLOG HAS CHANGED","SINGLE BLOG HAS CHANGED","SINGLE BLOG HAS CHANGED")
  }, [singleBlog]);

  return (

    <form onSubmit={handleNewBlogEntry}>
      <div>
        <label>Subtitle</label>
        <input
          type="text"
          value={subtitle}
          name="Subtitle"
          onChange={({ target }) => setSubtitle(target.value)}
        />
      </div>
      <div>
        <label>Content</label>
        <textarea
          value={content}
          name="Content"
          width="256"
          height="135"
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>
      <div>
        <input
          type="file"
          name="image"
          onChange={({ target }) => {
            console.log(target, target.files);
            setImage(target.files[0]);
          }}
        />
        {image && <p>Selected file: {image.name}</p>}
        {imageUrl && <img src={imageUrl} alt="Uploaded" />}
        <div>
  <img
    style={loadingGif ? { display: "block" } : { display: "none" }}
    src="https://media.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif"
    alt="Loading..."
  />
</div>
      </div>
      <button type="submit">Add Entry</button>
    </form>
  );
};


const singleBlogView = () => {
  return (
    
    <div className="single-blog-container">
      <button className="back-button" onClick={() => { setSingleBlog(null) }}> go back</button>
      <h1>{singleBlog.title}</h1>

      <p>by {singleBlog.author}</p>
      {console.log("entries",singleBlog.entries)}

      {
        (singleBlog.entries.length > 0 && singleBlog.entries.filter(e=>e!==null).length>0) &&
        singleBlog.entries.filter(e=>e!==null).map((blogEntry) => {
          const date = new Date(blogEntry.date);
          const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
          const formattedTime = `${date.getHours()}:${date.getMinutes()}`;
         /*  console.log(blogEntry.image) */
          /* blogEntry.image ? await imageService.getOne(blogEntry.image.id) : null */
          return (
            <div className="blog-entry" key={blogEntry._id}>
              <div className="blog-entry-content">
              {console.log("FIANL CLUE",blogEntry.image.imageData)}
              {blogEntry.image && (
              <img
              src={`data:${blogEntry.image.fileType};base64,${blogEntry.image.imageData}`}
              />
)}

    {/* Other blog entry content */}
  </div>
              <div className="blog-entry-date-time">
                <p className="blog-entry-date">{formattedDate}</p>
                <p className="blog-entry-time">{formattedTime}</p>
              </div>
            </div>
          )
        })
      } 
      {singleBlog.user && singleBlog.user.username === user.username && <button onClick={()=>setAddEntryOpen(true)}>Add entry</button>}
      {addEntryOpen && <BlogEntryForm />}
    </div>
  )
}


  return (
    <div>
      <h1>Blogs</h1>
      {errorNotification && <Notification notifType={"error"} message={errorNotification.message}></Notification>}
      {successNotification && <Notification notifType={"success"} message={successNotification.message}></Notification>}
      
      {singleBlog && singleBlogView()}

      <div className={"loginAndRegister"}>
      {(!user && !registerFormOpen) && loginForm()}
      {(!user && registerFormOpen) && registerForm()}
      {(!user && !registerFormOpen) && registerButton()}
      </div>
      <div key="justblogs" className="blogs">
        {user && <div>
       <p>{user.name} logged in</p> {logoutButton()}
       </div>}
       {console.log(user)}
       {console.log("BLOGS", blogs)}
        { (!singleBlog && !editing) &&
        
          blogs.map(blog => {if(blog.title){return(
            
            <div className="blog" key={blog.id}>
              <p>Title: {blog.title}</p>
              <p>Author: {blog.author}</p>
              <p>Link: <button className="linkButton" onClick={()=>handleLink(blog)}> {blog.url} </button> {"<-- click to open blog"}</p>
              <p>Likes ♥ {blog.likes}</p>
              
              { ! blogsLiked.includes(blog.id) ? 
                <button onClick={()=>addLike(blog)}> ♥ </button> : 
                <button onClick={()=>removeLike(blog)}> Liked ! </button> 
              }
              {user && blog.user && user.username === blog.user.username
              ? <EditBlogPopup blog={blog} blogs={blogs} setBlogs={setBlogs} user={user} setSuccessNotification={setSuccessNotification} setErrorNotification={setErrorNotification}/> : <></>}
              <button onClick={()=>removeOne(blog)}> delete </button>
              </div>
          )}
          }
          )
        }
        </div>
        {user && <div><br></br><AddBlogPopup blogs={blogs} setBlogs={setBlogs} user={user} setSuccessNotification={setSuccessNotification} setErrorNotification={setErrorNotification}/> </div>}
        </div>
  )
}

export default App
