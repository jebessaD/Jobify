import axios from 'axios';
import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './types';

export const login = (email, password) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });

        console.log(response,"response")
        dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: LOGIN_FAIL, payload: error.response.data });
    }
};

export const logout = () => (dispatch) => {
    dispatch({ type: LOGOUT });
};
