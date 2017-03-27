var util = require('../lib/util');

module.exports = function(app, models) {
    app.get('/departments', (req, res) => {
        const filter = util.queryToFilter(req.query);

        models.department.find(filter)
          .then(result => res.send(result));
    });

    app.get('/departments/:id', (req, res) => {
        const filter = util.queryToFilter(req.query);


        if (filter.where) {
            filter.where.id = { eq: req.params.id };
        } else {
            filter.where = { id: { eq: req.params.id } };
        }


        models.department.find(filter)
          .then(result => res.send(result));
    });
};
