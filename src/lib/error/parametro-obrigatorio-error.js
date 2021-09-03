module.exports = class ParametroObrigatorioError extends Error {
  constructor(nomeDoParametro) {
    super(`${nomeDoParametro} é obrigatório.`)
    this.name = this.constructor.name
  }
}
