describe('Index', () => {
  test('should call app listen', () => {
    jest.mock('../../src/main/app', () => ({
      listen(port, callback) {
        if (callback) {
          callback()
        }
      },
    }))
    const mock = jest.requireMock('../../src/main/app')
    const listen = jest.spyOn(mock, 'listen')
    require('../../src/main/index')
    expect(listen).toHaveBeenCalledTimes(1)
  })
})
