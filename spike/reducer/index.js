import {combineReducers} from "@reduxjs/toolkit";

import authReducer from '../src/slices/authSlice'
import tournamentReducer from '../src/slices/tournamentSlice'


const rootReducer  = combineReducers({
    auth: authReducer,
    tournament: tournamentReducer,
   
})

export default rootReducer