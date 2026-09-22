import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./PaymentLoader.css";

export default function PaymentLoader() {

  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {

    const timer = setTimeout(() => {

      navigate("/customer/payment-success", {
        state
      });

    }, 4000);

    return () => clearTimeout(timer);

  }, [navigate, state]);

  return (

    <div className="loader-page">

      <div className="loader-card">

        <div className="spinner"></div>

        <h2>Processing Payment...</h2>

        <p>Please wait</p>

        <div className="steps">

          <p>✔ Connecting to UPI...</p>

          <p>✔ Verifying Transaction...</p>

          <p>✔ Generating Invoice...</p>

        </div>

      </div>

    </div>

  );

}