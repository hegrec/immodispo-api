var util = require('../lib/util');

module.exports = function(app, models) {
  app.get('/icons', (req, res) => {
    const { t, ln, ls, le, lw } = req.query;

    const filter = {
      where: {
        latitude: { gt: ls, lt: ln },
        longitude: { gt: lw, lt: le },
      },
      include: ['Town'],
      limit: 100
    };

    if (t) {
      filter.where.town_id = { eq: t };
    }

    models.listing.find(filter)
      .then(result => {
        return {
          total: result.meta.total,
          result: result.body.map(r => ({
            la: r.latitude,
            ln: r.longitude,
            p: r.price,
            id: r.id
          }))
        };
      })
      .then(result => res.send(result));
  });
};
