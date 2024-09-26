import dotenv from 'dotenv';
import express from 'express';
import twilio from 'twilio';

dotenv.config();
const router = express.Router();
const accountSid = process.env.ACCOUNT_SID || '';
const authToken = process.env.AUTH_TOKEN || '';

const client = twilio(accountSid, authToken);

router.post('/send-referral', async (req, res) => {
  const { phone, patientName, concern, programName, description, googleMapsLink } = req.body;

  const confirmationMessage = `
    Appointment Details:
    Patient Name: ${patientName}
    Concern: ${concern}
    Program Name: ${programName}
    Description: ${description}
    Google Maps Link: ${googleMapsLink}
  `;

  try {
    const message = await client.messages.create({
      body: confirmationMessage,
      to: phone,
      from: '+13193201899' 
    });

    console.log('Message sent:', message.sid);

    
    res.status(200).json({
      success: true,
      messageSid: message.sid
    });
  } catch (error) {
    console.error('Error sending message:', error);

   
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

export default router;