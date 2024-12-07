const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5002',  // Change this to your Express backend URL and port
      changeOrigin: true,
    })
  );
};
