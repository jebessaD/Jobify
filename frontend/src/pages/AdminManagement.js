import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../actions/adminActions";
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

const AdminManagement = () => {
  const dispatch = useDispatch();
  const { admins } = useSelector((state) => state.admins);
  const [open, setOpen] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleCreateAdmin = () => {
    dispatch(createAdmin(adminData));
    handleClose();
  };

  const handleUpdateAdmin = (id) => {
    dispatch(updateAdmin(id, adminData));
    handleClose();
  };

  const handleDeleteAdmin = (id) => {
    dispatch(deleteAdmin(id));
  };

  return (
    <Container>
      <h2>Admin Management</h2>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Add Admin
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Admin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={adminData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            value={adminData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={adminData.password}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateAdmin} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin._id}>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleUpdateAdmin(admin._id)}
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteAdmin(admin._id)}
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

export default AdminManagement;
