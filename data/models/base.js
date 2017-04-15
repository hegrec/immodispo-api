var util = require('./../../lib/util');
var _ = require('lodash');

function Base(sequelize) {
  this.availableIncludes = [];
  this.daoObject = null;
  this.dataMapper = null;
  this.sequelize = sequelize;
}

Base.prototype.mapDataToModel = function(dataModel) {
  if (_.isUndefined(this.dataMapper)) {
    throw new Error('Data model not mapped to domain');
  }

  return this.dataMapper(dataModel);
};

Base.prototype.setDataMapper = function(mappingFunction) {
  this.dataMapper = mappingFunction;
};

Base.prototype.setDAO = function(daoObj, includes = []) {
  this.daoObject = daoObj;
  this.availableIncludes = includes.reduce((map, associateModel) => {
    map[associateModel] = this.sequelize.models[associateModel];

    return map;
  }, {});
};

  /**
   * Custom query parameter find for domain models
   * queryParams = {
     *     sort: 'fieldName' OR '-fieldName' for DESC
     *     limit: 100
     * }
   * @param params
   */
Base.prototype.find = function(params = {}) {
  const filters = this.buildFilterParams(params);

  return this.daoObject.findAndCountAll(filters).then((result) => {
    var rows = result.rows,
      count = result.count,
      domainModels = [];

    _.each(rows, (dataRow) => {
      domainModels.push(this.mapDataToModel(dataRow.dataValues));
    });

    var response = new require("./../../lib/api_response");
    response.body = domainModels;


    response.meta.total = count;

    return response;
  });
};

Base.prototype.exists = function(id) {
  const filter = {
    where: { id }
  };

  return this.daoObject.count(filter)
    .then(result => result > 0);
};

Base.prototype.findById = function(id) {
  return this.daoObject.findById(id);
};

Base.prototype.buildFilterParams = function(params) {
  var ormFilter = {};

  if (_.isString(params.sort)) {
    if (params.sort.charAt(0) == '-') {
      params.sort = params.sort.substr(1);
      ormFilter.order = [[params.sort,'DESC']];
    } else {
      ormFilter.order = [[params.sort,'ASC']];
    }
  }

  if (_.isArray(params.include)) {
    ormFilter.include = params.include;
  }

  if (_.isNumber(params.limit)) {
    ormFilter.limit = Math.min(500,params.limit);
  } else {
    ormFilter.limit = 20;
  }

  if (_.isNumber(params.start)) {
    //subtract 1 because if they enter start 1, we don't want to offset 1
    ormFilter.offset = params.start - 1;
  }

  if (params.include) {
    ormFilter.include = params.include
      .filter(associateModel => this.availableIncludes[associateModel])
      .map(validModelName => this.availableIncludes[validModelName]);
  }

  if (_.isObject(params.where)) {
    ormFilter.where = {};
    _.forOwn(params.where, function(filter, columnName) {
      if (_.isObject(filter)) {
        ormFilter.where[columnName] = {};
        _.forOwn(filter, function (value, operation) {
          switch(operation) {
            case 'eq':
              ormFilter.where[columnName] = value;
              break;
            case 'gt':
              ormFilter.where[columnName].gt = value;
              break;
            case 'lt':
              ormFilter.where[columnName].lt = value;
              break;
            case 'startswith':
              ormFilter.where[columnName].like = value + '%';
              break;
            case '$or':
              ormFilter.where[columnName]['$or'] = value;
              break;
          }
        });
      }
    });
  }
  return ormFilter;
};

module.exports = Base;
