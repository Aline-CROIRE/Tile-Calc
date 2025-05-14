const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs")
const { upload, handleUploadError } = require("../controllers/uploadController")
const { authenticateToken } = require("../middleware/auth")

// Apply authentication middleware
router.use(authenticateToken)

// @route   POST /api/uploads/plan
// @desc    Upload a room plan image
// @access  Private
router.post("/plan", upload.single("planImage"), handleUploadError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    // Return the file path that can be stored in the database
    const filePath = `/uploads/${req.file.filename}`

    res.json({
      message: "File uploaded successfully",
      filePath,
      fileName: req.file.filename,
      fileSize: req.file.size,
    })
  } catch (error) {
    console.error("File upload error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/uploads/:filename
// @desc    Get an uploaded file
// @access  Private
router.get("/:filename", (req, res) => {
  try {
    const filePath = path.join(__dirname, "../uploads", req.params.filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" })
    }

    res.sendFile(filePath)
  } catch (error) {
    console.error("File retrieval error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/uploads/:filename
// @desc    Delete an uploaded file
// @access  Private
router.delete("/:filename", (req, res) => {
  try {
    const filePath = path.join(__dirname, "../uploads", req.params.filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" })
    }

    // Delete the file
    fs.unlinkSync(filePath)

    res.json({ message: "File deleted successfully" })
  } catch (error) {
    console.error("File deletion error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
