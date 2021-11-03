const db = require('../db/models');

module.exports = {
    index: (req, res, next) => {
        db.Service.findAll()
        .then(services => {
          

          var response = {
            meta: {
                status: 200,
            },
            data: [
                ...services
            ]
        }
        res.json(response)
        })
        .catch(err => console.log(err))
    },
    detail: (req, res, next) => {
        db.Service.findByPk(req.params.id, {
            include: [
                {
                    association: "Pictures"
                },
                {
                    association: "Contents"
                }
            ]
        })
        .then(service => {
          

          var response = {
            meta: {
                status: 200,
            },
            data: service
        }
        res.json(response)
        })
        .catch(err => console.log(err))
    },
    
}