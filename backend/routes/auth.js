import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/Users.js'

const router = express.Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  res.json({ token })
})

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const user = new User({ username, password: hashed })
    await user.save()
    res.status(201).json({ message: 'User registered' })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ message: 'Failed to register user' })
  }
})

export default router