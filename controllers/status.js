const pkg = require('../package.json')

module.exports = function (req, res) {
    res.send({
        name: pkg.name,
        status: 'ok',
        version: pkg.version
    })
}