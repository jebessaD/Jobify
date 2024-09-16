import axios from 'axios';

export const fetchAdmins = () => async (dispatch, getState) => {
    try {
        const { auth: { token } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const { data } = await axios.get('http://localhost:4000/api/admin', config);
        dispatch({ type: 'FETCH_ADMINS_SUCCESS', payload: data });
    } catch (error) {
        console.error('Error fetching admins:', error);
    }
};

export const createAdmin = (admin) => async (dispatch, getState) => {
    try {
        const { auth: { token } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const { data } = await axios.post('http://localhost:4000/api/admin', admin, config);
        dispatch({ type: 'CREATE_ADMIN_SUCCESS', payload: data });
    } catch (error) {
        console.error('Error creating admin:', error);
    }
};

export const updateAdmin = (id, admin) => async (dispatch, getState) => {
    try {
        const { auth: { token } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const { data } = await axios.put(`http://localhost:4000/api/admin/${id}`, admin, config);
        dispatch({ type: 'UPDATE_ADMIN_SUCCESS', payload: data });
    } catch (error) {
        console.error('Error updating admin:', error);
    }
};

export const deleteAdmin = (id) => async (dispatch, getState) => {
    try {
        const { auth: { token } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        await axios.delete(`http://localhost:4000/api/admin/${id}`, config);
        dispatch({ type: 'DELETE_ADMIN_SUCCESS', payload: id });
    } catch (error) {
        console.error('Error deleting admin:', error);
    }
};
