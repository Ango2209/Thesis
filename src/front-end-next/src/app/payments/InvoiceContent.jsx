"use client";
import React from "react";

const MedicalInvoice = ({ invoiceCode, date, patient, doctor, service, paymentMethod }) => {
  console.log(invoiceCode);
  return (
    <div style={invoiceContainerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={logoContainerStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="35" fill="#4CAF50" />
            <rect x="30" y="20" width="20" height="40" fill="#fff" />
            <rect x="20" y="30" width="40" height="20" fill="#fff" />
          </svg>
        </div>
        <div>
          <h2 style={hospitalNameStyle}>NSHealthCare</h2>
          <p style={hospitalInfoStyle}>12 Nguyen Van Bao, Ward 4, Go Vap District, Ho Chi Minh City</p>
          <p style={hospitalInfoStyle}>Phone: 0905999999</p>
          <p style={hospitalInfoStyle}>Email: nshealthcare@gmail.com</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div style={sectionStyle}>
        <h3>Invoice</h3>
        <p>
          <strong>Invoice Code:</strong> {invoiceCode}
        </p>
        <p>
          <strong>Date:</strong> {date}
        </p>
      </div>

      {/* Patient and Doctor Details */}
      <div style={infoSectionContainerStyle}>
        <div style={infoSectionStyle}>
          <h4>Patient Details</h4>
          <p>
            <strong>Name:</strong> {patient.fullname}
          </p>
          <p>
            <strong>ID:</strong> {patient.patient_id}
          </p>
          <p>
            <strong>Phone:</strong> {patient.phone}
          </p>
          <p>
            <strong>Address:</strong> {patient.address}
          </p>
        </div>

        <div style={infoSectionStyle}>
          <h4>Doctor Details</h4>
          <p>
            <strong>Name:</strong> {doctor.fullname}
          </p>
          <p>
            <strong>ID:</strong> {doctor.doctor_id}
          </p>
          <p>
            <strong>Contact:</strong> {doctor.phone}
          </p>
        </div>
      </div>

      {/* Services Table */}
      <div style={serviceContainerStyle}>
        <h4>Services Provided</h4>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Service Name</th>
              <th style={tableHeaderStyle}>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tableCellStyle}>{service.name}</td>
              <td style={tableCellStyle}>{service.price}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Total and Payment */}
      <div style={totalContainerStyle}>
        <h4>Total Amount</h4>
        <p style={totalAmountStyle}>${service.price}</p>
      </div>

      <div style={paymentContainerStyle}>
        <h4>Payment Details</h4>
        <p>
          <strong>Method:</strong> {paymentMethod}
        </p>
        <p>
          <strong>Status:</strong> Paid
        </p>
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <p>Thank you for choosing NSHealthCare!</p>
        <p>Terms and conditions apply. Please retain this invoice for your records.</p>
      </div>
    </div>
  );
};

// Styles
const invoiceContainerStyle = {
  fontFamily: "Arial, sans-serif",
  padding: "10px",
  maxWidth: "420px", // A5 width
  margin: "0 auto",
  border: "1px solid #ccc",
  borderRadius: "5px",
  backgroundColor: "#fff",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid #ddd",
  paddingBottom: "10px",
  marginBottom: "10px",
};

const logoContainerStyle = {
  marginRight: "10px",
};

const hospitalNameStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "bold",
};

const hospitalInfoStyle = {
  margin: 0,
  fontSize: "12px",
  color: "#555",
};

const sectionStyle = {
  marginBottom: "10px",
};

const infoSectionContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "15px",
  paddingBottom: "10px",
  borderBottom: "1px solid #ddd",
};

const infoSectionStyle = {
  flex: "1",
  padding: "5px",
};

const serviceContainerStyle = {
  marginBottom: "15px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const tableHeaderStyle = {
  borderBottom: "2px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

const tableCellStyle = {
  borderBottom: "1px solid #ddd",
  padding: "8px",
};

const totalContainerStyle = {
  textAlign: "right",
  marginTop: "15px",
};

const totalAmountStyle = {
  fontSize: "20px",
  fontWeight: "bold",
};

const paymentContainerStyle = {
  marginTop: "10px",
};

const footerStyle = {
  marginTop: "20px",
  textAlign: "center",
  fontSize: "12px",
  color: "#666",
};

export default MedicalInvoice;
