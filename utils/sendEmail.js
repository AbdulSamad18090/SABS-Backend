const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const buildAppointmentHTML = ({ patient_name, doctor_name, appointment_datetime, appointment_reason }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Appointment Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f9ff;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 94, 184, 0.15);
          overflow: hidden;
        }
        .header {
          background-color: #155dfc;
          color: #ffffff;
          padding: 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 24px;
          color: #333333;
        }
        .info {
          background-color: #f0f6ff;
          border: 1px solid #d6e9ff;
          padding: 16px;
          border-radius: 6px;
          margin: 16px 0;
        }
        .info p {
          margin: 8px 0;
        }
        .footer {
          padding: 16px;
          text-align: center;
          font-size: 13px;
          color: #888888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Appointment Confirmed</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${patient_name}</strong>,</p>
          <p>Your appointment has been successfully booked through the <strong>Smart Doctor Appointment Booking System</strong>.</p>
          <div class="info">
            <p><strong>Doctor:</strong> Dr. ${doctor_name}</p>
            <p><strong>Date & Time:</strong> ${appointment_datetime}</p>
            <p><strong>Reason:</strong> ${appointment_reason}</p>
          </div>
          <p>Please arrive 10 minutes early and bring any necessary documents.</p>
          <p>We wish you good health!</p>
        </div>
        <div class="footer">
          &copy; 2025 Smart Doctor Appointment System. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
};

const sendAppointmentEmail = async ({ to, patient_name, doctor_name, appointment_datetime, appointment_reason }) => {
  const html = buildAppointmentHTML({ patient_name, doctor_name, appointment_datetime, appointment_reason });

  await transporter.sendMail({
    from: `"Smart Clinic" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: "Appointment Confirmation",
    html,
  });
};

module.exports = { sendAppointmentEmail };
