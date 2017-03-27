'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.createTable(
        'listing',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          createdAt: {
            type: Sequelize.DATE
          },
          updatedAt: {
            type: Sequelize.DATE
          },
          price: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          description: {
            type: Sequelize.TEXT,
            collate: 'utf8_general_ci'
          },
          num_rooms: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          num_bathrooms: Sequelize.INTEGER,
          num_bedrooms: Sequelize.INTEGER,
          construction_type: Sequelize.INTEGER,
          listing_url: Sequelize.STRING,
          latitude: Sequelize.FLOAT,
          longitude: Sequelize.FLOAT,
          land_size: Sequelize.FLOAT,
          interior_size: Sequelize.FLOAT,
          total_size: Sequelize.FLOAT,
          year_built: Sequelize.INTEGER,
          is_rental: Sequelize.INTEGER,
          feature_score: Sequelize.INTEGER,
          views: Sequelize.INTEGER,
          agency_id: Sequelize.INTEGER,
          town_id: Sequelize.INTEGER,
        },
        {
          engine: 'InnoDB',
          charset: 'utf8',
        }
      ),

      queryInterface.createTable(
        'listing_detail',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          createdAt: {
            type: Sequelize.DATE
          },
          updatedAt: {
            type: Sequelize.DATE
          },
          key: {
            type: Sequelize.STRING,
            collate: 'utf8_general_ci'
          },
          value: {
            type: Sequelize.STRING,
            length: '1024',
            collate: 'utf8_general_ci'
          },
          listing_id: Sequelize.INTEGER,
        },
        {
          engine: 'InnoDB',
          charset: 'utf8',
        }
      ),

      queryInterface.createTable(
        'listing_image',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          createdAt: {
            type: Sequelize.DATE
          },
          updatedAt: {
            type: Sequelize.DATE
          },
          filename: Sequelize.STRING,
          listing_id: Sequelize.INTEGER,
        },
        {
          engine: 'InnoDB',
          charset: 'utf8',
        }
      ),

      queryInterface.createTable(
        'agency',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          createdAt: {
            type: Sequelize.DATE
          },
          updatedAt: {
            type: Sequelize.DATE
          },
          name: {
            type: Sequelize.STRING,
            collate: 'utf8_general_ci'
          },
          image: Sequelize.STRING,
          address_1: {
            type: Sequelize.STRING,
            collate: 'utf8_general_ci'
          },
          address_2: {
            type: Sequelize.STRING,
            collate: 'utf8_general_ci'
          },
          telephone: Sequelize.STRING,
          email: {
            type: Sequelize.STRING,
            collate: 'utf8_general_ci'
          },
          website: {
            type: Sequelize.STRING,
            length: 1024,
            collate: 'utf8_general_ci'
          },
          town_id: Sequelize.INTEGER,
        },
        {
          engine: 'InnoDB',
          charset: 'utf8',
        }
      ),

      queryInterface.createTable(
        'region',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          name: {
            type: Sequelize.STRING,
            collate: 'utf8_general_ci'
          },
          code: Sequelize.INTEGER,
          capital: {
            type: Sequelize.STRING,
            collate: 'utf8_general_ci'
          },
          latitude: Sequelize.FLOAT,
          longitude: Sequelize.FLOAT,
          createdAt: {
            type: Sequelize.DATE
          },
          updatedAt: {
            type: Sequelize.DATE
          },
        },
        {
          engine: 'InnoDB',
          charset: 'utf8',
        }
      ),

      queryInterface.createTable(
        'department',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          name: {
            type: Sequelize.STRING,
            collate: 'utf8_general_ci'
          },
          code: Sequelize.INTEGER,
          capital: {
            type: Sequelize.STRING,
            collate: 'utf8_general_ci'
          },
          kml: Sequelize.TEXT,
          latitude: Sequelize.FLOAT,
          longitude: Sequelize.FLOAT,
          createdAt: {
            type: Sequelize.DATE
          },
          updatedAt: {
            type: Sequelize.DATE
          },
          region_id: Sequelize.INTEGER,
        },
        {
          engine: 'InnoDB',
          charset: 'utf8',
        }
      ),

      queryInterface.createTable(
        'town',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          name: {
            type: Sequelize.STRING,
            collate: 'utf8_general_ci'
          },
          code: Sequelize.INTEGER,
          kml: Sequelize.TEXT,
          surface_area: Sequelize.FLOAT,
          population: Sequelize.INTEGER,
          latitude: Sequelize.FLOAT,
          longitude: Sequelize.FLOAT,
          createdAt: {
            type: Sequelize.DATE
          },
          updatedAt: {
            type: Sequelize.DATE
          },
          region_id: Sequelize.INTEGER,
          department_id: Sequelize.INTEGER,
        },
        {
          engine: 'InnoDB',
          charset: 'utf8',
        }
      ),
    ])

    /*
     docker run -it --link immown-mysql:mysql --rm -v /Users/chris/Workspace/immown-docker/codebases/api/install:/install mysql:5.7 \
     bash -c 'exec mysql --default-character-set=utf8 immodispo < /install/install.sql -h "mysql" -P 3306 -uimmodispo -padmin123'
     */
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropAllTables();
  }
};
