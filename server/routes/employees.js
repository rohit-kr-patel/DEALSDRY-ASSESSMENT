// server/routes/employees.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg formats are allowed!'));
    }
  }
});

// Get all employees
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err.message);
    res.status(500).send('Server error');
  }
});

// Create an employee
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, course } = req.body;

    // Server-side validation
    if (!name || !email || !mobile || !designation || !gender || !course) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ msg: 'Invalid email format' });
    }

    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ msg: 'Mobile number must be 10 digits' });
    }

    // Check for duplicate email
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    // Parse the course field and handle potential errors
    let parsedCourse;
    try {
      parsedCourse = JSON.parse(course);
    } catch (parseError) {
      return res.status(400).json({ msg: 'Invalid format for course field' });
    }

    const newEmployee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      course: parsedCourse,
      image: req.file ? req.file.path : null
    });

    const employee = await newEmployee.save();
    res.json(employee);
  } catch (err) {
    console.error('Error creating employee:', err.message);
    res.status(500).send('Server error');
  }
});

// Get a single employee
router.get("/:id", auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error('Error fetching employee:', err.message);
    res.status(500).send('Server error');
  }
});

// Update an employee
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, course, isActive } = req.body;
    
    // Build employee object
    const employeeFields = {};
    if (name) employeeFields.name = name;
    if (email) employeeFields.email = email;
    if (mobile) employeeFields.mobile = mobile;
    if (designation) employeeFields.designation = designation;
    if (gender) employeeFields.gender = gender;
    if (course) employeeFields.course = course;
    if (isActive !== undefined) employeeFields.isActive = isActive;

    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: employeeFields },
      { new: true }
    );

    res.json(employee);
  } catch (err) {
    console.error('Error updating employee:', err.message);
    res.status(500).send('Server error');
  }
});

// Delete an employee
router.delete('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.json({ msg: 'Employee removed' });
  } catch (err) {
    console.error('Error deleting employee:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;