const axios = require('axios')
const headers = {
  'Access-Control-Allow-Headers': 'authorization',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=15552000; preload',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': 'default-src "self"'
}

exports.handler = async function handler (event, context, callback) {
  if (event.httpMethod === 'OPTIONS') {
    return callback(null, {
      statusCode: 200,
      headers,
      body: ''
    })
  } else {
    const res = await axios.post('https://my.pandle.com/api/v1/auth/sign_in',
      {
        email: process.env.PANDLE_USERNAME,
        password: process.env.PANDLE_PASSWORD
      }
    )
    return {
      statusCode: 200,
      body: JSON.stringify(res.headers)
    }
  }
}
