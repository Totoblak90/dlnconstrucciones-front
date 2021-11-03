module.exports = (sequelize, DataTypes) => {

    const cols = {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        subtitle: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        text: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }

    const config = {
        tableName: 'contents',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    }

    const Content = sequelize.define("Content", cols, config);

    Content.associate = function (models) {
        Content.belongsTo(models.Service, {
            as: "Services",
            foreignKey: "services_a_id"
        })
    }


    return Content;

}