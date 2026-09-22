import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaDownload,
  FaHome,
  FaClipboard,
  FaReceipt
} from "react-icons/fa";

import { downloadInvoice } from "../../utils/invoiceGenerator";

import "./PaymentSuccess.css";

export default function PaymentSuccess() {

  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    navigate("/customer/home");
    return null;
  }

  const {
    user,
    cart,
    total,
    subtotal,
    gst,
    delivery,
    transactionId,
    invoiceNo
  } = state;

  const date = new Date();

  const copyTransaction = () => {
    navigator.clipboard.writeText(transactionId);
    alert("Transaction ID Copied");
  };

  const downloadBill = () => {

    downloadInvoice({

      customerName: user.name,

      email: user.email,

      phone: user.phone,

      address: user.address,

      invoiceNo,

      payment: "Online Payment",

      paymentStatus: "Paid",

      transactionId,

      date: date.toLocaleString(),

      subTotal: subtotal.toFixed(2),

      gst: gst.toFixed(2),

      delivery: delivery.toFixed(2),

      total: total.toFixed(2),

      items: cart

    });

  };

  return (

    <div className="payment-success-page">

      <div className="receipt-card">

        <div className="success-circle">

          <FaCheck />

        </div>

        <h1 className="amount">

          ₹ {Number(total).toFixed(2)}

        </h1>

        <h2 className="success-title">

          Payment Successful

        </h2>

        <p className="paid-to">

          Paid to Pharma ERP

        </p>

        <div className="receipt-info">

          <div className="row">

            <span>Transaction ID</span>

            <div className="value">

              {transactionId}

              <FaClipboard
                className="copy"
                onClick={copyTransaction}
              />

            </div>

          </div>

          <div className="row">

            <span>Invoice</span>

            <strong>

              {invoiceNo}

            </strong>

          </div>

          <div className="row">

            <span>Status</span>

            <strong className="paid">

              PAID

            </strong>

          </div>

          <div className="row">

            <span>Date</span>

            <strong>

              {date.toLocaleDateString()}

            </strong>

          </div>

          <div className="row">

            <span>Time</span>

            <strong>

              {date.toLocaleTimeString()}

            </strong>

          </div>

        </div>

        <button
          className="btn invoice-btn"
          onClick={downloadBill}
        >

          <FaDownload />

          Download Invoice

        </button>

        <button
          className="btn orders-btn"
          onClick={() => navigate("/customer/orders")}
        >

          <FaReceipt />

          View Orders

        </button>

        <button
          className="btn home-btn"
          onClick={() => navigate("/customer/home")}
        >

          <FaHome />

          Back Home

        </button>

      </div>

    </div>

  );

}