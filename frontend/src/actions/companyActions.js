import axios from "axios";

export const fetchCompanies = () => async (dispatch, getState) => {
  try {
    const {
      auth: { token },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      "http://localhost:4000/api/company",
      config
    );
    dispatch({ type: "FETCH_COMPANIES_SUCCESS", payload: data });
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
};

export const createCompany = (company) => async (dispatch, getState) => {
  try {
    const {
      auth: { token },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      "http://localhost:4000/api/company",
      company,
      config
    );
    dispatch({ type: "CREATE_COMPANY_SUCCESS", payload: data });
  } catch (error) {
    console.error("Error creating company:", error);
  }
};

export const updateCompany = (id, company) => async (dispatch, getState) => {
  try {
    const {
      auth: { token },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `http://localhost:4000/api/company/${id}`,
      company,
      config
    );
    dispatch({ type: "UPDATE_COMPANY_SUCCESS", payload: data });
  } catch (error) {
    console.error("Error updating company:", error);
  }
};

export const deleteCompany = (id) => async (dispatch, getState) => {
  try {
    const {
      auth: { token },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`http://localhost:4000/api/company/${id}`, config);
    dispatch({ type: "DELETE_COMPANY_SUCCESS", payload: id });
  } catch (error) {
    console.error("Error deleting company:", error);
  }
};
