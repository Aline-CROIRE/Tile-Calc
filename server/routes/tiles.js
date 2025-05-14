const express = require("express")
const router = express.Router()
const Tile = require("../models/Tile")
const { isAdmin } = require("../middleware/auth")

// @route   GET /api/tiles
// @desc    Get all tiles
// @access  Private
router.get("/", async (req, res) => {
  try {
    const tiles = await Tile.find().sort({ name: 1 })
    res.json(tiles)
  } catch (error) {
    console.error("Get tiles error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/tiles/:id
// @desc    Get a specific tile
// @access  Private
router.get("/:id", async (req, res) => {
  try {
    const tile = await Tile.findById(req.params.id)

    if (!tile) {
      return res.status(404).json({ message: "Tile not found" })
    }

    res.json(tile)
  } catch (error) {
    console.error("Get tile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/tiles
// @desc    Create a new tile
// @access  Private (Admin only)
router.post("/", isAdmin, async (req, res) => {
  try {
    const { name, length, width, type, inStock } = req.body

    // Create new tile
    const tile = new Tile({
      name,
      length,
      width,
      type,
      inStock,
    })

    // Save tile to database
    await tile.save()

    res.status(201).json(tile)
  } catch (error) {
    console.error("Create tile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/tiles/:id
// @desc    Update a tile
// @access  Private (Admin only)
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const tile = await Tile.findById(req.params.id)

    if (!tile) {
      return res.status(404).json({ message: "Tile not found" })
    }

    // Update tile fields
    const { name, length, width, type, inStock } = req.body

    if (name) tile.name = name
    if (length) tile.length = length
    if (width) tile.width = width
    if (type) tile.type = type
    if (inStock !== undefined) tile.inStock = inStock

    // Save updated tile
    await tile.save()

    res.json(tile)
  } catch (error) {
    console.error("Update tile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/tiles/:id
// @desc    Delete a tile
// @access  Private (Admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const tile = await Tile.findById(req.params.id)

    if (!tile) {
      return res.status(404).json({ message: "Tile not found" })
    }

    await tile.remove()

    res.json({ message: "Tile removed" })
  } catch (error) {
    console.error("Delete tile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
