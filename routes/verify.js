const config = require("config")
const api_key = config.get("api_key")
const router = require("express").Router()
const TwoFactor = new (require("2factor"))(api_key)

router.post("/send", async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber

    TwoFactor.sendOTP(phoneNumber).then(
      (sessionId) => {
        console.log(sessionId)

        res.status(200).send({
          sessionId: sessionId,
          message: `OTP sent to ${phoneNumber} on ${new Date()}`,
        })
      },
      (error) => {
        console.log(error)
        return res.status(400).send(error)
      }
    )
  } catch (error) {
    console.error(error)
    res.status(500).send("something failed.")
  }
})

module.exports = router
