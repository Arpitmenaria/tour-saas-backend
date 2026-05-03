import PDFDocument from "pdfkit";

const drawLine = (doc, y) => {
  doc
    .moveTo(50, y)
    .lineTo(doc.page.width - 50, y)
    .strokeColor("#cccccc")
    .lineWidth(1)
    .stroke();
};

const generateInvoice = (trip, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice_${trip._id}.pdf`
  );

  doc.pipe(res);

  const labelX = 50;
  const valueX = doc.page.width - 50;

  let y = 50;

  // ── Company Name (FIXED) ──
  doc.y = y;
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .fillColor("#1a1a1a")
    .text("Shivshakti Tourist", { align: "center" });

  y = doc.y + 5;

  // ── Title (FIXED) ──
  doc.y = y;
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .fillColor("#444")
    .text("BUS TRIP INVOICE", { align: "center" });

  y = doc.y + 15;
  drawLine(doc, y);

  // ── Vehicle Info ──
  y += 20;

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#000")
    .text("Vehicle & Trip Information", labelX, y);

  y += 20;

  doc.fontSize(11).font("Helvetica").text("Vehicle Number:", labelX, y);
  doc
    .font("Helvetica-Bold")
    .text(trip.vehicleId?.vehicleNumber || "N/A", valueX, y, {
      align: "right",
    });

  y += 20;

  const startDate = new Date(trip.startDate).toDateString();
  const endDate = new Date(trip.endDate).toDateString();

  doc.font("Helvetica").text("Trip Date:", labelX, y);
  doc
    .font("Helvetica-Bold")
    .text(`${startDate} - ${endDate}`, valueX, y, { align: "right" });

  y += 30;
  drawLine(doc, y);

  // ── Trip Details ──
  y += 20;

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Trip Details", labelX, y);

  y += 20;

  const row = (label, value) => {
    doc.font("Helvetica").fontSize(11).text(label, labelX, y);
    doc
      .font("Helvetica-Bold")
      .text(value, valueX, y, { align: "right" });
    y += 20;
  };

  row("Total KM:", `${trip.totalKm} km`);
  row("Toll Tax:", `₹${trip.toll}`);
  row("Permit:", `₹${trip.permit}`);

  // ── Border Taxes ──
  if (trip.borderTaxes && trip.borderTaxes.length > 0) {
    y += 10;

    doc.font("Helvetica").text("Border Taxes:", labelX, y);
    y += 15;

    trip.borderTaxes.forEach((bt) => {
      doc.text(`• ${bt.state}`, labelX + 10, y);
      doc
        .font("Helvetica-Bold")
        .text(`₹${bt.amount}`, valueX, y, { align: "right" });
      y += 18;
    });
  }

  y += 10;
  drawLine(doc, y);

  // ── TOTAL ──
  y += 20;

  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .text("TOTAL AMOUNT", labelX, y);

  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .text(`₹${trip.totalAmount}`, valueX, y, { align: "right" });

  y += 40;
  drawLine(doc, y);

  // ── Footer (FIXED) ──
  doc.y = y;
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#888")
    .text("Thank you for choosing Shivshakti Tourist", {
      align: "center",
    });

  doc.end();
};

export default generateInvoice;