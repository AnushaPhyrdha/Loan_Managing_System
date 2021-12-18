const express = require("express");
const loan = require("../model/loan");
const mongoose = require("mongoose");
const router = express.Router();

//API to LEND the loan money to the customer
router.post("/lend", async function (req, res) {
  try {
    const loan_interest =
      req.body.loan_amount + req.body.interest * req.body.loan_period;
    const Total_Amount = req.body.loan_amount + parseInt(loan_interest);
    const monthly_amount = Total_Amount / (req.body.loan_period * 12);
    let loan_num = "LNOID0" + req.body.customer_id;
    const installments = req.body.loan_period * 12;

    const { customer_id, loan_amount, interest, loan_period } = req.body;
    const customer_loan = await loan.create({
      customer_id,
      loan_id: loan_num,
      interest,
      loan_amount,
      loan_period,
      total_amount: Total_Amount,
      total_installments: installments,
      installments_tobe_paid: installments,
      amount_tobe_paid: Total_Amount,
    });
    return res.json({
      status: "success",
      data: {
        Loan_ID: loan_num,
        Total: Total_Amount,
        Monthly_Amount: monthly_amount,
      },
    });
  } catch (e) {
    res.json({
      status: "failed",
      message: e.message,
    });
  }
});

// router.put("/update/filter", async function (req, res) {
//   try {
//     const { condition, projection } = req.body;
//     const students = await Student.updateMany(condition, projection);
//     return res.json({
//       status: "success",
//       data: {
//         students,
//       },
//     });
//   } catch (e) {
//     res.json({
//       status: "failed",
//       message: e.message,
//     });
//   }
// });

// router.delete("/delete/filter", async function (req, res) {
//   try {
//     const { condition, projection } = req.body;
//     const students = await Student.deleteMany(condition, projection);
//     return res.json({
//       status: "success",
//       data: {
//         students,
//       },
//     });
//   } catch (e) {
//     res.json({
//       status: "failed",
//       message: e.message,
//     });
//   }
// });

module.exports = router;
