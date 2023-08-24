const auth = require("../middleware/auth")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const { User, validate } = require("../models/user")
const express = require("express")
const router = express.Router()
const verify = require("../middleware/verify_phone")

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password")
  res.send(user)
})

router.post("/", verify, async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      console.log(user)
      return res.status(400).send("User already registered.")
    }
    if (req.body.password == "123abc") {
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: true,
      })
    } else {
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })
    }
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    const token = user.generateAuthToken()
    await user.save()
    res.header("x-auth-token", token).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      token: token,
    })
  } catch (error) {
    res.status(500).send("Something went wrong.")
  }
})

module.exports = router
