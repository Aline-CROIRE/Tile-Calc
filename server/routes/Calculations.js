const express = require("express")
const router = express.Router()
const Calculation = require("../models/Calculation")
const { isAdmin } = require("../middleware/auth")

// @route   GET /api/calculations
// @desc    Get all calculations for the current user
// @access  Private
router.get("/", async (req, res) => {
  try {
    const calculations = await Calculation.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(calculations)
  } catch (error) {
    console.error("Get calculations error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/calculations/:id
// @desc    Get a specific calculation
// @access  Private
router.get("/:id", async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id)

    if (!calculation) {
      return res.status(404).json({ message: "Calculation not found" })
    }

    // Check if the calculation belongs to the current user or user is admin
    if (calculation.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this calculation" })
    }

    res.json(calculation)
  } catch (error) {
    console.error("Get calculation error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/calculations
// @desc    Create a new calculation
// @access  Private
router.post("/", async (req, res) => {
  try {
    const { name, roomLength, roomWidth, tileLength, tileWidth, spacing, pattern, results, planImage } = req.body

    // Create new calculation
    const calculation = new Calculation({
      user: req.user._id,
      name,
      roomLength,
      roomWidth,
      tileLength,
      tileWidth,
      spacing,
      pattern,
      results,
      planImage,
      status: "draft",
    })

    // Save calculation to database
    await calculation.save()

    res.status(201).json(calculation)
  } catch (error) {
    console.error("Create calculation error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/calculations/:id
// @desc    Update a calculation
// @access  Private
router.put("/:id", async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id)

    if (!calculation) {
      return res.status(404).json({ message: "Calculation not found" })
    }

    // Check if the calculation belongs to the current user
    if (calculation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this calculation" })
    }

    // Update calculation fields
    const { name, roomLength, roomWidth, tileLength, tileWidth, spacing, pattern, results, planImage, status } =
      req.body

    if (name) calculation.name = name
    if (roomLength) calculation.roomLength = roomLength
    if (roomWidth) calculation.roomWidth = roomWidth
    if (tileLength) calculation.tileLength = tileLength
    if (tileWidth) calculation.tileWidth = tileWidth
    if (spacing !== undefined) calculation.spacing = spacing
    if (pattern) calculation.pattern = pattern
    if (results) calculation.results = results
    if (planImage !== undefined) calculation.planImage = planImage
    if (status) calculation.status = status

    // Save updated calculation
    await calculation.save()

    res.json(calculation)
  } catch (error) {
    console.error("Update calculation error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/calculations/:id
// @desc    Delete a calculation
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id)

    if (!calculation) {
      return res.status(404).json({ message: "Calculation not found" })
    }

    // Check if the calculation belongs to the current user or user is admin
    if (calculation.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this calculation" })
    }

    await calculation.remove()

    res.json({ message: "Calculation removed" })
  } catch (error) {
    console.error("Delete calculation error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
