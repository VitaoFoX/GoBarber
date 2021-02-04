import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    // O parametro é a conexão do banco
    super.init(
      {
        // chamando metodo init da classe model
        // Apenas os campos que o usuario tem que preencher
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      {
        // Passando o segundo parametro com o sequelize
        sequelize,
      }
    );
    return this;
  }
}

export default File;
