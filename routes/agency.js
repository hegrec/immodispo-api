var util = require('../lib/util');

module.exports = function(app, models) {
  app.get('/agencies', (req, res) => {
    const filter = util.queryToFilter(req.query);

    models.agency.find(filter)
      .then(result => res.send(result));
  });

  app.get('/agencies/:id', (req, res) => {
    const filter = util.queryToFilter(req.query);


    if (filter.where) {
      filter.where.id = { eq: req.params.id };
    } else {
      filter.where = { id: { eq: req.params.id } };
    }


    models.agency.find(filter)
      .then(result => res.send(result));
  });

  app.post('/agencies', (req, res) => {
    const agencyModel = {
      name: req.body.name,
      image: req.body.image,
      address_1: req.body.address_1,
      address_2: req.body.address_2,
      telephone: req.body.telephone,
      email: req.body.email,
      website: req.body.website,
      town_id: req.body.town_id
    };

    req.checkBody('town_id', 'must be an integer').isInt();
    req.checkBody('name', 'must be a non-empty string').notEmpty();

    Promise.all([
      req.getValidationResult(),
      models.town.exists(req.body.town_id)
    ])
      .then((result) => {
        const validationResult = result[0];
        const townExists = result[1];

        if (!validationResult.isEmpty()) {
          return res.status(400).send(JSON.stringify(validationResult.array()));
        }

        if (!townExists) {
          return res.status(400).send('Town does not exist');
        }

        return models.agency.create(agencyModel);
      })
      .then(result => res.status(201).send(result))
      .catch(error => console.error(error) && res.status(500));
  });
};
