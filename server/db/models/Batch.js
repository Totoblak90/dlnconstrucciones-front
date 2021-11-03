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
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        sold: {
            type: DataTypes.ENUM('true', 'false'),
            allowNull: false,
            defaultValue: 'false'
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
        tableName: 'batches',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    }

    const Batch = sequelize.define("Batch", cols, config);

    Batch.associate = function (models) {
        Batch.belongsTo(models.Category, {
            as: "Categories",
            foreignKey: "categories_id"
        })
        Batch.hasMany(models.Image, {
            as: "Images",
            foreignKey: "batches_id"
        })
    }


    return Batch;

}