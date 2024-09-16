import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../actions/jobActions";
import { fetchCompanies } from "../actions/companyActions";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination, // Import Pagination
} from "@mui/material";

const JobManagement = () => {
  const dispatch = useDispatch();
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);
  const { companies } = useSelector((state) => state.companies);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    salary: 0,
    location: "",
    company: "",
  });

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    company: "",
    sortBy: "",
    sortOrder: "asc",
    page: 1,
    limit: 5, 
  });

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, [dispatch, filters]);

  const handleOpen = () => {
    setIsEditMode(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setJobData({
      title: "",
      description: "",
      salary: 0,
      location: "",
      company: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      [name]: name === "salary" ? Number(value) : value,
    });
  };

  const handleSaveJob = () => {
    if (isEditMode) {
      dispatch(updateJob(jobData._id, jobData)).then(() => {
        dispatch(fetchJobs(filters));
      });
    } else {
      dispatch(createJob(jobData)).then(() => {
        dispatch(fetchJobs(filters));
      });
    }
    handleClose();
  };

  const handleEditJob = (job) => {
    setJobData(job);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleDeleteJob = (id) => {
    dispatch(deleteJob(id)).then(() => {
      dispatch(fetchJobs(filters));
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handlePageChange = (event, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: value, // Set the new page
    }));
  };

  return (
    <Container>
      <h2>Job Management</h2>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Add Job
      </Button>

      {/* Search and Filter Inputs */}
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Search"
          name="search"
          variant="outlined"
          onChange={handleFilterChange}
          value={filters.search}
          style={{ marginRight: "10px" }}
        />
        <TextField
          label="Location"
          name="location"
          variant="outlined"
          onChange={handleFilterChange}
          value={filters.location}
          style={{ marginRight: "10px" }}
        />
        <FormControl variant="outlined" style={{ marginRight: "10px" }}>
          <InputLabel>Company</InputLabel>
          <Select
            name="company"
            value={filters.company}
            onChange={handleFilterChange}
            label="Company"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {companies.companies?.map((company) => (
              <MenuItem key={company._id} value={company._id}>
                {company.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ marginRight: "10px" }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            label="Sort By"
          >
            <MenuItem value="mostRecent">Most Recent</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="ascendingTitle">Title (A-Z)</MenuItem>
            <MenuItem value="descendingTitle">Title (Z-A)</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel>Sort Order</InputLabel>
          <Select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleFilterChange}
            label="Sort Order"
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditMode ? "Edit Job" : "Add Job"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={jobData.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            value={jobData.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Salary"
            name="salary"
            type="number"
            fullWidth
            value={jobData.salary}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Location"
            name="location"
            fullWidth
            value={jobData.location}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Company</InputLabel>
            <Select
              name="company"
              value={jobData.company}
              onChange={handleInputChange}
            >
              {companies.companies?.map((company) => (
                <MenuItem key={company._id} value={company._id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveJob}
            color="primary"
            disabled={jobsLoading}
          >
            {jobsLoading ? "Saving..." : isEditMode ? "Save Changes" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs?.jobs?.map((job) => (
            <TableRow key={job._id}>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.description}</TableCell>
              <TableCell>{job.salary}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditJob(job)} color="primary">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteJob(job._id)}
                  color="secondary"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        count={Math.ceil(jobs?.totalCount / filters.limit)}
        page={filters.page}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "20px" }}
      />
    </Container>
  );
};

export default JobManagement;
