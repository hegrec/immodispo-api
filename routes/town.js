var util = require('../lib/util');

module.exports = function(app, models) {
    app.get('/towns', (req, res) => {
        const filter = util.queryToFilter(req.query);

        models.town.find(filter)
          .then(result => res.send(result));
    });

    app.get('/towns/:id', (req, res) => {
        const filter = util.queryToFilter(req.query);


        if (filter.where) {
            filter.where.id = { eq: req.params.id };
        } else {
            filter.where = { id: { eq: req.params.id } };
        }


        models.town.find(filter)
          .then(result => res.send(result));
    });
};
