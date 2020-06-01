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
    app.use('/api/contracts', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true ,onProxyReq: restream}));

}
module.exports = configureApiProxy
