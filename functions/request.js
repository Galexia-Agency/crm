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
    } else if (event.body && response.data.active === true) {
      axios.interceptors.request.use(function (config) {
        config.headers['access-token'] = event.headers['access-token']
        config.headers.client = event.headers.client
        config.headers.uid = event.headers.uid
        return config
      })
      const data = JSON.parse(event.body)
      if (data.type === 'POST') {
        try {
          response = await axios.post('https://my.pandle.com/api/v1' + data.url, data.body)
          return callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify(response.data)
          })
        } catch (e) {
          return callback(null, {
            statusCode: response.statusCode,
            headers,
            body: JSON.stringify(e, response)
          })
        }
      } else if (data.type === 'GET') {
        try {
          response = await axios.get('https://my.pandle.com/api/v1' + data.url)
          return callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify(response.data)
          })
        } catch (e) {
          return callback(null, {
            statusCode: response.statusCode,
            headers,
            body: JSON.stringify(e, response)
          })
        }
      } else if (data.type === 'PATCH') {
        try {
          response = await axios.patch('https://my.pandle.com/api/v1' + data.url, data.body)
          return callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify(response.data)
          })
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
          body: ''
        })
      }
    } else {
      return callback(null, {
        statusCode: 401,
        headers,
        body: ''
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
