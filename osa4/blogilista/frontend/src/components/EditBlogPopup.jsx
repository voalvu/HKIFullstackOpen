import React, { useState } from 'react';
import blogService from '../services/blogService';

const EditBlogPopup = ({blog, blogs, setBlogs, user, setSuccessNotification, setErrorNotification}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [blogTitle, setBlogTitle] = useState(blog.title);
  const [blogAuthor, setBlogAuthor] = useState(blog.author);
  const [blogUrl, setBlogUrl] = useState(blog.url);
  const [blogEntries, setBlogEntries] = useState(blog.entries)

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
    const editedBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
      entries: blogEntries
    };

    blogService.editBlog(blog, editedBlog, user)
      .then((response) => {
        // Handle the response
        console.log(response);
        const i = blogs.indexOf(blog)
        const newBlogs = blogs
        newBlogs[i]= response.data
        setBlogs(newBlogs)
        closePopup();
        setSuccessNotification({message:`SUCCESS: edited blog with title: ${response.title}, by ${response.author}`})
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
    <><button onClick={openPopup}>Edit Blog</button>
      {isOpen && (
        <div className="popup-container">
          <div className="popup-content">
            <h2>Edit the Blog</h2>
            <input
              type="text"
              placeholder={"title"}
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder={"author"}
              value={blogAuthor}
              onChange={(e) => setBlogAuthor(e.target.value)}
            />
            <input
              type="text"
              placeholder={"url"}
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

export default EditBlogPopup;
