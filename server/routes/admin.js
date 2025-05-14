const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Calculation = require("../models/Calculation")
const Tile = require("../models/Tile")
const { isAdmin } = require("../middleware/auth")

// Apply admin middleware to all routes
router.use(isAdmin)

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 })

    // Get calculation count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const calculationsCount = await Calculation.countDocuments({ user: user._id })
        return {
          ...user.toObject(),
          calculationsCount,
        }
      }),
    )

    res.json(usersWithStats)
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/admin/users/:id
// @desc    Get a specific user
// @access  Private (Admin only)
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const calculationsCount = await Calculation.countDocuments({ user: user._id })

    res.json({
      ...user.toObject(),
      calculationsCount,
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/admin/users/:id
// @desc    Update a user
// @access  Private (Admin only)
router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user fields
    const { name, email, role, company, phone } = req.body

    if (name) user.name = name
    if (email) user.email = email
    if (role) user.role = role
    if (company !== undefined) user.company = company
    if (phone !== undefined) user.phone = phone

    // Save updated user
    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      phone: user.phone,
    })
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private (Admin only)
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Don't allow admin to delete themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" })
    }

    // Delete all calculations associated with the user
    await Calculation.deleteMany({ user: user._id })

    // Delete the user
    await user.remove()

    res.json({ message: "User removed" })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalCalculations = await Calculation.countDocuments()

    // Get active users (users who have been active in the last 7 days)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const activeUsers = await User.countDocuments({
      lastActive: { $gte: oneWeekAgo },
    })

    const tileTypes = await Tile.countDocuments()

    res.json({
      totalUsers,
      totalCalculations,
      activeUsers,
      tileTypes,
    })
  } catch (error) {
    console.error("Get stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
