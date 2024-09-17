import axios from "axios";

export const fetchJobs =
  (filters = {}) =>
  async (dispatch, getState) => {
    try {
      const {
        auth: { token },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { ...filters },
      };

      const { data } = await axios.get(
        "http://localhost:4000/api/jobs",
        config
      );
      dispatch({ type: "FETCH_JOBS_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

export const fetchAllJobs =
  (filters = {}) =>
  async (dispatch, getState) => {
    try {
      const {
        auth: { token },
      } = getState();

      const config = {
        params: { ...filters },
      };

      const { data } = await axios.get(
        "http://localhost:4000/api/jobs/all",
        config
      );
      dispatch({ type: "FETCH_JOBS_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      dispatch({ type: "FETCH_JOBS_FAILURE", payload: error.message });
    }
  };

export const createJob = (job) => async (dispatch, getState) => {
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
      "http://localhost:4000/api/jobs",
      job,
      config
    );
    dispatch({ type: "CREATE_JOB_SUCCESS", payload: data });
  } catch (error) {
    console.error("Error creating job:", error);
  }
};

export const updateJob = (id, job) => async (dispatch, getState) => {
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
      `http://localhost:4000/api/jobs/${id}`,
      job,
      config
    );
    dispatch({ type: "UPDATE_JOB_SUCCESS", payload: data });
  } catch (error) {
    console.error("Error updating job:", error);
  }
};

export const deleteJob = (id) => async (dispatch, getState) => {
  try {
    const {
      auth: { token },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`http://localhost:4000/api/jobs/${id}`, config);
    dispatch({ type: "DELETE_JOB_SUCCESS", payload: id });
  } catch (error) {
    console.error("Error deleting job:", error);
  }
};

export const generateDescription =
  ({title, company}) => async (dispatch, getState) => {
    try {
      const {
        auth: { token },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const body = {
        title,
        company,
      };

      const { data } = await axios.post(
        "http://localhost:4000/api/jobs/generate-description",
        body,
        config
      );

      dispatch({
        type: "GENERATE_DESCRIPTION_SUCCESS",
        payload: data,
      });
      
      return data;

    } catch (error) {
      console.error("Error generating description:", error);
      dispatch({
        type: "GENERATE_DESCRIPTION_FAILURE",
        payload: error.message,
      });

      throw error;
    }
  };
