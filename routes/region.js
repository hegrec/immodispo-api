var util = require('../lib/util');

module.exports = function(app, models) {
    app.get('/regions', (req, res) => {
        const filter = util.queryToFilter(req.query);

        models.region.find(filter)
          .then(result => res.send(result));
    });

    app.get('/regions/:id', (req, res) => {
        const filter = util.queryToFilter(req.query);


        if (filter.where) {
            filter.where.id = { eq: req.params.id };
        } else {
            filter.where = { id: { eq: req.params.id } };
        }


        models.region.find(filter)
          .then(result => res.send(result));
    });
};
