var Hoek = require('hoek');
var util = require('./../../lib/util');
var _ = require('lodash');
function Base(sequelize) {
    var self = this;
    var dataMapper = null;
    var daoObject;
    var availableIncludes = [];



    function mapDataToModel(dataModel) {
        if (_.isUndefined(dataMapper)) {
            throw new Error('Data model not mapped to domain');
        }

        return dataMapper(dataModel);
    }

    function setDataMapper(mappingFunction) {
        dataMapper = mappingFunction;
    }

    function setDAO(daoObj, includes) {
        daoObject = daoObj;
        availableIncludes = includes;
    }

    /**
     * Custom query parameter find for domain models
     * queryParams = {
     *     sort: 'fieldName' OR '-fieldName' for DESC
     *     limit: 100
     * }
     * @param params
     * @param cb
     */
    function find(params, cb) {

        if (_.isUndefined(cb)) {
            cb = params;
            params = {};
        }

        var filters = this.buildFilterParams(params);

        var daoIncludes = [];
        if (filters.include) {
            _.each(filters.include, function(associateModel) {
                if (_.includes(availableIncludes, associateModel)) {
                    daoIncludes.push(sequelize.models[associateModel]);
                }
            });
        }

        filters.include = daoIncludes;


        try {
            daoObject.findAndCountAll(filters).then(function (result) {
                var rows = result.rows,
                    count = result.count,
                    domainModels = [];

                _.each(rows, function (dataRow) {
                    domainModels.push(mapDataToModel(dataRow.dataValues));
                });

                var response = new require("./../../lib/api_response");
                response.body = domainModels;


                response.meta.total = count;
                cb(null, response);

            });
        } catch (e) {
            throw new Error(e);
        }
    }

    function setTableName(newTableName) {
        tableName = newTableName;
    }

    function setSchema(modelSchema) {
        baseSchema = Hoek.applyToDefaults(baseSchema, modelSchema);
    }

    function buildFilterParams(params) {
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
    }

    return {
        find: find,
        setTableName: setTableName,
        setSchema: setSchema,
        setDataMapper: setDataMapper,
        setDAO: setDAO,
        buildFilterParams: buildFilterParams
    };
}

module.exports = Base;