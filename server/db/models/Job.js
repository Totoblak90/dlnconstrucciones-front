module.exports = (sequelize, DataTypes) => {

    const cols = {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
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
        tableName: 'jobs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    }

    const Job = sequelize.define("Job", cols, config);

    Job.associate = function (models) {
        Job.belongsTo(models.Type, {
            as: "Types",
            foreignKey: "types_id"
        })
    }


    return Job;

}