module.exports = class ServerError extends Error {
  constructor() {
    super('Ops, alguma coisa deu errado')
    this.name = this.constructor.name
  }
}
