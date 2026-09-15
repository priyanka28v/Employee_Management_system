import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Notification from "../models/Notification.js";
import User from "../models/User.js";

dotenv.config();

const getSmtpHost = () => {
  const host = process.env.SMTP_HOST;
  if (!host || host.includes('@')) {
    return 'smtp.gmail.com';
  }
  return host;
};

const transporter = nodemailer.createTransport({
  host: getSmtpHost(),
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper to store in-app notification in DB for all admin users
const saveInAppNotification = async (message) => {
  try {
    const adminUsers = await User.find({ role: "admin" }).select("_id");
    if (adminUsers && adminUsers.length > 0) {
      const notificationDocs = adminUsers.map(admin => ({
        admin: admin._id,
        message: message,
        createdAt: new Date(),
        read: false
      }));
      await Notification.insertMany(notificationDocs);
    }
  } catch (err) {
    console.error("Failed to save in-app notification:", err.message);
  }
};

// Helper to store in-app notification in DB for a specific employee/user
export const saveUserInAppNotification = async (userId, title, message, type = "general") => {
  try {
    await Notification.create({
      user: userId,
      title: title,
      message: message,
      type: type,
      createdAt: new Date(),
      read: false
    });
  } catch (err) {
    console.error("Failed to save employee in-app notification:", err.message);
  }
};

// Generic Admin Email Notification
export const sendAdminNotification = async (subject, employee) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    
    // Save in-app notification
    const inAppMsg = `${subject}: ${employee?.name || 'Employee'} (${employee?.email || 'N/A'})`;
    await saveInAppNotification(inAppMsg);

    if (!adminEmail) {
      console.warn('ADMIN_EMAIL not set, skipping admin notification email');
      return;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">EMS Admin Alert</h2>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <h3 style="color: #1e293b; margin-top: 0;">${subject}</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Employee Name:</td>
              <td style="padding: 10px 0; color: #1e293b;">${employee?.name || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Email Address:</td>
              <td style="padding: 10px 0; color: #1e293b;">${employee?.email || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Timestamp:</td>
              <td style="padding: 10px 0; color: #1e293b;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
        </div>
        <div style="background-color: #f8fafc; padding: 15px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9;">
          Automated Alert from Employee Management System
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"EMS Notifications" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `[Admin Alert] ${subject}: ${employee?.name || 'Employee'}`,
      text: `Event: ${subject}\nEmployee: ${employee?.name || 'N/A'} (${employee?.email || 'N/A'})\nTime: ${new Date().toLocaleString()}`,
      html: htmlContent,
    });
    console.log(`Email notification sent to admin (${adminEmail}) for: ${subject}`);
  } catch (err) {
    console.error('Failed to send admin notification email:', err.message);
  }
};

// Specialized: Employee Login Notification Email
export const sendEmployeeLoginNotification = async (employee) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const loginTime = new Date().toLocaleString();

    // Store in-app notification for admin
    await saveInAppNotification(`Employee Login: ${employee?.name || employee?.email} logged into the system at ${loginTime}`);

    if (!adminEmail) {
      console.warn('ADMIN_EMAIL not set, skipping login notification email');
      return;
    }

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 600;">🔑 Employee Login Notification</h2>
          <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Employee Activity Alert</p>
        </div>
        <div style="padding: 28px; background-color: #ffffff;">
          <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 16px; margin-bottom: 22px; border-radius: 6px;">
            <p style="margin: 0; color: #15803d; font-size: 15px; font-weight: 500;">
              Employee <strong>${employee?.name || 'Unknown'}</strong> has just logged into the system.
            </p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600; width: 140px;">Employee Name</td>
              <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${employee?.name || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Email Address</td>
              <td style="padding: 12px 0; color: #2563eb;">${employee?.email || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Position / Role</td>
              <td style="padding: 12px 0; color: #1e293b;">${employee?.position || employee?.role || 'Employee'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Login Time</td>
              <td style="padding: 12px 0; color: #1e293b;">${loginTime}</td>
            </tr>
          </table>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; color: #94a3b8; font-size: 13px; border-top: 1px solid #f1f5f9;">
          EMS Security & Attendance System • Automated Email Notification
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"EMS Security Alert" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `🔑 [Login Alert] Employee Logged In: ${employee?.name}`,
      text: `Employee Login Notification\n\nName: ${employee?.name}\nEmail: ${employee?.email}\nTime: ${loginTime}`,
      html: htmlContent,
    });
    console.log(`Login notification email successfully sent to admin (${adminEmail}) for ${employee?.email}`);
  } catch (err) {
    console.error('Failed to send login notification email:', err.message);
  }
};

