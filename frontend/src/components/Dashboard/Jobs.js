import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobs } from "../../actions/jobActions";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Pagination,
  Grid,
  Box,
} from "@mui/material";

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs } = useSelector((state) => state);

  console.log(jobs, "hello worlder");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  useEffect(() => {
    const filters = {
      search,
      location,
      company,
      minSalary,
      maxSalary,
      page,
      limit,
    };

    dispatch(fetchAllJobs(filters));
  }, [dispatch, search, location, company, minSalary, maxSalary, page, limit]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(1);
  };

  return (
    <div>
      <h1>Job Listings</h1>

      {/* Search and Filter Form */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Location"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Company"
            variant="outlined"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Min Salary"
            type="number"
            variant="outlined"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Max Salary"
            type="number"
            variant="outlined"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Job Listings */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Salary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs?.jobs?.jobs?.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.company?.name}</TableCell>
                <TableCell>{job.salary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box mt={3} display="flex" justifyContent="center" alignItems="center">
        <Pagination
          count={Math.ceil(jobs?.totalCount / limit)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          siblingCount={1}
          boundaryCount={2}
        />
      </Box>
    </div>
  );
};

export default JobList;
