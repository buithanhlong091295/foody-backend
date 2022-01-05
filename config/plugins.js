module.exports = ({ env }) => ({
    email: {
      provider: 'nodemailer',
      providerOptions: {
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        ssl: true,
        tls: true,
          
        auth: {
            user: "FoodyAppKLTN@gmail.com",
            pass: "admin@12345",
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: 'noreply@recipee.com',
        defaultReplyTo: 'nonreply@recipee.com',
      },
    },
  });