const express = require("express")
const invoices = require("../routes/invoices")
const users = require("../routes/users")
const verify = require("../routes/verify")
const auth = require("../routes/auth")
const error = require("../middleware/error")
const cors = require("cors")

module.exports = function (app) {
  app.use(express.json())
  app.use("/", express.static("./uploads"))
  app.use("/api/invoices", invoices)
  app.use("/api/users", users)
  app.use("/api/auth", auth)
  app.use("/api/verify", verify)
  app.use(cors())
  app.use(error)
}
