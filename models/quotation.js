const mongoose = require("mongoose")

const quotationSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    quantity: Number,
    approved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

const Quotation = mongoose.model("Quotation", quotationSchema)

exports.Quotation = Quotation
exports.quotationSchema = quotationSchema
