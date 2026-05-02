import PDFDocument from "pdfkit";

const generateInvoice = (trip, res) => {
  const doc = new PDFDocument();

  // Headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice_${trip._id}.pdf`
  );

  // Handle stream properly
  doc.on("end", () => {
    console.log("✅ PDF sent successfully");
  });

  doc.on("error", (err) => {
    console.error("PDF Error:", err);
  });

  doc.pipe(res);

  // Content
  doc.fontSize(20).text("Bus Trip Invoice", { align: "center" });

  doc.moveDown();
  doc.fontSize(12).text(`Vehicle: ${trip.vehicleId.vehicleNumber}`);
  doc.text(`Start Date: ${new Date(trip.startDate).toDateString()}`);
  doc.text(`End Date: ${new Date(trip.endDate).toDateString()}`);

  doc.moveDown();
  doc.text(`Total KM: ${trip.totalKm}`);
  doc.text(`Rate per KM: Rs. ${trip.ratePerKm}`);
  doc.text(`Toll: Rs. ${trip.toll}`);
  doc.text(`Permit: Rs. ${trip.permit}`);
  doc.text("Border Taxes:");

  trip.borderTaxes.forEach((tax) => {
  doc.text(`- ${tax.state}: ₹${tax.amount}`);
});

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: Rs. ${trip.totalAmount}`);

  doc.end(); // 👈 MUST be last line
};

export default generateInvoice;