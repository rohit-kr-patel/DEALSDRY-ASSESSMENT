import React, { useState } from 'react';

import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Radio, 
  RadioGroup, 
  Checkbox, 
  FormGroup,
  Typography,
  Container,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateEmployee() {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: [],
    image: null
  });

  const navigate=useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };


  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEmployee({ ...employee, course: [...employee.course, value] });
    } else {
      setEmployee({ ...employee, course: employee.course.filter(c => c !== value) });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setEmployee({ ...employee, image: file });
    } else {
      setSnackbar({
        open: true,
        message: 'Please upload only jpg or png files',
        severity: 'error'
      });
    }
  };

  const validateForm = () => {
    if (!employee.name || !employee.email || !employee.mobile || !employee.designation || !employee.gender || employee.course.length === 0) {
      setSnackbar({
        open: true,
        message: 'All fields are required',
        severity: 'error'
      });
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(employee.email)) {
      setSnackbar({
        open: true,
        message: 'Invalid email format',
        severity: 'error'
      });
      return false;
    }
    if (!/^\d{10}$/.test(employee.mobile)) {
      setSnackbar({
        open: true,
        message: 'Mobile number must be 10 digits',
        severity: 'error'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  

    const formData = new FormData();
    for (const key in employee) {
      if (key === 'course') {
        formData.append(key, JSON.stringify(employee[key]));
      } else if (key === 'image') {
        if (employee[key]) formData.append(key, employee[key]);
      } else {
        formData.append(key, employee[key]);
      }
    }

    try {
      await axios.post('http://localhost:5000/api/employees', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token')
        }
      });
      setEmployee({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: [],
        image: null
      });
      setSnackbar({
        open: true,
        message: 'Employee created successfully',
        severity: 'success'
      });
      navigate('/employees')
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.msg || 'An error occurred',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Create Employee</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={employee.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={employee.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Mobile No"
          name="mobile"
          value={employee.mobile}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="designation-label">Designation</InputLabel>
          <Select
            labelId="designation-label"
            name="designation"
            value={employee.designation}
            onChange={handleChange}
            required
          >
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Sales">Sales</MenuItem>
          </Select>
        </FormControl>
        <FormControl component="fieldset" margin="normal">
          <RadioGroup
            aria-label="gender"
            name="gender"
            value={employee.gender}
            onChange={handleChange}
          >
            <FormControlLabel value="M" control={<Radio />} label="Male" />
            <FormControlLabel value="F" control={<Radio />} label="Female" />
          </RadioGroup>
        </FormControl>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={employee.course.includes('MCA')} onChange={handleCourseChange} value="MCA" />}
            label="MCA"
          />
          <FormControlLabel
            control={<Checkbox checked={employee.course.includes('BCA')} onChange={handleCourseChange} value="BCA" />}
            label="BCA"
          />
          <FormControlLabel
            control={<Checkbox checked={employee.course.includes('BSC')} onChange={handleCourseChange} value="BSC" />}
            label="BSC"
          />
        </FormGroup>
        <input
          accept="image/jpeg,image/png"
          style={{ display: 'none' }}
          id="image-upload"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="image-upload">
          <Button variant="contained" component="span">
            Upload Image
          </Button>
        </label>
        {employee.image && <Typography>{employee.image.name}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }}>
          Submit
        </Button>
      </form>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}