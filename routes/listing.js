var util = require('../lib/util');

module.exports = function(app, models) {
  app.get('/listings', (req, res) => {
    const filter = util.queryToFilter(req.query);

    models.listing.find(filter)
      .then(result => res.send(result));
  });

  app.get('/listings/:id', (req, res) => {
    const filter = util.queryToFilter(req.query);


    if (filter.where) {
      filter.where.id = { eq: req.params.id };
    } else {
      filter.where = { id: { eq: req.params.id } };
    }


    models.listing.find(filter)
      .then(result => res.send(result));
  });

  app.post('/listings', (req, res) => {
    const newListing = {
        price: req.body.price,
        description: req.body.description,
        num_rooms: req.body.num_rooms,
        num_bathrooms: req.body.num_bathrooms,
        num_bedrooms: req.body.num_bedrooms,
        construction_type: req.body.construction_type,
        listing_url: req.body.listing_url,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        land_size: req.body.land_size,
        interior_size: req.body.interior_size,
        total_size: req.body.total_size,
        year_built: req.body.year_built,
        is_rental: req.body.is_rental,
        feature_score: req.body.feature_score,
        views: req.body.views,
        agency_id: req.body.agency_id,
        town_id: req.body.town_id
    };

    req.checkBody('price', 'must be an integer').isInt();
    req.checkBody('agency_id', 'must be an integer').isInt();
    req.checkBody('town_id', 'must be an integer').isInt();




    Promise.all([
      req.getValidationResult(),
      models.agency.exists(req.body.agency_id),
      models.town.exists(req.body.town_id)
    ])
      .then((result) => {
        const validationResult = result[0];
        const agencyExists = result[1];
        const townExists = result[2];

        if (!validationResult.isEmpty()) {
          return res.status(400).send(JSON.stringify(validationResult.array()));
        }

        if (!agencyExists) {
          return res.status(400).send('agency does not exist');
        }

        if (!townExists) {
          return res.status(400).send('town does not exist');
        }

        models.listing.create(newListing)
          .then(result => res.status(201).send(result))
          .catch(error => console.error(error) && res.status(500))
      });
  });

  app.put('/listings/:id', (req, res) => {
    res.send(`PUT listing #${req.params.id}`);
  });

  app.delete('/listings/:id', (req, res) => {
    res.send(`DELETE listing #${req.params.id}`);
  });

  app.post('/listings/:id/images', (req, res) => {
    models.listingImage.create(req.params.id, req.body)
      .then(result => res.status(201).send(result))
      .catch(error => console.error(error) && res.status(500));
  });

  app.post('/listings/:id/details', (req, res) => {
    req.checkBody('key', 'must be a non-empty value').notEmpty();
    req.checkBody('value', 'must be a non-empty value').notEmpty();

    Promise.all([
      req.getValidationResult(),
      models.listing.exists(req.params.id)
    ])
      .then((result) => {
        const validationResult = result[0];
        const listingExists = result[1];

        if (!validationResult.isEmpty()) {
          return res.status(400).send(JSON.stringify(validationResult.array()));
        }

        if (!listingExists) {
          return res.status(400).send('listing does not exist');
        }

        return models.listingDetail.create(req.params.id, req.body)
      })
      .then(result => res.status(201).send(result))
      .catch(error => console.error(error) && res.status(500));
  });
};
