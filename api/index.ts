import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Get __dirname in an ES module environment safely
let currentDir;
try {
  currentDir = path.dirname(fileURLToPath(import.meta.url));
} catch (e) {
  currentDir = process.cwd();
}
const __dirname_safe = currentDir;

const app = express();
// Enable trust proxy so rate limit relies on the actual client IP behind Vercel's edge proxy
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for simple setup, or configure properly
}));

// CORS configuration
app.use(cors());

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for email endpoint
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after an hour' }
});

// Email sending route
app.post('/send-email', emailLimiter, async (req, res) => {
  try {
    const { name, phone, email, service, property_type, message } = req.body;

    // Server-side validation
    if (!name || !phone || !email || !service || !property_type) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email to the business owner
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'greenclean.new@gmail.com',
      subject: 'New Quote Request - Green Clean Website',
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service Requested:</strong> ${service}</p>
        <p><strong>Property Type:</strong> ${property_type}</p>
        <p><strong>Message:</strong><br/> ${message || 'No message provided.'}</p>
      `
    };

    // Auto-reply to the customer
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Green Clean!',
      html: `
        <h2>Thank you for reaching out to Green Clean!</h2>
        <p>Hi ${name},</p>
        <p>We have received your request for a free quote regarding our <strong>${service}</strong> services.</p>
        <p>Our team will review your details and get back to you shortly at ${phone} or via email.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Green Clean (2016) Inc.</strong><br/>
        Lower Mainland's Experts in Property Maintenance<br/>
        Phone: 778-862-1515</p>
      `
    };

    // Send emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);

    res.status(200).json({ success: 'Your quote request has been sent successfully!' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: `There was an error sending your request: ${error.message || 'Please try again later.'}` });
  }
});

// Conditionally start server and serve static files for local development
if (process.env.NODE_ENV !== 'production') {
  // Serve static files from the public directory
  app.use(express.static(path.join(__dirname_safe, '../public')));

  // Fallback route to serve index.html for SPA-like behavior if needed
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname_safe, '../public', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export the Express API
export default app;
