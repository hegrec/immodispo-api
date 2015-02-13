var Base = require('./Base'),
    Sequelize = require('sequelize'),
    _ = require('lodash'),
    DomainListingDetail = require('./../../domain/ListingDetail');

function ListingDetail(sequelize) {
    var listingDetail = {};
    listingDetail.__proto__ = new Base(sequelize);

    var ListingDetailDAO = sequelize.define('ListingDetail', {
        key: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.STRING
        }
    });

    listingDetail.setDAO(ListingDetailDAO);

    var listingDataMapper = function mapListingDataModel(listingDataModel) {
        var domainListing = new DomainListingDetail();
        domainListing.id = listingDataModel.id;
        domainListing.createdAt = listingDataModel.createdAt;
        domainListing.updatedAt = listingDataModel.updatedAt;
        domainListing.key = listingDataModel.key;
        domainListing.value = listingDataModel.value;

        return domainListing;
    };

    listingDetail.setDataMapper(listingDataMapper);

    listingDetail.create = function listingDetailCreate(listingDetailData, cb) {
        var savable = ListingDetailDAO.build({
            key: listingDetailData.key,
            value: listingDetailData.value,
            ListingId: listingDetailData.listing.id
        });

        savable.save().complete(function(err, savedListingDetail) {
            if (err) throw err;
            cb(null, savedListingDetail);
        });
    };

    return listingDetail;
}

module.exports = ListingDetail;