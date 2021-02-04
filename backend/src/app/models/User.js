import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

// Sempre importar uma model para o INDEX.JS do database

class User extends Model {
  static init(sequelize) {
    // O parametro é a conexão do banco
    super.init(
      {
        // chamando metodo init da classe model
        // Apenas os campos que o usuario tem que preencher
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        // Passando o segundo parametro com o sequelize
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
