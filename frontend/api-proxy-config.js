const { createProxyMiddleware } = require('http-proxy-middleware');

function configureApiProxy(app) {
    app.use('/api/contracts', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));

}
module.exports = configureApiProxy
