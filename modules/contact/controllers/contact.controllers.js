
const Response = require('../../../configuration/config.response'),
  { PrismaClient } = require('@prisma/client'),
  Prisma = new PrismaClient();

const nodemailer = require("nodemailer");

// const { sendEmail } = require('../../../configuration/config.mailer')


const createGeneralContact = async (req, res, next) => {
  try {

    const { name, email, message, phone } = req.body;
   

    const contact = await Prisma.Contact.create({
      data: {
        name: name,
        email: email,
        message: message,
        phone: phone,
      },
    });
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info@drclinica.com",
        pass: "DrClinica@1202",
      },
    });

    const emailTo = 'raminoreldaim@gmail.com'
    // const teamMemberName = req.user.user.teamName

    const mailOptions = {
      from: "info@drclinica.com",
      to: emailTo,
      subject: `General Enquiry for WestGate from ${name}`,
      html: `<p style="font-size: 16px;">Hi Marketing and Sales Team,</p>
              <p style="font-size: 16px;">Hope this email finds you well</p>
              <p style="font-size: 16px;">New Enquiry for Westgate</p>
              <p style="font-size: 16px;">Here are the details:</p>
              <table style="font-size: 16px; border-collapse: collapse; width: 100%;">
                <tr >
                  <td style="padding: 8px; text-align: left;"><strong>Name:</strong></td>
                  <td style="padding: 8px; text-align: left;">${name}</td>
                </tr>
                <tr >
                  <td style="padding: 8px; text-align: left;"><strong>Email:</strong></td>
                  <td style="padding: 8px; text-align: left;">${email}</td>
                </tr>
                <tr >
                  <td style="padding: 8px; text-align: left;"><strong>Phone:</strong></td>
                  <td style="padding: 8px; text-align: left;">${phone}</td>
                </tr>
                <tr >
                  <td style="padding: 8px; text-align: left;"><strong>Message:</strong></td>
                  <td style="padding: 8px; text-align: left;">${message}</td>
                </tr>
              </table>
              <p style="font-size: 16px;">Best regards,</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return Response.sendResponse(
      res, {
      msg: '310',
      data: { contact },
      lang: req.params.lang
    });

  } catch (err) {
    console.log(err);
    return next({ msg: 3067 })
  }
}

const createContactForProjects = async (req, res, next) => {
  try {

    const { name, email, message, phone } = req.body;
    const { projectId } = req.query;

    console.log(parseInt(projectId));

    const exist = await Prisma.Project.findUnique({
      where: {
        id: parseInt(projectId)
      }
    })

    if (!exist) {
      return next({ msg: 110 })
    }

    const contact = await Prisma.Contact.create({
      data: {
        name: name,
        email: email,
        message: message,
        phone: phone,
      },
    });

    // console.log("email", req.user.user.email);
    // console.log("title", exist.title);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info@drclinica.com",
        pass: "DrClinica@1202",
      },
    });

    const emailTo = 'raminoreldaim@gmail.com'
    // const teamMemberName = req.user.user.teamName

    const mailOptions = {
      from: "info@drclinica.com",
      to: emailTo,
      subject: `Project lead for WestGate from ${name}`,
      html: `<p style="font-size: 16px;">Hi Marketing and Sales Team,</p>
              <p style="font-size: 16px;">Hope this email finds you well</p>
              <p style="font-size: 16px;">New Project Lead for Westgate</p>
              <p style="font-size: 16px;">Here are lead details:</p>
              <table style="font-size: 16px; border-collapse: collapse; width: 100%;">
                <tr >
                  <td style="padding: 8px; text-align: left;"><strong>Name:</strong></td>
                  <td style="padding: 8px; text-align: left;">${name}</td>
                </tr>
                <tr >
                  <td style="padding: 8px; text-align: left;"><strong>Email:</strong></td>
                  <td style="padding: 8px; text-align: left;">${email}</td>
                </tr>
                <tr >
                  <td style="padding: 8px; text-align: left;"><strong>Phone:</strong></td>
                  <td style="padding: 8px; text-align: left;">${phone}</td>
                </tr>
                <tr >
                  <td style="padding: 8px; text-align: left;"><strong>Message:</strong></td>
                  <td style="padding: 8px; text-align: left;">${message}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; text-align: left;"><strong>Project Title:</strong></td>
                  <td style="padding: 8px; text-align: left;">${exist.title}</td>
                </tr>
              </table>
              <p style="font-size: 16px;">Best regards,</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return Response.sendResponse(
      res, {
      msg: '310',
      data: { contact },
      lang: req.params.lang
    });

  } catch (err) {
    console.log(err);
    return next({ msg: 3067 })
  }
}

