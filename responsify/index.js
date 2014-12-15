exports.register = function (server, options, next) {

    /**
     * Look into the request URL and pull out: start, limit, etc
     * @param request
     */
    function buildQueryParams(request) {
        var queryParams = {};

        if (request.query.limit && Number(request.query.limit)) {
            queryParams.limit = Number(request.query.limit);
        }

        if (request.query.start && Number(request.query.start)) {
            queryParams.start = Number(request.query.start);
        }
    }

    /**
     * Look into the request URL and pull out: start, limit, etc
     * @param request
     */
    function buildMetaData(request, results) {
        var metaData = {};
        metaData.current = request.url.href;
    }

    server.decorate('server', 'buildMetaData', buildMetaData);
};

exports.register.attributes = {
    name: 'database',
    version: '1.0.0'
};