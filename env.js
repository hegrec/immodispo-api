module.exports = {
    LISTING_DIRECTORY: '/opt/immodispo/listingImages/',
    AGENCY_DIRECTORY: '/opt/immodispo/agencyImages/',
    port: 3001,
    host: '0.0.0.0',
    mysql: {
        database: 'immodispo',
        username: 'immodispo',
        password: 'devpassword',
        host: '127.0.0.1',
        port: 3306
    },
    users: {
        web: {
            username: 'web',
            password: 'web',
            name: 'Web Application',
            id: 1
        },
        crawl: {
            username: 'crawl',
            password: 'crawl',
            name: 'Crawl Application',
            id: 1
        },
        admin: {
            username: 'admin',
            password: 'admin',
            name: 'Crawl Application',
            id: 1
        }
    }
};