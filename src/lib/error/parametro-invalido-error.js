module.exports = class ParametroInvalidoError extends Error {
  constructor(nomeDoParametro) {
    super(`${nomeDoParametro} inválido`)
    this.name = this.constructor.name
  }
}
