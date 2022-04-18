import __cookie from './cookie.js'

function tokenName (name) {
  name = name || this.currentToken

  if (name) {
    return name
  }

  // eslint-disable-next-line no-useless-call
  if (this.impersonating.call(this)) {
    return this.options.tokenImpersonateName
  }

  return this.options.tokenDefaultName
}

function isLocalStorageSupported () {
  try {
    if (!window.localStorage || !window.sessionStorage) {
      // eslint-disable-next-line no-throw-literal
      throw 'exception'
    }

    localStorage.setItem('storage_test', 1)
    localStorage.removeItem('storage_test')

    return true
  } catch (e) {
    return false
  }
}

function isCookieSupported () {
  return true
}

function processToken (action, name, token) {
  // eslint-disable-next-line one-var
  var i, ii,
    args = [tokenName.call(this, name)]

  if (token) {
    args.push(token)
  }

  for (i = 0, ii = this.options.tokenStore.length; i < ii; i++) {
    if (this.options.tokenStore[i] === 'localStorage' && isLocalStorageSupported()) {
      return localStorage[action + 'Item'](args[0], args[1])
    } else if (this.options.tokenStore[i] === 'cookie' && isCookieSupported()) {
      return __cookie[action].apply(this, args)
    }
  }
}

export default {
  get: function (name) {
    return processToken.call(this, 'get', name)
  },

  set: function (name, token) {
    return processToken.call(this, 'set', name, token)
  },

  remove: function (name) {
    return processToken.call(this, 'remove', name)
  },

  expiring: function () {
    return false
  }
}
