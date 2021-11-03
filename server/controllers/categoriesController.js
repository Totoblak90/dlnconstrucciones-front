const db = require('../db/models');

module.exports = {
    index: (req, res, next) => {
        db.Category.findAll()
        .then(categories => {
          

          var response = {
            meta: {
                status: 200,
            },
            data: [
                ...categories
            ]
        }
        res.json(response)
        })
        .catch(err => console.log(err))
    },
    detail: (req, res, next) => {
        db.Category.findByPk(req.params.id, {
            include: [
                {
                    association: "Batches"
                }
            ]
        })
        .then(batch => {
          

          var response = {
            meta: {
                status: 200,
            },
            data: batch
        }
        res.json(response)
        })
        .catch(err => console.log(err))
    },
    
}