const express = require("express");
const loan = require("../model/loan");
const mongoose = require("mongoose");
const router = express.Router();

//API to LEND the loan money to the customer
router.post("/lend", async function (req, res) {
  try {
    const number = await loan.countDocuments();
    let loan_num = "LNOID0" + req.body.customer_id + number;
    const loan_interest =
      req.body.loan_amount + req.body.interest * req.body.loan_period;
    const Total_Amount = req.body.loan_amount + parseInt(loan_interest);
    const monthly_amount = Total_Amount / (req.body.loan_period * 12);

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

//API for the payment method
router.put("/payment", async function (req, res) {
  try {
    const { customer_id, loan_id, Amount } = req.body;
    const loan_details = await loan
      .find({ customer_id: customer_id }, { loan_id: loan_id })
      .select(
        "total_amount installments_paid amount_paid total_installments -_id"
      );

    let TotalAmount = 0;
    let InstallmentsPaid = 0;
    let AmountPaid = 0;
    let TotalInstallments = 0;
    loan_details.forEach((detail) => {
      TotalAmount = detail.total_amount;
      InstallmentsPaid = detail.installments_paid;
      AmountPaid = detail.amount_paid;
      TotalInstallments = detail.total_installments;
    });

    //Amount and Installments calculations
    let new_amount = 0;
    let new_installments = parseInt(InstallmentsPaid) + 1;
    if (parseInt(AmountPaid) == 0) {
      new_amount = TotalAmount - Amount;
    } else {
      new_amount = TotalAmount - (Amount + parseInt(AmountPaid));
    }

    //Update the transactions
    let new_installments_tobe_paid =
      parseInt(TotalInstallments) - parseInt(new_installments);
    console.log(
      new_amount,
      Amount + parseInt(AmountPaid),
      new_installments,
      new_installments_tobe_paid
    );
    const payment = await loan.findOneAndUpdate(
      { loan_id: loan_id },
      {
        $set: {
          amount_tobe_paid: new_amount,
          amount_paid: Amount + parseInt(AmountPaid),
          installments_paid: new_installments,
          installments_tobe_paid: new_installments_tobe_paid,
        },
      },
      { new: true }
    );
    console.log(payment);
    return res.json({
      status: "success",
      data: {
        payment,
      },
    });
  } catch (e) {
    res.json({
      status: "failed",
      message: e.message,
    });
  }
});

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
