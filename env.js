module.exports = {
    LISTING_DIRECTORY: '/opt/immodispo/listingImages/',
    AGENCY_DIRECTORY: '/opt/immodispo/agencyImages/',
    port: process.env.PORT || 3001,
    host: '0.0.0.0',
    mysql: {
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT
    }
};
