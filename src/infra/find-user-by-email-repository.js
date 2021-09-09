module.exports = class FindUserByEmailRepository {
  constructor(userModel) {
    this.userModel = userModel
  }

  async find(email) {
    return await this.userModel.findOne(
      {
        email,
      },
      {
        projection: {
          senha: true,
        },
      }
    )
  }
}
