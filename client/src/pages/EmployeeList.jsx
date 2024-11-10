import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  TextField,
  Typography,
  Container,
  TablePagination,
  TableSortLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Snackbar,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [editEmployee, setEditEmployee] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleActiveToggle = async (id, isActive) => {
    try {
      await axios.put(`http://localhost:5000/api/employees/${id}`, { isActive: !isActive }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchEmployees();
      setSnackbarMessage('Employee status updated successfully');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error toggling employee status:', err);
      setSnackbarMessage('Error updating employee status');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        fetchEmployees();
        setSnackbarMessage('Employee deleted successfully');
        setSnackbarOpen(true);
      } catch (err) {
        console.error('Error deleting employee:', err);
        setSnackbarMessage('Error deleting employee');
        setSnackbarOpen(true);
      }
    }
  };

  const handleEditClick = (employee) => {
    setEditEmployee(employee);
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setEditEmployee(null);
  };

  const handleEditSave = async () => {
    if (editEmployee && editEmployee._id) {
      try {
        await axios.put(`http://localhost:5000/api/employees/${editEmployee._id}`, editEmployee, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        fetchEmployees();
        handleEditClose();
        setSnackbarMessage('Employee updated successfully');
        setSnackbarOpen(true);
      } catch (err) {
        console.error('Error updating employee:', err);
        setSnackbarMessage('Error updating employee');
        setSnackbarOpen(true);
      }
    }
  };

  const handleEditChange = (e) => {
    if (editEmployee) {
      setEditEmployee({ ...editEmployee, [e.target.name]: e.target.value });
    }
  };

  const handleEditCourseChange = (course) => {
    if (editEmployee) {
      const updatedCourses = editEmployee.course.includes(course)
        ? editEmployee.course.filter(c => c !== course)
        : [...editEmployee.course, course];
      setEditEmployee({ ...editEmployee, course: updatedCourses });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const sortedEmployees = filteredEmployees.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Employee List
      </Typography>
      <Button component={Link} to="/create-employee" variant="contained" color="primary" style={{ marginBottom: '1rem' }}>
        Create Employee
      </Button>
     
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Create Date</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEmployees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.mobile}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.gender}</TableCell>
                  <TableCell>{employee.course.join(', ')}</TableCell>
                  <TableCell>{new Date(employee.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Switch
                      checked={employee.isActive}
                      onChange={() => handleActiveToggle(employee._id, employee.isActive)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditClick(employee)} variant="contained" color="primary" size="small">
                      Edit
                    </Button>   
                    <Button onClick={() => handleDelete(employee._id)} variant="contained" color="secondary" size="small" style={{ marginLeft: '0.5rem' }}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={openEditDialog} onClose={handleEditClose}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          {editEmployee && (
            <form>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={editEmployee.name}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={editEmployee.email}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Mobile No"
                name="mobile"
                value={editEmployee.mobile}
                onChange={handleEditChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Designation</InputLabel>
                <Select
                  name="designation"
                  value={editEmployee.designation}
                  onChange={handleEditChange}
                >
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                </Select>
              </FormControl>
              <FormControl component="fieldset" margin="normal">
                <RadioGroup
                  name="gender"
                  value={editEmployee.gender}
                  onChange={handleEditChange}
                >
                  <FormControlLabel value="M" control={<Radio />} label="Male" />
                  <FormControlLabel value="F" control={<Radio />} label="Female" />
                </RadioGroup>
              </FormControl>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={editEmployee.course.includes('MCA')} onChange={() => handleEditCourseChange('MCA')} />}
                  label="MCA"
                />
                <FormControlLabel
                  control={<Checkbox checked={editEmployee.course.includes('BCA')} onChange={() => handleEditCourseChange('BCA')} />}
                  label="BCA"
                />
                <FormControlLabel
                  control={<Checkbox checked={editEmployee.course.includes('BSC')} onChange={() => handleEditCourseChange('BSC')} />}
                  label="BSC"
                />
              </FormGroup>
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}