const { PrismaClient } = require("@prisma/client")
const Response = require("../../../configuration/config.response");

const prisma = new PrismaClient();
const nodemailer = require("nodemailer");

const sendListPropertyForm = async (req, res, next) => {
    try{
        const {name,email,phoneNum,category,propertyType,cityId} = req.body;
         let cityData
       
        // if(!name || !email || !phoneNum || !category || !propertyType || !cityId) return next({msg:400})
        if(!name || !email || !phoneNum) return next({msg:400})
        const data = {
            email,
            name,
            phoneNum,
               
        }

        if(category) {
            data.category = category
        }
        if(propertyType) {
            data.propertyType = propertyType
        }

        if(cityId) {
            data.cityId = parseInt(cityId)
            cityData = await prisma.city.findFirst({
                where: {
                    id: parseInt(cityId)
                }
            })
        }
        

       await prisma.consultation.create({
            data
        })

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
            subject: `${cityId && propertyType && category? "Property Listing Inquery":"Promp Consultation"} for Westgate from ${name}`,
            html: `<p style="font-size: 16px;">Hi Marketing and Sales Team,</p>
                    <p style="font-size: 16px;">Hope this email finds you well</p>
                    <p style="font-size: 16px;">New ${cityId && propertyType && category? "Promp Consultation":"Property Listing Inquery"} for Westgate</p>
                    <p style="font-size: 16px;">Here are details:</p>
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
                    <td style="padding: 8px; text-align: left;">${phoneNum}</td>
                  </tr>
                    ${cityId && propertyType && category ? 
                    `<tr >
                    <td style="padding: 8px; text-align: left;"><strong>Category:</strong></td>
                    <td style="padding: 8px; text-align: left;">${category}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; text-align: left;"><strong>Property Type:</strong></td>
                    <td style="padding: 8px; text-align: left;">${propertyType}</td>
                  </tr>
                      <tr>
                        <td style="padding: 8px; text-align: left;"><strong>City:</strong></td>
                        <td style="padding: 8px; text-align: left;">${cityData.name}</td>
                      </tr>`:
                      `
                      <tr>
                        <td style="padding: 8px; text-align: left;"><strong>Message:</strong></td>
                        <td style="padding: 8px; text-align: left;">This is a prompt consultation</td>
                      </tr>
                      `
                    }
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








        return Response.sendResponse(res, {
            msg: '201',
            lang: req.params.lang
        });
    }catch(e){
        console.log(e);
        return next({ msg: 3067 });
    }
   
}

module.exports ={
    sendListPropertyForm
}