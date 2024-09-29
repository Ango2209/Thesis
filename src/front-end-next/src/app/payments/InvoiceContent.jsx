// InvoiceContent.jsx
import React from "react";

const InvoiceContent = ({ invoiceCode, patient, doctor, paymentMethod, service }) => {
  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Medical Invoice</h2>
      <h3 style={invoiceCodeStyle}>Invoice Code: {invoiceCode}</h3>

      <div style={infoContainerStyle}>
        <div style={infoSectionStyle}>
          <h4>Patient Information</h4>
          <p>
            <strong>Name:</strong> {patient.name}
          </p>
          <p>
            <strong>Patient Code:</strong> {patient.code}
          </p>
          <p>
            <strong>Phone:</strong> {patient.phone}
          </p>
        </div>

        <div style={infoSectionStyle}>
          <h4>Doctor Information</h4>
          <p>
            <strong>Name:</strong> {doctor.name}
          </p>
          <p>
            <strong>Doctor Code:</strong> {doctor.id}
          </p>
        </div>
      </div>

      {/* Phần dịch vụ được trình bày trong một bảng */}
      <div style={serviceContainerStyle}>
        <h4>Service Details</h4>
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

      <div style={infoContainerStyle}>
        <div style={infoSectionStyle}>
          <h4>Appointment Date</h4>
          <p>{appointmentDate}</p>
        </div>

        <div style={totalSectionStyle}>
          <h4>Total Amount:</h4>
          <p style={totalAmountStyle}>{service.price}</p>
        </div>
      </div>

      {/* Cải thiện phần phương thức thanh toán */}
      <div style={paymentMethodContainerStyle}>
        <h4>Payment Method</h4>
        <p>
          <strong>{`Payment Method: ${paymentMethod}`}</strong>
        </p>
      </div>
    </div>
  );
};

// Các kiểu CSS cho hóa đơn
const containerStyle = {
  padding: "20px",
  fontFamily: "Arial, sans-serif",
  maxWidth: "600px",
  margin: "0 auto",
  border: "1px solid #ddd", // Thêm viền cho hóa đơn
  borderRadius: "5px", // Bo tròn góc
  backgroundColor: "#fff", // Màu nền trắng
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "10px",
  color: "#333", // Màu chữ
};

const invoiceCodeStyle = {
  textAlign: "center",
  marginBottom: "20px",
  fontWeight: "normal",
};

const infoContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #ddd",
  paddingBottom: "10px",
  marginBottom: "15px",
};

const infoSectionStyle = {
  flex: "1", // Chia đều không gian giữa các phần tử
  paddingRight: "10px",
  paddingLeft: "10px",
};

const serviceContainerStyle = {
  marginBottom: "20px", // Khoảng cách cho phần dịch vụ
  padding: "10px 0",
  borderBottom: "1px solid #ddd", // Đường phân cách cho phần dịch vụ
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const tableHeaderStyle = {
  borderBottom: "2px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

const tableCellStyle = {
  borderBottom: "1px solid #ddd",
  padding: "10px",
};

const totalSectionStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  flex: "1",
};

const totalAmountStyle = {
  fontSize: "18px",
  fontWeight: "bold",
};

const paymentMethodContainerStyle = {
  marginTop: "20px",
  padding: "10px",
  borderTop: "1px solid #ddd", // Thêm đường phân cách cho phần phương thức thanh toán
};

export default InvoiceContent;
