export default {

  request: function (req, token) {
    this.options.http._setHeaders.call(this, req, {Authorization: 'Bearer ' + token})
  },

  response: function (res) {
    // eslint-disable-next-line one-var
    var headers = this.options.http._getHeaders.call(this, res),
      token = headers.Authorization || headers.authorization

    if (token) {
      // eslint-disable-next-line no-useless-escape
      token = token.split(/Bearer\:?\s?/i)

      return token[token.length > 1 ? 1 : 0].trim()
    }
  }
}
