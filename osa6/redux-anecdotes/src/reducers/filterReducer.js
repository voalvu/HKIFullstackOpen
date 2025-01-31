const filterAtStart = ''
  
  export const changeFilter = (newFilter) =>{
    console.log(newFilter)
    return { type:'CHANGE',data:newFilter}
  }
  const initialState = {filter:filterAtStart}
  
  const reducer = (state = initialState, action) => {
    console.log('state now: ', state)
    console.log('action', action)
    switch(action.type){
      case 'CHANGE':
        return {...state, filter:action.data}
      default:
        return state
  
    }
  }

  
  export default reducer