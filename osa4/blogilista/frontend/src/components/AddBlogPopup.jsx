import React, { useState } from 'react';
import blogService from '../services/blogService';

const AddBlogPopup = ({blogs, setBlogs, user, setSuccessNotification, setErrorNotification}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setBlogTitle('');
    setBlogAuthor('');
    setBlogUrl('');
  };

  const handleSubmit = () => {
    console.log("USER",user)
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
      entries: [],
    };

    blogService.createBlog(newBlog, user)
      .then((response) => {
        // Handle the response
        console.log(response);
        setBlogs(blogs.concat(response))
        closePopup();
        setSuccessNotification({message:`SUCCESS: added blog with title: ${response.title}, by ${response.author}`})
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTimeout(() => {
          setSuccessNotification(null)
        }, 5000)
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
        setErrorNotification({message:`ERROR: couldn't create blog. ${error.response.data.error}`})
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTimeout(() => {
          setErrorNotification(null)
        }, 5000)
      });
  };

  return (
    <>
      <button onClick={openPopup}>Add Blog</button>
      {isOpen && (
        <div className="popup-container">
          <div className="popup-content">
            <h2>Add a New Blog</h2>
            (title your blog!)
            <input
              type="text"
              placeholder="Blog Title (title your blog!)"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
            />
            (your name or alias)
            <input
              type="text"
              placeholder="Blog Author (your name or alias)"
              value={blogAuthor}
              onChange={(e) => setBlogAuthor(e.target.value)}
            />
            (a cool link for you blog. the clicky thing on the main blog list)
            <input
              type="text"
              placeholder="Blog URL (a cool link for you blog)"
              value={blogUrl}
              onChange={(e) => setBlogUrl(e.target.value)}
            />
            <div className="popup-actions">
              <button onClick={handleSubmit}>Submit</button>
              <button onClick={closePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBlogPopup;
