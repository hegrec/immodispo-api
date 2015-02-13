var Base = require('./Base'),
    Sequelize = require('sequelize'),
    DomainDepartment = require('./../../domain/Department');

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

    DepartmentDAO.hasOne(sequelize.models.Region);

    department.setDAO(DepartmentDAO);

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

        return domainDepartment;
    });

    return department;
}

module.exports = Department;