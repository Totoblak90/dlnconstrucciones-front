const db = require('../db/models');

module.exports = {
    index: (req, res, next) => {
        db.Job.findAll()
        .then(jobs => {
          

          var response = {
            meta: {
                status: 200,
            },
            data: [
                ...jobs
            ]
        }
        res.json(response)
        })
        .catch(err => console.log(err))
    },
    detail: (req, res, next) => {
        db.Job.findByPk(req.params.id)
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