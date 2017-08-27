import axios  from 'axios'
import qs     from 'qs'

import config from 'config'

/**
 * {access_token, token_type, expires_in (seconds)}
 */
export async function codeForAccessToken({code, redirectUri}) {
  const querystring = qs.stringify({
    client_id    : config.FB_APP_ID,
    client_secret: config.FB_APP_SECRET,
    redirect_uri : redirectUri,
    code,
  })

  const result = await axios.get(`https://graph.facebook.com/v2.10/oauth/access_token?${querystring}`)
  return result
}

export async function debugAccessToken({accessToken}) {
  await axios.get(`https://graph.facebook.com/debug_token?`)
}

export async function getUserInfo({accessToken}) {
  const result = await axios.get(`https://graph.facebook.com/v2.10/`)
}
