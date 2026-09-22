import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function downloadInvoice(order) {

  const doc = new jsPDF("p", "mm", "a4");

  /* ==========================
     HEADER
  ========================== */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(122, 19, 35);
  doc.text("PHARMA ERP", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(90);
  doc.text("Your Trusted Online Pharmacy", 14, 29);

  doc.setDrawColor(122, 19, 35);
  doc.setLineWidth(0.5);
  doc.line(14, 34, 196, 34);

  /* ==========================
     CUSTOMER DETAILS
  ========================== */

  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.setFontSize(18);
  doc.text("Customer Details", 14, 46);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(`Invoice No : ${order.invoiceNo}`, 14, 57);
  doc.text(`Date : ${order.date}`, 14, 65);
  doc.text(`Customer : ${order.customerName}`, 14, 73);
  doc.text(`Email : ${order.email}`, 14, 81);
  doc.text(`Phone : ${order.phone}`, 14, 89);
  doc.text(`Address : ${order.address}`, 14, 97);

  /* ==========================
     TABLE
  ========================== */

  autoTable(doc, {
    startY: 105,

    head: [["Medicine", "Qty", "Price", "Total"]],

    body: order.items.map((item) => [
      item.name,
      String(item.quantity),
      Number(item.price).toFixed(2),
      (Number(item.price) * Number(item.quantity)).toFixed(2),
    ]),

    theme: "grid",

    headStyles: {
      fillColor: [122, 19, 35],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },

    styles: {
      font: "helvetica",
      fontSize: 11,
      cellPadding: 3,
      valign: "middle",
    },

    columnStyles: {
      0: { halign: "left" },
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  let y = doc.lastAutoTable.finalY + 15;

  /* ==========================
     TOTALS
  ========================== */

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  doc.text(
    `Subtotal : Rs. ${Number(order.subTotal).toFixed(2)}`,
    135,
    y
  );

  y += 8;

  doc.text(
    `GST (5%) : Rs. ${Number(order.gst).toFixed(2)}`,
    135,
    y
  );

  y += 8;

  doc.text(
    `Delivery : Rs. ${Number(order.delivery).toFixed(2)}`,
    135,
    y
  );

  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(122, 19, 35);

  doc.text(
    `Grand Total : Rs. ${Number(order.total).toFixed(2)}`,
    135,
    y
  );

  y += 20;

  /* ==========================
     PAYMENT DETAILS
  ========================== */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(0);

  doc.text("Payment Details", 14, y);

  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(`Payment Method : ${order.payment}`, 14, y);

  y += 8;

  doc.text(
    `Payment Status : ${order.paymentStatus}`,
    14,
    y
  );

  y += 8;

  if (order.transactionId) {

    doc.text(
      `Transaction ID : ${order.transactionId}`,
      14,
      y
    );

    y += 8;

  }

  /* ==========================
     FOOTER
  ========================== */

  y += 18;

  doc.setDrawColor(180);
  doc.line(14, y, 196, y);

  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(122, 19, 35);

  doc.text(
    "Thank You for Shopping with Pharma ERP!",
    14,
    y
  );

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100);

  doc.text(
    "Stay Healthy • Stay Safe • Visit Again",
    14,
    y
  );

  doc.save(`Invoice-${order.invoiceNo}.pdf`);

}