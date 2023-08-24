const config = require("config")
const api_key = config.get("api_key")
const TwoFactor = new (require("2factor"))(api_key)

module.exports = async function (req, res, next) {
  try {
    if (!req.body.otp) return res.status(400).send("OTP not found.")
    const otp = req.body.otp

    if (!req.body.sessionId)
      return res.status(400).send("Phone number not found.")
    const sessionId = req.body.sessionId

    TwoFactor.verifyOTP(sessionId, otp)
      .then((response) => {
        console.log(response)
        next()
      })
      .catch((error) => {
        return res.status(400).send({ msg: "wrong otp", error: error })
      })
  } catch (error) {
    console.error(error)
    res.status(500).send("something failed")
  }
}
