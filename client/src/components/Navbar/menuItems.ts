export const menuItems = [
  {
    title: 'Home',
    url: '/',
  },
  {
    title: 'About Me',
    url: '/about-me',
  },
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/hanna-garetson-b1b0ab251/',
    target: '_blank',
  },
  {
    title: 'Writing Categories ▼',
    submenu: [
      {
        title: 'Book Reports',
        url: '/book-report'
      },
      {
        title: 'Poetry',
        url: '/poetry'
      },
      {
        title: 'Storytime',
        url: '/storytime'
      },
      {
        title: 'Therapy Talks',
        url: '/therapy-talks'
      },
    ]
  },
  {
    title: 'Hi {username}',
    url: '/account',
    loggedIn: true
  },
  {
    title: 'Login',
    url: '/login',
    loggedIn: false
  }
];