import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "@mui/material";
import {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../actions/companyActions";

const CompanyManagement = () => {
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({ name: "", address: "" });
  const [file, setFile] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleOpen = (company = null) => {
    if (company) {
      setCompanyData({ name: company.name, address: company.address });
      setSelectedCompanyId(company._id);
      setIsEditing(true);
    } else {
      setCompanyData({ name: "", address: "" });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", companyData.name);
    formData.append("address", companyData.address);
    if (file) {
      formData.append("logo", file);
    }

    if (isEditing) {
      dispatch(updateCompany(selectedCompanyId, formData));
      dispatch(fetchCompanies());
    } else {
      dispatch(createCompany(formData));
      dispatch(fetchCompanies());
    }

    handleClose();
  };

  const handleDeleteCompany = (id) => {
    dispatch(deleteCompany(id));
    dispatch(fetchCompanies());
  };

  return (
    <Container>
      <h2>Company Management</h2>
      <Button onClick={() => handleOpen()} variant="contained" color="primary">
        Add Company
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Edit Company" : "Add Company"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={companyData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Address"
            name="address"
            fullWidth
            value={companyData.address}
            onChange={handleInputChange}
          />
          {/* File Upload */}
          <input
            type="file"
            onChange={handleFileChange}
            style={{ marginTop: "20px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Logo</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies?.loading && <div>Loading...</div>}
          {companies?.companies?.companies?.map((company) => (
            <TableRow key={company._id}>
              <TableCell>
                <img
                  src={`${company.logo}`}
                  alt="logo"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "100%",
                  }}
                />
              </TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.address}</TableCell>
              <TableCell>
                <Button onClick={() => handleOpen(company)} color="primary">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteCompany(company._id)}
                  color="secondary"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default CompanyManagement;
