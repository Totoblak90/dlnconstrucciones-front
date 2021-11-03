const db = require('../db/models');

module.exports = {
    index: (req, res, next) => {
        db.Type.findAll()
        .then(types => {
          

          var response = {
            meta: {
                status: 200,
            },
            data: [
                ...types
            ]
        }
        res.json(response)
        })
        .catch(err => console.log(err))
    },
    detail: (req, res, next) => {
        db.Type.findByPk(req.params.id, {
            include: [
                {
                    association: "Jobs"
                }
            ]
        })
        .then(jobs => {
          

          var response = {
            meta: {
                status: 200,
            },
            data: jobs
        }
        res.json(response)
        })
        .catch(err => console.log(err))
    },
    
}