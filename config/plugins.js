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
            user: "buithanhlong091295@gmail.com",
            pass: "NhungOc1996!",
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: 'noreply@recipee.com',
        defaultReplyTo: 'nonreply@recipee.com',
      },
    },
  });