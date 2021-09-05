class EmailValidator {
  isValid(email) {
    return true
  }
}

describe('Email Validator', () => {
  test('deve retornar true se validator retornar true', () => {
    const sut = new EmailValidator()

    const isValid = sut.isValid('email_valido@mail.com')

    expect(isValid).toBe(true)
  })
})
