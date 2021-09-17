const validator = require('validator')

const { EmailValidator } = require('../../../src/lib/validator')
const { ParametroObrigatorioError } = require('../../../src/lib/error')

const makeSut = () => {
  return new EmailValidator()
}

jest.mock('validator', () => ({
  isEmailValid: true,

  isEmail(email) {
    this.email = email
    return this.isEmailValid
  },
}))

describe('Email Validator', () => {
  test('deve retornar true se validator retornar true', () => {
    const sut = makeSut()

    const isEmailValid = sut.isValid('email_valido@mail.com')

    expect(isEmailValid).toBe(true)
  })

  test('deve retornar false se validator retornar false', () => {
    validator.isEmailValid = false
    const sut = makeSut()

    const isEmailValid = sut.isValid('email_invalido@mail.com')

    expect(isEmailValid).toBe(false)
  })

  test('deve chamar validator com o e-mail correto', () => {
    const email = 'email_valido@mail.com'
    const sut = makeSut()

    sut.isValid(email)

    expect(validator.email).toBe(email)
  })

  test('deve lançar uma exceção se o e-mail não for informado', () => {
    const sut = makeSut()

    expect(() => sut.isValid()).toThrow(new ParametroObrigatorioError('E-mail'))
  })
})
