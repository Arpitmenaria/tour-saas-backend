import PDFDocument from "pdfkit";

const drawLine = (doc) => {
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor("#cccccc")
    .lineWidth(1)
    .stroke();
  doc.moveDown(0.5);
};

const generateInvoice = (trip, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice_${trip._id}.pdf`
  );

  doc.on("end", () => {
    console.log("✅ PDF sent successfully");
  });

  doc.on("error", (err) => {
    console.error("PDF Error:", err);
  });

  doc.pipe(res);

  // ── Company Name ──
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .fillColor("#1a1a1a")
    .text("Shivshakti Tourist", { align: "center" });

  doc.moveDown(0.4);

  // ── Invoice Title ──
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .fillColor("#444444")
    .text("BUS TRIP INVOICE", { align: "center" });

  doc.moveDown(1);
  drawLine(doc);

  // ── Section 1: Vehicle & Trip Info ──
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#1a1a1a")
    .text("Vehicle & Trip Information");

  doc.moveDown(0.5);

  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#333333")
    .text(`Vehicle Number: `, { continued: true })
    .font("Helvetica-Bold")
    .text(trip.vehicleId.vehicleNumber);

  const startDate = new Date(trip.startDate).toDateString();
  const endDate = new Date(trip.endDate).toDateString();

  doc
    .font("Helvetica")
    .text(`Trip Date:          `, { continued: true })
    .font("Helvetica-Bold")
    .text(`${startDate}  –  ${endDate}`);

  doc.moveDown(1);
  drawLine(doc);

  // ── Section 2: Trip Details ──
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#1a1a1a")
    .text("Trip Details");

  doc.moveDown(0.5);

  const labelX = 50;
  const pageWidth = doc.page.width;
const valueX = pageWidth - 50;

  const detailRow = (label, value) => {
    const y = doc.y;
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#333333")
      .text(label, labelX, y);
    doc
      .font("Helvetica-Bold")
      .text(value, valueX, y, { align: "right" });
    doc.moveDown(0.5);
  };

  detailRow("Total KM:", `${trip.totalKm} km`);
  detailRow("Toll Tax:", `₹${trip.toll}`);
  detailRow("Permit:", `₹${trip.permit}`);

  if (trip.borderTaxes && trip.borderTaxes.length > 0) {
    doc.moveDown(0.3);

    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#333333")
      .text("Border Taxes:", labelX);

    doc.moveDown(0.3);

    trip.borderTaxes.forEach((bt) => {
      const y = doc.y;
      doc
        .fontSize(11)
        .font("Helvetica")
        .fillColor("#555555")
        .text(`   • ${bt.state}`, labelX, y);
      doc
        .font("Helvetica-Bold")
        .fillColor("#333333")
        .text(`₹${bt.amount}`, valueX, y, { align: "right" });
      doc.moveDown(0.4);
    });
  }

  doc.moveDown(0.5);
  drawLine(doc);

  // ── Total Amount ──
  doc.moveDown(0.5);

  const totalY = doc.y;
  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .fillColor("#1a1a1a")
    .text("TOTAL AMOUNT", labelX, totalY);

  doc
    .fontSize(15)
    .font("Helvetica-Bold")
    .fillColor("#000000")
    .text(`₹${trip.totalAmount}`, valueX, totalY, { align: "right" });

  doc.moveDown(2);
  drawLine(doc);

  // ── Footer ──
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#888888")
    .text("Thank you for choosing Shivshakti Tourist", { align: "center" });

  doc.end();
};

export default generateInvoice;
