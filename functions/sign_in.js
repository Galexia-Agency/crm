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

let response = {
  statusCode: 500
}

exports.handler = async function handler (event, context, callback) {
  if (event.headers.authorization) {
    const accessToken = event.headers.authorization.split(' ')
    response = await axios.post(`${process.env.OKTA_ISSUER}/oauth2/default/v1/introspect?client_id=${process.env.OKTA_CLIENT_ID}`,
      new URLSearchParams({
        token: accessToken[1],
        token_type_hint: 'access_token'
      }).toString(),
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    if (event.httpMethod === 'OPTIONS') {
      return callback(null, {
        statusCode: 200,
        headers,
        body: ''
      })
    } else if (response.data.active === true) {
      try {
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
      } catch (e) {
        return callback(null, {
          statusCode: response.statusCode,
          headers,
          body: JSON.stringify(e, response)
        })
      }
    } else {
      return callback(null, {
        statusCode: 401,
        headers,
        body: '401 - Unauthorized'
      })
    }
  } else {
    return callback(null, {
      statusCode: 401,
      headers,
      body: '401 - Unauthorized'
    })
  }
}
