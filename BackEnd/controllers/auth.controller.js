import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// --- Register User ---
// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      username,
      password,
      // Optional fields
      avatarId,
      domains,
      learningStyle,
      studyTime,
      teamPref,
    } = req.body;

    // Simple Validation
    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (name, email, username, password)' });
    }

    // Check if user exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'This username is already taken' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      username,
      password, // Password will be hashed by the mongoose middleware in User.model.js
      avatarId: avatarId || 'default',
      domains: domains || [],
      learningStyle,
      studyTime,
      teamPref,
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      // Send response with token
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatarId: user.avatarId,
        token: token, // <--- Return token directly
        // Extra info
        domains: user.domains,
        learningStyle: user.learningStyle,
        studyTime: user.studyTime,
        teamPref: user.teamPref,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// --- Login User ---
// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email });

    // Check password
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatarId: user.avatarId,
        token: token, // <--- Return token directly

        domains: user.domains,
        learningStyle: user.learningStyle,
        studyTime: user.studyTime,
        teamPref: user.teamPref,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// --- Logout User ---
// Since we are using stateless JWT with headers, "logout" is simply handled on the client (clearing local storage).
// But we can leave a simple placeholder or strict cookie clearing if they were using it before, 
// just to be safe, though essentially it does nothing for header-based auth.
export const logoutUser = (req, res) => {
  // If we were using cookies, we would clear them here. 
  // For header-based auth, client just discards token.
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
