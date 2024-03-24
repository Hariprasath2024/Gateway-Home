const express = require('express');
const nodemailer = require('nodemailer');
const router = require('express').Router();

router.post('/', async (req, res) => {
  const { from } = req.body;

  
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yourgmail@gmail.com', // Your Gmail address
      pass: 'yourgmailpassword', // Your Gmail password
    },
  });

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: from, // sender address
      to: 'n.hariprasath901513@gmail.com', // list of receivers
      subject: 'Details of Customer', // Subject line
      text: 'Customer details...', // plain text body
    });

    console.log('Email sent: ' + info.response);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

module.exports = router;
