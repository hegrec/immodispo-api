var Base = require('./base');
var Sequelize = require('sequelize');
var _ = require('lodash');

function ListingDetail(sequelize) {
    var listingDetail = {};
    listingDetail.__proto__ = new Base(sequelize);

    var ListingDetailDAO = sequelize.define('listing_detail', {
        key: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true,
        tableName: 'listing_detail'
    });

    listingDetail.setDAO(ListingDetailDAO);

    var listingDataMapper = function mapListingDataModel(listingDataModel) {
        var domainListing = {};
        domainListing.id = listingDataModel.id;
        domainListing.createdAt = listingDataModel.createdAt;
        domainListing.updatedAt = listingDataModel.updatedAt;
        domainListing.key = listingDataModel.key;
        domainListing.value = listingDataModel.value;

        return domainListing;
    };

    listingDetail.setDataMapper(listingDataMapper);

    listingDetail.create = function listingDetailCreate(listingId, listingDetailData) {
        return ListingDetailDAO.create({
            key: listingDetailData.key,
            value: listingDetailData.value,
            listing_id: listingId
        });
    };

    return listingDetail;
}

module.exports = ListingDetail;
