import React, { useState } from 'react';
import blogService from '../services/blogService';

const AddBlogPopup = ({blogs, setBlogs}) => {
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
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    };

    blogService.createBlog(newBlog)
      .then((response) => {
        // Handle the response
        console.log(response);
        setBlogs(blogs.concat(response.data))
        closePopup();
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
  };

  return (
    <>
      <button onClick={openPopup}>Add Blog</button>
      {isOpen && (
        <div className="popup-container">
          <div className="popup-content">
            <h2>Add a New Blog</h2>
            <input
              type="text"
              placeholder="Blog Title"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Blog Author"
              value={blogAuthor}
              onChange={(e) => setBlogAuthor(e.target.value)}
            />
            <input
              type="text"
              placeholder="Blog URL"
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
