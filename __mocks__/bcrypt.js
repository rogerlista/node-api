module.exports = {
  isValid: true,

  compare(data, hash) {
    this.data = data
    this.hash = hash

    return this.isValid
  },
}