// Specialized: Employee Leave Application Notification Email (Sent to Admin)
export const sendLeaveApplicationNotification = async (employee, leave) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const submittedTime = new Date().toLocaleString();

    const formattedStartDate = leave?.startDate ? new Date(leave.startDate).toLocaleDateString() : 'N/A';
    const formattedEndDate = leave?.endDate ? new Date(leave.endDate).toLocaleDateString() : 'N/A';

    // Store in-app notification for admin
    await saveInAppNotification(`Leave Request: ${employee?.name} applied for ${leave?.leaveType || 'Leave'} (${leave?.totalDays || 1} day(s)) from ${formattedStartDate} to ${formattedEndDate}`);

    if (!adminEmail) {
      console.warn('ADMIN_EMAIL not set, skipping leave application notification email');
      return;
    }

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 600;">📅 New Leave Application</h2>
          <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Leave Request Awaiting Review</p>
        </div>
        <div style="padding: 28px; background-color: #ffffff;">
          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; margin-bottom: 22px; border-radius: 6px;">
            <p style="margin: 0; color: #b45309; font-size: 15px; font-weight: 500;">
              Employee <strong>${employee?.name || 'Unknown'}</strong> has submitted a new leave application.
            </p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600; width: 140px;">Employee Name</td>
              <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${employee?.name || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Email Address</td>
              <td style="padding: 12px 0; color: #2563eb;">${employee?.email || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Leave Type</td>
              <td style="padding: 12px 0; color: #1e293b;"><span style="background: #e0e7ff; color: #3730a3; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 600;">${leave?.leaveType || 'General Leave'}</span></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Dates</td>
              <td style="padding: 12px 0; color: #1e293b;">${formattedStartDate} to ${formattedEndDate} (<strong>${leave?.totalDays || 1} day(s)</strong>)</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Reason</td>
              <td style="padding: 12px 0; color: #334155; font-style: italic; background-color: #f8fafc; padding: 8px 12px; border-radius: 6px;">"${leave?.reason || 'No reason provided'}"</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Submitted Time</td>
              <td style="padding: 12px 0; color: #1e293b;">${submittedTime}</td>
            </tr>
          </table>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; color: #94a3b8; font-size: 13px; border-top: 1px solid #f1f5f9;">
          EMS Leave Management System • Automated Email Notification
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"EMS Leave Portal" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `📅 [Leave Request] ${employee?.name} submitted ${leave?.leaveType || 'Leave'} (${leave?.totalDays || 1} day(s))`,
      text: `New Leave Application Notification\n\nEmployee: ${employee?.name}\nEmail: ${employee?.email}\nType: ${leave?.leaveType}\nDates: ${formattedStartDate} to ${formattedEndDate}\nReason: ${leave?.reason}`,
      html: htmlContent,
    });
    console.log(`Leave notification email successfully sent to admin (${adminEmail}) for ${employee?.email}`);
  } catch (err) {
    console.error('Failed to send leave notification email:', err.message);
  }
};

