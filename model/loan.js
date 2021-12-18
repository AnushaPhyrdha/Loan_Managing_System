const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    customer_id: { type: "string", require: true },
    loan_id: { type: "string", require: true, unique: true },
    loan_amount: { type: "number", unique: true, require: true },
    interest: { type: "number", require: true },
    loan_period: { type: "number", require: true },
    total_amount: { type: "number", require: true },
    total_installments: { type: "number", require: true },
    installments_paid: { type: "number", default: 0 },
    installments_tobe_paid: { type: "number" },
    amount_paid: { type: "number", default: 0 },
    amount_tobe_paid: { type: "number" },
    transactions: { type: "string", default: null },
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", PostSchema);

module.exports = Loan;
