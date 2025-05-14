const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get("/me", async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.json(req.user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", async (req, res) => {
  try {
    const { name, email, company, phone } = req.body

    // Find user by id
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user fields
    user.name = name || user.name
    user.email = email || user.email
    user.company = company || user.company
    user.phone = phone || user.phone

    // Save updated user
    await user.save()

    // Return updated user
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      phone: user.phone,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/users/password
// @desc    Update user password
// @access  Private
router.put("/password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Find user by id
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword)

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Update password error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
