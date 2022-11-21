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
  }
  if (event.headers.authorization) {
    const accessToken = event.headers.authorization.split(' ')
    let oktaResponse
    try {
      oktaResponse = await axios.post(`${process.env.OKTA_ISSUER}/oauth2/default/v1/introspect?client_id=${process.env.OKTA_CLIENT_ID}`,
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
    } catch (e) {
      if (e.response && e.response.status) {
        return callback(null, {
          statusCode: e.response.status,
          headers,
          body: JSON.stringify(e)
        })
      }
      return callback(null, {
        statusCode: 500,
        headers,
        body: JSON.stringify(e)
      })
    }
    if (event.body && oktaResponse.data.active === true) {
      axios.interceptors.request.use(function (config) {
        config.headers['access-token'] = event.headers['access-token']
        config.headers.client = event.headers.client
        config.headers.uid = event.headers.uid
        return config
      })
      const data = JSON.parse(event.body)
      try {
        if (data.type === 'POST') {
          const response = await axios.post('https://my.pandle.com/api/v1' + data.url, data.body)
          return callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify(response.data)
          })
        } else if (data.type === 'GET') {
          const response = await axios.get('https://my.pandle.com/api/v1' + data.url)
          return callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify(response.data)
          })
        } else if (data.type === 'PATCH') {
          const response = await axios.patch('https://my.pandle.com/api/v1' + data.url, data.body)
          return callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify(response.data)
          })
        }
      } catch (e) {
        if (e.response && e.response.status) {
          return callback(null, {
            statusCode: e.response.status,
            headers,
            body: JSON.stringify(e)
          })
        }
        return callback(null, {
          statusCode: 500,
          headers,
          body: JSON.stringify(e)
        })
      }
    }
  }
  return callback(null, {
    statusCode: 401,
    headers,
    body: '401 - Unauthorized'
  })
}
