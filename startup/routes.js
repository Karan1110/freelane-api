const express = require("express")
const invoices = require("../routes/invoices")
const users = require("../routes/users")
const verify = require("../routes/verify")
const { Invoice } = require("../models/invoice")
const auth = require("../routes/auth")
const error = require("../middleware/error")
const cors = require("cors")

module.exports = function (app) {
  app.use(express.json())
  app.get("/:id", async (req, res) => {
    const invoice = await Invoice.findById(req.params.id)
    res.contentType(invoice.contentType)
    res.send(invoice.file)
  })
  app.use("/api/invoices", invoices)
  app.use("/api/users", users)
  app.use("/api/auth", auth)
  app.use("/api/verify", verify)
  app.use(cors())
  app.use(error)
}
