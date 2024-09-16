const initialState = {
    companies: [],
    loading: false,
    error: null,
};

const companyReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_COMPANIES_REQUEST':
            return {
                ...state,
                loading: true,
            };
        case 'FETCH_COMPANIES_SUCCESS':
            return {
                ...state,
                loading: false,
                companies: action.payload,
            };
        case 'FETCH_COMPANIES_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case 'CREATE_COMPANY_SUCCESS':
            return {
                ...state,
                companies: [...state.companies, action.payload],
            };
        case 'UPDATE_COMPANY_SUCCESS':
            return {
                ...state,
                companies: state.companies.map(company =>
                    company._id === action.payload._id ? action.payload : company
                ),
            };
        case 'DELETE_COMPANY_SUCCESS':
            return {
                ...state,
                companies: state.companies.filter(company => company._id !== action.payload),
            };
        default:
            return state;
    }
};

export default companyReducer;
