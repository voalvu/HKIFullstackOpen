import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
const OutlineButton = styled.button`
  padding-left:2em;
  padding: 0.25em 0.75em;
  background: rgb(231, 209, 90); /* Transparent background */
  color:rgb(36, 14, 9); /* Tomato color for text */
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
  outline: 1em;
  &:hover {
    background: #ff6347; /* Fill background on hover */
    color: white; /* Change text color to white on hover */
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 99, 71, 0.5); /* Focus ring */
    background:red;
  }
`


const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
      visible,
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <OutlineButton onClick={toggleVisibility}>{props.buttonLabel}</OutlineButton>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {props.children}
        <OutlineButton onClick={toggleVisibility}>cancel</OutlineButton>
      </div>
    </div>
  )
})
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable