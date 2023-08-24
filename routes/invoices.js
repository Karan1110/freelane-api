const { Invoice } = require("../models/invoice")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const express = require("express")
const router = express.Router()
const path = require("path")
const multer = require("multer")

const storage = multer.memoryStorage()
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
      file: req.file.buffer,
      contentType: req.file.mimetype,
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
