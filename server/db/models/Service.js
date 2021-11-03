module.exports = (sequelize, DataTypes) => {

    const cols = {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
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
        tableName: 'services',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    }

    const Service = sequelize.define("Service", cols, config);

    Service.associate = function (models) {
        Service.hasMany(models.Picture, {
            as: "Pictures",
            foreignKey: "services_b_id"
        })
        Service.hasMany(models.Content, {
            as: "Contents",
            foreignKey: "services_a_id"
        })
    }


    return Service;

}