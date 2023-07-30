const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require("../models");

class userController {
    static async register(req, res) {
        const { name, email, password } = req.body;
      
        try {
          // Check if user with the email already exists in the database
          const existingUser = await User.findOne({ where: { email } });
          if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
          }
      
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);
      
          // Create a new user in the database
          await User.create({ name, email, password: hashedPassword });
      
          res.json({ message: 'User registered successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;
      
        try {
          // Find user with the provided email in the database
          const user = await User.findOne({ where: { email } });
          if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }
      
          // Check if the provided password matches the hashed password in the database
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }
      
          // Generate JWT token
          const token = jwt.sign({ userId: user.id }, process.env.RAHASIA);
      
          res.json({ message: 'Login successful', token });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async getUserInfo(req, res) {
        const {authorization} = req.headers 
        try {
            if (authorization) {
                const decode = jwt.verify(authorization, process.env.RAHASIA)
                const foundUser = await User.findOne({
                    where : {
                        id: decode.userId
                    }
                })
                
                if (foundUser) {
                    const user = {
                        email: foundUser.email,
                        name: foundUser.name
                    }
                    res.status(200).json({ message: 'User info fetched successfully', user });
                } else {
                    res.status(500).json({ message: 'Internal Server Error' });
                }
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = userController;
