// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Club = require('../models/Club');

// exports.login = async (req, res) => {
//   const { name, password } = req.body;

//   // Check if the club exists
//   const club = await Club.findOne({ name });
//   if (!club) return res.status(400).send('Invalid name or password.');
//   console.log('test1');

//   // Compare the provided password with the hashed password in the database
//   const isPasswordCorrect = await bcrypt.compare(password, club.password);
//   if (!isPasswordCorrect) return res.status(400).send('Invalid name or password.');
//   console.log('test2');

//   // Generate JWT token
//   const token = jwt.sign({ id: club._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//   res.json({ token });
// };
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the club exists
    const club = await Club.findOne({ username });
    if (!club)
      return res.status(400).send('Invalid name or password.');
    // console.log('test1');

    // Compare the provided password with the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, club.password);
    if (!isPasswordCorrect) {
      return res.status(400).send('Invalid username or password.');
    }

    // console.log('test2');

    // Generate JWT token with 'isAdmin' flag
    const token = jwt.sign(
      {
        id: club._id,
        isAdmin: club.isAdmin, // Add isAdmin to the payload of the token
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expiration set to 1 hour
    );

    // Send the token as the response
    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error.');
  }
};

exports.register = async (req, res) => {
  const { name, password, isAdmin } = req.body;

  try {
    const existingClub = await Club.findOne({ name });
    if (existingClub) return res.status(400).send("Club already exists.");

    const hashedPassword = await bcrypt.hash(password, 10);
    const club = new Club({
      name,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      credits: 7
    });

    await club.save();
    res.status(201).send("Club registered successfully.");
  } catch (err) {
    res.status(500).send("Error registering club.");
  } 
};