const createContactForProperties = async (req, res, next) => {
  try {

    const { name, email, message, phone } = req.body;
    const { propertyId } = req.query;

    console.log(parseInt(propertyId));

    const exist = await Prisma.Property.findUnique({
      where: {
        id: parseInt(propertyId)
      }
    })

    if (!exist) {
      return next({ msg: 111 })
    }

    const contact = await Prisma.Contact.create({
      data: {
        name: name,
        email: email,
        message: message,
        phone: phone,
      },
    });

    // console.log("email", req.user.user.email);
    // console.log("property", exist);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info@drclinica.com",
        pass: "DrClinica@1202",
      },
    });

    const emailTo = 'raminoreldaim@gmail.com'


    const mailOptions = {
      from: "info@drclinica.com",
      to: emailTo,
      subject: `Property lead for Westgate from ${name}`,
      html: `<p style="font-size: 16px;">Hi Marketing and Sales Team,</p>
              <p style="font-size: 16px;">Hope this email finds you well</p>
              <p style="font-size: 16px;">New Property Lead for Westgate</p>
              <p style="font-size: 16px;">Here are lead details:</p>
              <table style="font-size: 16px; border-collapse: collapse; width: 100%;">
              <tr >
              <td style="padding: 8px; text-align: left;"><strong>Name:</strong></td>
              <td style="padding: 8px; text-align: left;">${name}</td>
            </tr>
            <tr >
              <td style="padding: 8px; text-align: left;"><strong>Email:</strong></td>
              <td style="padding: 8px; text-align: left;">${email}</td>
            </tr>
            <tr >
              <td style="padding: 8px; text-align: left;"><strong>Phone:</strong></td>
              <td style="padding: 8px; text-align: left;">${phone}</td>
            </tr>
            <tr >
              <td style="padding: 8px; text-align: left;"><strong>Message:</strong></td>
              <td style="padding: 8px; text-align: left;">${message}</td>
            </tr>
            <tr>
              <td style="padding: 8px; text-align: left;"><strong>Property:</strong></td>
              <td style="padding: 8px; text-align: left;">${exist.title}</td>
            </tr>
                <tr>
                  <td style="padding: 8px; text-align: left;"><strong>Ref ID:</strong></td>
                  <td style="padding: 8px; text-align: left;">${exist.propertyRef}</td>
                </tr>
              </table>
              <p style="font-size: 16px;">Best regards,</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return Response.sendResponse(
      res, {
      msg: '310',
      data: { contact },
      lang: req.params.lang
    });

  } catch (err) {
    console.log(err);
    return next({ msg: 3067 })
  }
}

//Get One User
const findOneContact = async (req, res, next) => {
  const selector = {
    where: {
      contactId: parseInt(req.params.id),
    }
  };
  const foundContact = await Prisma.Contact.findUnique(selector);
  try {
    return Response.sendResponse(
      res,
      {
        msg: '303',
        data: {
          data: foundContact,
        },
        lang: req.params.lang
      });
    return next({ msg: 102 })
    return res.json({
      data: "data is here"
    });
  } catch (err) {
    console.log(err);
    res.json({
      data: "error is here"
    });
  }
}

//Find All Users
const findAllContact = async (req, res, next) => {
  try {

    const all_contacts = await Prisma.Contact.findMany();
    return Response.sendResponse(
      res, {
      msg: '304',
      data: {
        user: all_contacts,
      },
      lang: req.params.lang
    });
    return next({ msg: 102 })
    return res.json({
      data: "data is here"
    });
  } catch (err) {
    console.log(err);
    res.json({
      data: "error is here"
    });
  }
}
//Update Contact
const updateContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message
    };
    const selector = {
      where: {
        contactId: req.params.id,
      }
    };
    const updated_contact = await Prisma.Contact.update(contact, selector);
    return Response.sendResponse(
      res, {
      msg: '301',
      data: {
        contact: updated_contact,
      },
      lang: req.params.lang
    });
    return next({ msg: 102 })
    return res.json({
      data: "data is here"
    });
  } catch (err) {
    console.log(err);
    res.json({
      data: "error is here"
    });
  }
}


const deleteContact = async (req, res, next) => {
  try {
    const selector = {
      where: {
        contactId: req.params.id,
      }
    };
    const deleted_contact = await Prisma.Contact.destroy(selector);
    return Response.sendResponse(
      res, {
      msg: '302',
      data: {
        contact: deleted_contact,
      },
      lang: req.params.lang
    });
    return next({ msg: 102 })
    return res.json({
      data: "data is here"
    });
  } catch (err) {
    console.log(err);
    res.json({
      data: "error is here"
    });
  }
}
module.exports = {
  createContactForProjects,
  createContactForProperties,
  findOneContact,
  findAllContact,
  updateContact,
  deleteContact,
  createGeneralContact
};