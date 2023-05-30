module.exports = ({ env }) => ({
  // ...
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      // providerOptions: {
      //   apiKey: env('SENDGRID_API_KEY'),
      // },
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: env('SMTP_USERNAME'),
        defaultReplyTo: env('SMTP_USERNAME'),
      },
    },
  },
  upload: {
    config: {
        provider: 'strapi-provider-upload-supabase-storage',
        providerOptions: {
            apiKey: env('SUPABASE_API_KEY'),
            apiUrl: env('SUPABASE_API_URL'),
            bucket: env('SUPABASE_BUCKET'),
        },
        breakpoints: {
          xlarge: 1920,
          large: 1000,
          medium: 750,
          small: 500,
          xsmall: 64,
        },
    },
  },
  // ...
});
