const validator = require('validator')

class EmailValidator {
  isValid(email) {
    return validator.isEmail(email)
  }
}

describe('Email Validator', () => {
  test('deve retornar true se validator retornar true', () => {
    const sut = new EmailValidator()

    const isEmailValid = sut.isValid('email_valido@mail.com')

    expect(isEmailValid).toBe(true)
  })

  test('deve retornar false se validator retornar false', () => {
    validator.isEmailValid = false
    const sut = new EmailValidator()

    const isEmailValid = sut.isValid('email_invalido@mail.com')

    expect(isEmailValid).toBe(false)
  })
})
