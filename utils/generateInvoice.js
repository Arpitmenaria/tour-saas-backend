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
  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - 100; // 50px margin each side

  // Right-aligned text: start at labelX, full content width, align right
  const rightText = (text, y, options = {}) => {
    doc.text(text, labelX, y, {
      width: contentWidth,
      align: "right",
      ...options,
    });
  };

  let y = 50;

  // ── Company Name ──
  doc.y = y;
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .fillColor("#1a1a1a")
    .text("Shivshakti Tourist", { align: "center" });

  y = doc.y + 5;

  // ── Title ──
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

  doc.fontSize(11).font("Helvetica").fillColor("#000").text("Vehicle Number:", labelX, y);
  doc.font("Helvetica-Bold");
  rightText(trip.vehicleId?.vehicleNumber || "N/A", y);

  y += 20;

  const startDate = new Date(trip.startDate).toDateString();
  const endDate = new Date(trip.endDate).toDateString();

  doc.font("Helvetica").text("Trip Date:", labelX, y);
  doc.font("Helvetica-Bold");
  rightText(`${startDate} - ${endDate}`, y);

  y += 30;
  drawLine(doc, y);

  // ── Trip Details ──
  y += 20;

  doc.fontSize(12).font("Helvetica-Bold").text("Trip Details", labelX, y);

  y += 20;

  const row = (label, value) => {
    doc.font("Helvetica").fontSize(11).fillColor("#000").text(label, labelX, y);
    doc.font("Helvetica-Bold");
    rightText(value, y);
    y += 20;
  };

  row("Total KM:", `${trip.totalKm} km`);
  row("Toll Tax:", `\u20B9${trip.toll}`);
  row("Permit:", `\u20B9${trip.permit}`);

  // ── Border Taxes ──
  if (trip.borderTaxes && trip.borderTaxes.length > 0) {
    y += 10;

    doc.font("Helvetica").fontSize(11).text("Border Taxes:", labelX, y);
    y += 15;

    trip.borderTaxes.forEach((bt) => {
      doc.font("Helvetica").text(`• ${bt.state}`, labelX + 10, y);
      doc.font("Helvetica-Bold");
      rightText(`\u20B9${bt.amount}`, y);
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
    .fillColor("#000")
    .text("TOTAL AMOUNT", labelX, y);

  doc.fontSize(16).font("Helvetica-Bold");
  rightText(`\u20B9${trip.totalAmount}`, y);

  y += 40;
  drawLine(doc, y);

  // ── Footer ──
  doc.y = y + 10;
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