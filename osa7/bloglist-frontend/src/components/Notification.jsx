import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'

const NotificationContainer = styled.div`
  border: solid 1px ${({ color }) => color || 'black'};
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  transition: opacity 0.5s ease;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  background-color:rgb(255, 255, 255); /* Light background for better contrast */
  color: ${({ color }) => color || 'black'};
  font-family:arial;
`

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const isVisible = notification.message.length > 0

  return (
    <NotificationContainer color={notification.color} isVisible={isVisible}>
      {notification.message}
    </NotificationContainer>
  )
}

export default Notification