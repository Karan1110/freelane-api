const bcrypt = require("bcrypt")
const { User } = require("../models/user")
const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()

router.post("/", async (req, res) => {
  let user = await User.findOne({ email: req.body.email })
  console.log(user)
  if (!user) return res.status(400).send("Invalid email or password.")

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send("Invalid email or password.")

  const token = user.generateAuthToken()
  res.send({ token: token })
})

module.exports = router
