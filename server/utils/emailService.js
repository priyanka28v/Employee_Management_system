import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Notification from "../models/Notification.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendAdminNotification = async (subject, employee) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('ADMIN_EMAIL not set, skipping admin notification');
      return;
    }
    await transporter.sendMail({
      from: `"EMS Notification" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `[Admin Alert] ${subject}`,
      text: `Event: ${subject}\nEmployee: ${employee?.email || 'N/A'}\nName: ${employee?.name || 'N/A'}\nTime: ${new Date().toISOString()}`,
    });
  } catch (err) {
    console.error('Failed to send admin notification:', err);
  }
};
