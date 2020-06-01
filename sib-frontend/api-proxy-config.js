const { createProxyMiddleware } = require('http-proxy-middleware');

function configureApiProxy(app) {
    var restream = function(proxyReq, req, res, options) {
        if (req.body) {
            let bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type','application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    }
    app.use('/api/contracts', createProxyMiddleware({ target: 'http://'+process.env.API_CONTRACTS_HOST+':'+process.env.API_CONTRACTS_PORT, changeOrigin: true ,onProxyReq: restream}));
    app.use('/api/customers', createProxyMiddleware({ target: 'http://'+process.env.API_CUSTOMER_HOST+':'+process.env.API_CUSTOMER_PORT, changeOrigin: true ,onProxyReq: restream}));
    app.use('/api/products', createProxyMiddleware({ target: 'http://'+process.env.API_PRODUCT_HOST+':'+process.env.API_PRODUCT_PORT, changeOrigin: true ,onProxyReq: restream}));

}
module.exports = configureApiProxy
