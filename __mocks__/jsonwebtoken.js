module.exports = {
  token: 'qualquer_token',

  sign(id, secret) {
    this.id = id
    this.secret = secret

    return this.token
  },
}