// Specialized: Notify Employee when Admin Adds/Updates their Salary
export const sendSalaryNotification = async (employee, salary) => {
  try {
    const employeeEmail = employee?.email;
    const title = `Salary Record Updated (${salary?.month} ${salary?.year})`;
    const message = `Admin has published your salary slip for ${salary?.month} ${salary?.year}. Net Salary: $${salary?.netSalary || salary?.totalSalary || 0}. Payment Status: ${salary?.status || 'Paid'}`;

    // Save in-app notification for employee
    if (employee?._id) {
      await saveUserInAppNotification(employee._id, title, message, "salary");
    }

    if (!employeeEmail) {
      console.warn('Employee email not found, skipping salary email notification');
      return;
    }

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 600;">💵 Salary Slip / Payment Notification</h2>
          <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">WorkSphere Payroll Update</p>
        </div>
        <div style="padding: 28px; background-color: #ffffff;">
          <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 14px 16px; margin-bottom: 22px; border-radius: 6px;">
            <p style="margin: 0; color: #047857; font-size: 15px; font-weight: 500;">
              Hello <strong>${employee?.name || 'Employee'}</strong>, your salary details for <strong>${salary?.month} ${salary?.year}</strong> have been added/updated by HR/Admin.
            </p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600; width: 150px;">Period</td>
              <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${salary?.month} ${salary?.year}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Basic Salary</td>
              <td style="padding: 12px 0; color: #1e293b;">$${salary?.basicSalary || 0}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Allowances</td>
              <td style="padding: 12px 0; color: #16a34a;">+$${salary?.allowances || 0}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Bonus</td>
              <td style="padding: 12px 0; color: #16a34a;">+$${salary?.bonus || 0}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Deductions</td>
              <td style="padding: 12px 0; color: #dc2626;">-$${salary?.deductions || 0}</td>
            </tr>
            <tr style="border-bottom: 2px solid #059669; background-color: #f0fdf4;">
              <td style="padding: 14px 10px; color: #047857; font-weight: 700; font-size: 16px;">Net Salary</td>
              <td style="padding: 14px 10px; color: #047857; font-weight: 800; font-size: 18px;">$${salary?.netSalary || salary?.totalSalary || 0}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Payment Status</td>
              <td style="padding: 12px 0;"><span style="background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 700;">${salary?.status || 'Paid'}</span></td>
            </tr>
          </table>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; color: #94a3b8; font-size: 13px; border-top: 1px solid #f1f5f9;">
          WorkSphere Payroll System • Automated Email Notification
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"WorkSphere Payroll" <${process.env.SMTP_USER}>`,
      to: employeeEmail,
      subject: `💵 [Salary Update] Salary details for ${salary?.month} ${salary?.year}`,
      text: `Salary Update Notification\n\nEmployee: ${employee?.name}\nMonth/Year: ${salary?.month} ${salary?.year}\nNet Salary: $${salary?.netSalary || salary?.totalSalary || 0}\nStatus: ${salary?.status}`,
      html: htmlContent,
    });
    console.log(`Salary notification email successfully sent to employee (${employeeEmail})`);
  } catch (err) {
    console.error('Failed to send salary notification email:', err.message);
  }
};

// Specialized: Notify Employee when Admin Approves or Rejects Leave Request
export const sendLeaveStatusNotification = async (employee, leave, status) => {
  try {
    const employeeEmail = employee?.email;
    const isApproved = status.toLowerCase() === 'approved';
    const statusText = isApproved ? 'APPROVED' : 'REJECTED';
    const headerBg = isApproved 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    const boxBg = isApproved ? '#ecfdf5' : '#fef2f2';
    const boxBorder = isApproved ? '#10b981' : '#ef4444';
    const boxText = isApproved ? '#047857' : '#991b1b';

    const formattedStartDate = leave?.startDate ? new Date(leave.startDate).toLocaleDateString() : 'N/A';
    const formattedEndDate = leave?.endDate ? new Date(leave.endDate).toLocaleDateString() : 'N/A';

    const title = `Leave Application ${statusText}`;
    const message = `Your leave request for ${leave?.leaveType || 'Leave'} (${formattedStartDate} to ${formattedEndDate}) has been ${statusText} by Admin.`;

    // Save in-app notification for employee
    if (employee?._id) {
      await saveUserInAppNotification(employee._id, title, message, "leave");
    }

    if (!employeeEmail) {
      console.warn('Employee email not found, skipping leave status email notification');
      return;
    }

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
        <div style="background: ${headerBg}; color: white; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 600;">${isApproved ? '✅ Leave Application Approved' : '❌ Leave Application Rejected'}</h2>
          <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">WorkSphere Leave Request Status</p>
        </div>
        <div style="padding: 28px; background-color: #ffffff;">
          <div style="background-color: ${boxBg}; border-left: 4px solid ${boxBorder}; padding: 14px 16px; margin-bottom: 22px; border-radius: 6px;">
            <p style="margin: 0; color: ${boxText}; font-size: 15px; font-weight: 500;">
              Hello <strong>${employee?.name || 'Employee'}</strong>, your leave application has been <strong>${statusText}</strong> by HR/Admin.
            </p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600; width: 140px;">Leave Type</td>
              <td style="padding: 12px 0; color: #1e293b; font-weight: 600;">${leave?.leaveType || 'General Leave'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Dates</td>
              <td style="padding: 12px 0; color: #1e293b;">${formattedStartDate} to ${formattedEndDate} (<strong>${leave?.totalDays || 1} day(s)</strong>)</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Reason</td>
              <td style="padding: 12px 0; color: #334155; font-style: italic;">"${leave?.reason || 'N/A'}"</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Decision</td>
              <td style="padding: 12px 0;"><span style="background: ${isApproved ? '#d1fae5' : '#fee2e2'}; color: ${isApproved ? '#065f46' : '#991b1b'}; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 700;">${statusText}</span></td>
            </tr>
          </table>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; color: #94a3b8; font-size: 13px; border-top: 1px solid #f1f5f9;">
          WorkSphere Leave Portal • Automated Email Notification
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"WorkSphere Leave Management" <${process.env.SMTP_USER}>`,
      to: employeeEmail,
      subject: `${isApproved ? '✅ [Approved]' : '❌ [Rejected]'} Leave Application Status: ${leave?.leaveType}`,
      text: `Leave Status Notification\n\nEmployee: ${employee?.name}\nStatus: ${statusText}\nLeave Type: ${leave?.leaveType}\nDates: ${formattedStartDate} to ${formattedEndDate}`,
      html: htmlContent,
    });
    console.log(`Leave status notification email successfully sent to employee (${employeeEmail})`);
  } catch (err) {
    console.error('Failed to send leave status notification email:', err.message);
  }
};
