const db = require('../db/models');

module.exports = {
    index: (req, res, next) => {
        db.Interest.findAll()
        .then(interests => {
          

          var response = {
            meta: {
                status: 200,
            },
            data: [
                ...interests
            ]
        }
        res.json(response)
        })
        .catch(err => console.log(err))
        
    },
    
}