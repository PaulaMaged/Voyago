import User from "../models/User.js"
const Register = async (req, res) => {
    try {
        const { username, password, description, DOB } = req.body
        const newUser = new User({ username, password, description, DOB })
        await newUser.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export default Register;