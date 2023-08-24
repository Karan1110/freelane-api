const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    name: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: String,
    file: Buffer,
    contentType: String,
  },
  {
    timestamps: true,
  }
)

const Invoice = mongoose.model("Invoice", invoiceSchema)

exports.Invoice = Invoice
exports.invoiceSchema = invoiceSchema
