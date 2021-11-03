const db = require('../db/models');

module.exports = {
    index: (req, res, next) => {
        db.Batch.findAll()
        .then(batches => {
          

          var response = {
            meta: {
                status: 200,
            },
            data: [
                ...batches
            ]
        }
        res.json(response)
        })
        .catch(err => console.log(err))
    },
    detail: (req, res, next) => {
        db.Batch.findByPk(req.params.id, {
            include: [
                {
                    association: "Images"
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