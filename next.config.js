require('dotenv').config()
const withImages = require('next-images')
module.exports = {
  compress: false,
  env: {
    MYLOCAL_VAR1: 'nilesh',
    MYLOCAL_VAR2: process.env.MYLOCAL_VAR2,
    NEXT_API_URL: process.env.NEXT_API_URL,
    STRIPE_LIVE_PUBLISH_API_KEY: process.env.STRIPE_LIVE_PUBLISH_API_KEY,
    STRIPE_SANDBOX_PUBLISH_API_KEY: process.env.STRIPE_SANDBOX_PUBLISH_API_KEY,
  },
  //   env.local:{
  //     MYLOCAL_VAR1:'nilesh',
  //     MYLOCAL_VAR2:process.env.MYLOCAL_VAR2,
  //     NEXT_API_URL:process.env.NEXT_API_URL
  // },
  images: {
    // domains is an array of comma-separated strings
    domains: ['fudme-web-dev.azurewebsites.net', 'localhost', 'sqlvaq3d2b3xfm24ce.blob.core.windows.net'],
    loader: "imgix",
    path: "/",
    // the sizes define below are the defaults
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // This is 60 seconds
    minimumCacheTTL: 60
  },

  async redirects() {
    return [{
      source: '/',
      destination: '/home',
      permanent: true,
    },]
  },
  //basePath:'/home'
},
  withImages({
    webpack(config, options) {
      return config
    }
  })