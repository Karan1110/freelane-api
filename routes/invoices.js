const { Invoice } = require("../models/invoice")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const express = require("express")
const router = express.Router()
const path = require("path")
const multer = require("multer")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const p = path.join(__dirname, "../", "./uploads")
    cb(null, p)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const fileExtension = path.extname(file.originalname)
    cb(null, `${uniqueSuffix}${fileExtension}`)
  },
})

const upload = multer({ storage: storage })

router.get("/", [auth], async (req, res) => {
  const invoices = await Invoice.find({})
  res.send(invoices)
})

router.get("/unapproved", [auth], async (req, res) => {
  const invoice = await Invoice.find({ user: req.user._id }).populate("user")
  res.send(invoice)
})

router.get("/:id", [auth], async (req, res) => {
  const invoices = await Invoice.findById(req.params.id)
  res.send(invoices)
})

router.post("/", [auth, upload.single("image")], async (req, res) => {
  try {
    const { price, quantity, name } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "No image provided." })
    }

    const invoice = new Invoice({
      price,
      quantity,
      name,
      user: req.user._id,
      image: req.file.filename,
    })

    await invoice.save()
    res.status(201).send(invoice)
  } catch (error) {
    console.error("Error adding invoice:", error)
    res.status(500).json({ message: "An error occurred.", error })
  }
})

router.put("/:id", [auth], async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    )

    res.send(invoice)
  } catch (error) {
    console.error("Error updating invoice:", error)
    res.status(500).json({ message: "An error occurred.", error })
  }
})

module.exports = router
