import User from "../models/User.js";
const Register = async (req, res) => {
  try {
    const payload = req.body;
    const newUser = new User(payload);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default Register;
