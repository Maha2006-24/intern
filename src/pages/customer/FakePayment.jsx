import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { FaCheckCircle } from "react-icons/fa";

import { createOrder } from "../../services/api";

import "./FakePayment.css";

export default function FakePayment() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const user = state?.user;
  const cart = state?.cart || [];

  const total = state?.amount || 0;
  const subtotal = state?.subtotal || 0;
  const gst = state?.gst || 0;
  const delivery = state?.delivery || 0;

  const [seconds, setSeconds] = useState(5);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!state) {
      navigate("/customer/checkout");
      return;
    }

    const countdown = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(async () => {
      clearInterval(countdown);

      const transactionId = `PAY${Date.now()}`;

      try {
        await createOrder({
          customer: user.name,
          customerEmail: user.email,
          items: cart,
          total,
          paymentMethod: "Online Payment",
          paymentStatus: "Paid",
          transactionId,
          status: "Processing",
        });

        setPaid(true);

        setTimeout(() => {
          navigate("/customer/payment-success", {
            state: {
              user,
              cart,
              total,
              subtotal,
              gst,
              delivery,
              transactionId,
              invoiceNo: `INV-${Date.now()}`
            }
          });
        }, 1500);

      } catch (error) {
        alert(error.message);
      }

    }, 5000);

    return () => {
      clearInterval(countdown);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="payment-page">

      <div className="payment-card">

        {!paid ? (
          <>

            <h2>Scan & Pay</h2>

            <div className="amount-box">

              <h1>
                ₹ {Number(total).toFixed(2)}
              </h1>

            </div>

            <div className="qr-box">

              <QRCode
                value={`upi://pay?pa=pharma@upi&pn=PharmaERP&am=${total}&cu=INR`}
                size={220}
              />

            </div>

            <h3>
              Scan using

              <br />

              Google Pay / PhonePe / Paytm
            </h3>

            <div className="countdown">

              Payment detecting...

              <br />

              <strong>

                {seconds}

              </strong>

            </div>

          </>
        ) : (

          <div className="payment-success-animation">

            <FaCheckCircle className="success-icon"/>

            <h2>

              Payment Successful

            </h2>

          </div>

        )}

      </div>

    </div>
  );
}