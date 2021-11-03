module.exports = {
    index: (req, res, next) => {
        var response = {
            meta: {
                status: 200,
            },
            data: {
                message: 'Main Controller here'
            }
        }
        res.json(response)
    },
    interests: (req, res, next) => {
        var response = {
            meta: {
                status: 200,
            },
            data: {
                message: 'Interests endpoint here'
            }
        }
        res.json(response)
    },
    services: (req, res, next) => {
        var response = {
            meta: {
                status: 200,
            },
            data: {
                message: 'Services endpoint here'
            }
        }
        res.json(response)
    },
    
}