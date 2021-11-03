module.exports = (sequelize, DataTypes) => {

    const cols = {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        balance: {
            type: DataTypes.BIGINT.UNSIGNED,
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
        tableName: 'projects',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    }

    const Project = sequelize.define("Project", cols, config);

    Project.associate = function (models) {
        Project.belongsTo(models.User, {
            as: "Users",
            foreignKey: "users_id"
        })
    }


    return Project;

}