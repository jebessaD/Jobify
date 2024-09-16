const initialState = {
    admins: [],
    loading: false,
    error: null,
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_ADMINS_REQUEST':
            return {
                ...state,
                loading: true,
            };
        case 'FETCH_ADMINS_SUCCESS':
            return {
                ...state,
                loading: false,
                admins: action.payload,
            };
        case 'FETCH_ADMINS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case 'CREATE_ADMIN_SUCCESS':
            return {
                ...state,
                admins: [...state.admins, action.payload],
            };
        case 'UPDATE_ADMIN_SUCCESS':
            return {
                ...state,
                admins: state.admins.map(admin =>
                    admin._id === action.payload._id ? action.payload : admin
                ),
            };
        case 'DELETE_ADMIN_SUCCESS':
            return {
                ...state,
                admins: state.admins.filter(admin => admin._id !== action.payload),
            };
        default:
            return state;
    }
};

export default adminReducer;
