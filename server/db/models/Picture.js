module.exports = (sequelize, DataTypes) => {

    const cols = {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: false
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
        tableName: 'pictures',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    }

    const Picture = sequelize.define("Picture", cols, config);

    Picture.associate = function (models) {
        Picture.belongsTo(models.Service, {
            as: "Services",
            foreignKey: "services_b_id"
        })
    }


    return Picture;

}