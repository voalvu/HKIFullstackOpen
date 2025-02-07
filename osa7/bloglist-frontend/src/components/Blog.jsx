import React, { useState, useEffect, useRef } from 'react';
import styled, {keyframes} from 'styled-components';
import lottie from 'lottie-web';
import { useDispatch, useSelector } from 'react-redux';
import { likeBlog, removeBlog, addComment } from '../reducers/blog';
import { setNotification } from '../reducers/notification';
import { useMatch } from 'react-router-dom';
import Togglable from './Togglable';

const BlogTitle = styled.a`
  text-decoration: none;
  color: black;
  font-family: Arial, sans-serif;
  font-size: 2em;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 0.5em 1em;
  cursor: pointer;
  z-index: 5;

  &:hover {
    background-color: rgba(205, 205, 203, 0.31);
    border-color: red;
  }

  &:active {
    background-color: rgba(255, 0, 0, 0.2);
  }
  
@keyframes moveAnimation {
  0% {
    transform: translateX(0%);
  }
  80% {
    opacity: 100;
  }
  100% {
    transform: translateX(650%);
    opacity: 0; /* Fade out at the end */
  }
}

`;

const AnimationContainer = styled.div`
  position: absolute;
  left: 0;
  bottom:1em;
  width: 5em;
  height: 5em;
  pointer-events: none;
  animation: moveAnimation 10s forwards;
  z-index: 1;
`;



const Blog = ({ blog, user }) => {
  const [comment, setComment] = useState('');
  const match = useMatch('/blogs/:id');
  const dispatch = useDispatch();
  const [isAnimationVisible, setIsAnimationVisible] = useState(false);
  const animationContainer = useRef(null);
  const [hearts, setHearts] = useState([]);


  useEffect(() => {
    let animation;
    if (isAnimationVisible) {
      animation = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://lottie.host/fc569053-55e9-4cde-9464-06636b0344f2/phJJsd06UO.json',
      });

      return () => {
        animation.destroy();
      };
    }
  }, [isAnimationVisible]);

  const blogState = useSelector((state) => {
    if (match) {
      return state.blogs.find(a => a.id === match.params.id);
    } else if (blog) {
      return state.blogs.find(b => b.id === blog.id);
    } else {
      return null;
    }
  });

  if (!blogState) return null;

  const addLike = async (blog) => {
    dispatch(likeBlog(blog));
  };

  const addHeart = (e) => {
    const newHeart = {
      id: Date.now(),
      position: {
        x: e.clientX,
        y: e.clientY,
      },
    };
    setHearts((prevHearts) => [...prevHearts, newHeart]);
  };

  return (
    <>
      {user && blog ? (
        <div style={{ display:"flex", flexDirection:"column", border: '1px solid black', margin: '5px', padding: '5px', position: 'relative' }}>
          <BlogTitle
            onMouseEnter={() => setIsAnimationVisible(true)}
            onMouseLeave={() => setIsAnimationVisible(false)}
            href={`/blogs/${blogState.id}`}
          >
            {blogState.title} ➡
          </BlogTitle>
          {isAnimationVisible && <AnimationContainer ref={animationContainer} />}
          <Togglable buttonLabel="view">
            {blogState.url} <br />
            likes: {blogState.likes} <button id="like-button" onClick={() => addLike(blogState)}>like ♥</button>
            <br />
            {blogState.user.length > 0 ? blogState.user.username : null} <br />
            {user !== null && blogState.user.length > 0 ? (
              blogState.user[0].username === user.username ? (
                <button onClick={() => {
                  if (window.confirm(`Are you sure you want to remove blog ${blogState.title} by ${blogState.author}?`)) {
                    dispatch(removeBlog(blog.id));
                    dispatch(setNotification([`removed blog ${blog.title}`], 5));
                  }
                }}>remove</button>
              ) : null
            ) : null}
          </Togglable>
        </div>
      ) : (
        <div className='singleBlogView'>
          <h2>{blogState.title} by {blogState.author}</h2>
          <p>{blogState.likes} likes</p>
          <HeartButton onClick={(e)=>{console.log(hearts);addHeart(e);dispatch(addLike(blogState))}}>Like button ❤</HeartButton>
          {hearts.map((heart) => (
        <Heart
          key={heart.id}
          style={{
            left: heart.position.x - 25 + 'px', // Center the heart
            top: heart.position.y - 25 + 'px', // Center the heart
          }}
        />))}
          <p>added by {blogState.user[0] ? blogState.user[0].name : null}</p>
          <div className='comments'>
            <h2>comments</h2>
            <form className='commentForm' onSubmit={(event) => {
              event.preventDefault();
              dispatch(addComment(blogState, match.params.id, comment));
              setComment('');
            }}>
              <input type="text" value={comment} onChange={({ target }) => setComment(target.value)} placeholder='leave comment' />
              <button type='submit'>add comment</button>
            </form>
            {blogState.comments ? blogState.comments.map((c, index) => <li key={index}>{c}</li>) : null}
          </div>
        </div>
      )}
    </>
  );
};

const flyAnimation = keyframes`
  0% {
    transform: translateY(0) translateX(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-100px) translateX(100px);
    opacity: 1;
  }
  100% {
    transform: translateY(-200px) translateX(200px);
    opacity: 0;
  }
`;
const Heart = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background: url('https://cdn.pixabay.com/photo/2016/02/04/11/57/heart-1179054_1280.png') no-repeat center center;
  background-size: contain;
  animation: ${flyAnimation} 2s forwards;
`;
const HeartButton = styled.button`
  margin:0px;
  padding: 1em 1em;
  font-size: 16px;
`;


export default Blog;

