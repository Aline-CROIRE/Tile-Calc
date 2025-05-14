const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const calculationRoutes = require("./routes/calculations")
const tileRoutes = require("./routes/tiles")
const adminRoutes = require("./routes/admin")
const { authenticateToken } = require("./middleware/auth")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI||"mongodb+srv://KIMA:kim1234@cluster0.ufciukm.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", authenticateToken, userRoutes)
app.use("/api/calculations", authenticateToken, calculationRoutes)
app.use("/api/tiles", authenticateToken, tileRoutes)
app.use("/api/admin", authenticateToken, adminRoutes)

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("*", (req, res) => {const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const calculationRoutes = require("./routes/calculations")
const tileRoutes = require("./routes/tiles")
const adminRoutes = require("./routes/admin")
const uploadRoutes = require("./routes/Uploads")
const { authenticateToken } = require("./middleware/auth")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", authenticateToken, userRoutes)
app.use("/api/calculations", authenticateToken, calculationRoutes)
app.use("/api/tiles", authenticateToken, tileRoutes)
app.use("/api/admin", authenticateToken, adminRoutes)
app.use("/api/uploads", uploadRoutes)

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  })
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
