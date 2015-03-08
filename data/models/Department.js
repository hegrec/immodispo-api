var Base = require('./Base'),
    _ = require('lodash'),
    Sequelize = require('sequelize'),
    DomainDepartment = require('./../../domain/Department'),
    DomainTown = require('./../../domain/Town');

function Department(sequelize) {
    var department = {};
    department.__proto__ = new Base(sequelize);

    var DepartmentDAO = sequelize.define('Department', {
            name: {
                type: Sequelize.STRING
            },
            code: {
                type: Sequelize.INTEGER
            },
            capital: {
                type: Sequelize.STRING
            },
            kml: {
                type: Sequelize.STRING
            },
            latitude: {
                type: Sequelize.FLOAT
            },
            longitude: {
                type: Sequelize.FLOAT
            }

        },
        {
            tableName: 'Departments'
        }
    );



    department.setDAO(DepartmentDAO, ['Region', 'Town']);

    department.setDataMapper(function mapDepartmentDataModel(departmentDataModel) {
        var domainDepartment = new DomainDepartment();
        domainDepartment.id = departmentDataModel.id;
        domainDepartment.createdAt = departmentDataModel.createdAt;
        domainDepartment.updatedAt = departmentDataModel.updatedAt;
        domainDepartment.name = departmentDataModel.name;
        domainDepartment.code = departmentDataModel.code;
        domainDepartment.capital = departmentDataModel.capital;
        domainDepartment.kml = departmentDataModel.kml;
        domainDepartment.latitude = departmentDataModel.latitude;
        domainDepartment.longitude = departmentDataModel.longitude;

        if (departmentDataModel.Towns) {
            domainDepartment.towns = [];
            _.each(departmentDataModel.Towns, function(townModel) {
                var town = new DomainTown();
                town.id = townModel.dataValues.id;
                town.name = townModel.dataValues.name;
                town.code = townModel.dataValues.code;
                town.kml = townModel.dataValues.kml;
                town.surface_area = townModel.dataValues.surface_area;
                town.population = townModel.dataValues.population;
                town.latitude = townModel.dataValues.latitude;
                town.longitude = townModel.dataValues.longitude;
                domainDepartment.towns.push(town);
            });
        }


        return domainDepartment;
    });

    department.initialize = function() {
        DepartmentDAO.hasMany(sequelize.models.Town);
        DepartmentDAO.belongsTo(sequelize.models.Region);
    };

    return department;
}

module.exports = Department;