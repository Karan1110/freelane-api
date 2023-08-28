const { Invoice } = require("../models/invoice")
const auth = require("../middleware/auth")
const express = require("express")
const router = express.Router()
const path = require("path")
const multer = require("multer")
const { Quotation } = require("../models/quotation")
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const PDFDocument = require("pdfkit")

router.get("/", [auth], async (req, res) => {
  const invoices = await Invoice.find({})
  res.send(invoices)
})

router.get("/generate-pdf/:id", async (req, res) => {
  const quotation = await Quotation.findById(req.params.id)
    .populate("products")
    .populate("user")
  const productDetails = quotation.products

  const doc = new PDFDocument()

  // Pipe the PDF to the response
  doc.pipe(res)
  doc.fontSize(20).text(`Invoice - ${quotation.user.name}`, { align: "center" })

  productDetails.forEach((p) => {
    doc.text(`Product Name: ${p.name}`)
    doc.text(`Price: ${p.price}`)
  })

  doc.text(`Quantity : ${quotation.quantity}`)
  // End the PDF document
  doc.end()
})

router.get("/unapproved", [auth], async (req, res) => {
  const invoice = await Invoice.find({ user: req.user._id }).populate("user")
  res.send(invoice)
})

router.get("/quotations", [auth], async (req, res) => {
  const quotations = await Quotation.find({ user: req.user._id }).populate(
    "products"
  )
  res.send(quotations)
})

router.get("/quotations/:id", [auth], async (req, res) => {
  const quotations = await Quotation.findById(req.params.id).populate(
    "products"
  )
  res.send(quotations)
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

router.post("/quotation", [auth], async (req, res) => {
  try {
    const { products } = req.body

    const quotaion = new Quotation({
      products: products,
      user: req.user._id,
      quantity: req.body.quantity,
    })

    await quotaion.save()
    res.status(201).send(quotaion)
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

router.put("/like/:id", [auth], async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          likes: 1,
        },
      },
      { new: true }
    )

    res.send(invoice)
  } catch (error) {
    console.error("Error updating invoice:", error)
    res.status(500).json({ message: "An error occurred.", error })
  }
})

router.put("/dislike/:id", [auth], async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          likes: -1,
        },
      },
      { new: true }
    )

    res.send(invoice)
  } catch (error) {
    console.error("Error updating invoice:", error)
    res.status(500).json({ message: "An error occurred.", error })
  }
})

router.put("/quotation/:id", [auth], async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    )

    res.send(quotation)
  } catch (error) {
    console.error("Error updating invoice:", error)
    res.status(500).json({ message: "An error occurred.", error })
  }
})

module.exports = router
