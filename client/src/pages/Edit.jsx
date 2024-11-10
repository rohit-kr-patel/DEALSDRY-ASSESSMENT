import React ,{useState} from 'react'
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
    Container
  } from '@mui/material';
  import axios from 'axios';
const Edit = () => {
 
    const [employee, setEmployee] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: [],
        image: null
      });
      const [error, setError] = useState('');
    
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
          setError('Please upload only jpg or png files');
        }
      };
    
      const validateForm = () => {
        if (!employee.name || !employee.email || !employee.mobile || !employee.designation || !employee.gender || employee.course.length === 0) {
          setError('All fields are required');
          return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(employee.email)) {
          setError('Invalid email format');
          return false;
        }
        if (!/^\d{10}$/.test(employee.mobile)) {
          setError('Mobile number must be 10 digits');
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
          // Reset form or redirect
          setEmployee({
            name: '',
            email: '',
            mobile: '',
            designation: '',
            gender: '',
            course: [],
            image: null
          });
          setError('Employee created successfully');
        } catch (err) {
          setError(err.response.data.msg || 'An error occurred');
        }
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
              <InputLabel>Designation</InputLabel>
              <Select
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
          {error && <Typography color="error">{error}</Typography>}
        </Container>
      );
  
}

export default Edit
