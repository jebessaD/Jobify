import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom"; 
import { fetchCompanies } from "../actions/companyActions";
import { fetchJobs } from "../actions/jobActions";
import { fetchAdmins } from "../actions/adminActions";
import JobList from "../components/Dashboard/Jobs";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchJobs());
    dispatch(fetchAdmins());
  }, [dispatch]);

  const { auth, jobs, companies, admins } = useSelector((state) => state);

  if (auth?.isLoading) {
    return <div>Loading...</div>;
  }

  console.log(admins, "admins");
  return (
    <Container>
      <h2>Dashboard</h2>
      <Grid container spacing={3}>
        {auth?.user?.role === "super-admin" && (
          <Grid item xs={12} sm={4}>
            <Link to="/admin-management" style={{ textDecoration: "none" }}>
              <Paper
                elevation={3}
                style={{ padding: "20px", textAlign: "center" }}
              >
                <Typography variant="h6">Admins</Typography>
                <Typography variant="h4">
                  {admins?.admins?.length || 0}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        )}
        {auth?.user?.role === "admin" && (
          <>
            <Grid item xs={12} sm={4}>
              <Link to="/job-management" style={{ textDecoration: "none" }}>
                <Paper
                  elevation={3}
                  style={{ padding: "20px", textAlign: "center" }}
                >
                  <Typography variant="h6">Jobs</Typography>
                  <Typography variant="h4">
                    {jobs?.jobs.totalCount || 0}
                  </Typography>
                </Paper>
              </Link>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Link to="/company-management" style={{ textDecoration: "none" }}>
                <Paper
                  elevation={3}
                  style={{ padding: "20px", textAlign: "center" }}
                >
                  <Typography variant="h6">Companies</Typography>
                  <Typography variant="h4">
                    {companies.companies.totalCount || 0}
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
