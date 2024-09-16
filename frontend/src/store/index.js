import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import authReducer from '../reducers/authReducer.js';
import adminReducer from '../reducers/adminReducer.js';
import jobReducer from '../reducers/jobReducer.js';
import companyReducer from '../reducers/companyReducer.js';

const rootReducer = combineReducers({
    auth: authReducer,
    admins: adminReducer,
    jobs: jobReducer,
    companies: companyReducer,
});

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;
