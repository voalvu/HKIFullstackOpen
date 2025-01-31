import {createSlice} from '@reduxjs/toolkit'

const filterAtStart = ''
const initialState = {filter:filterAtStart}

const filterSlice = createSlice({
    name:'filter',
    initialState,
    reducers:{
        changeFilter(state,action){
            return {...state, filter:action.payload}
        }
    }
})

export const {changeFilter} = filterSlice.actions
export default filterSlice.reducer

/*   export const changeFilter = (newFilter) =>{
    console.log(newFilter)
    return { type:'CHANGE',data:newFilter}
  }
  
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

  
  export default reducer */