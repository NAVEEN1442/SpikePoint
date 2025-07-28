const nodemailer = require("nodemailer");

const mailSender = async (email,title,body)=>{

    try {
        let transporter =  nodemailer.createTransport({
            host:process.env.MAIL_SEND_HOST,
            port: 465, 
            secure: true,
            auth:{
                user : process.env.SENDER_MAIL ,
                pass : process.env.SENDER_PASS,
            }
        })
    
        let info = await transporter.sendMail({
            
            from:"Verification Email from Gathering Astrologers",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })

        console.log("mail info",info);
        return info;
    } 
    
    catch (error) {
        console.error(error.message);
    }
    

}

module.exports = mailSender;
