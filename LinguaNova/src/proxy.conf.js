/**
 * Proxy config as array so order is guaranteed: more specific paths first.
 * /PIproject/api/courses -> course-service (8081)
 * /PIproject -> user-service (8082)
 */
const PROXY_CONFIG = [
  {
    context: ['/PIproject/api/courses'],
    target: 'http://localhost:8081',
    secure: false,
    changeOrigin: true,
  },
  {
    context: ['/PIproject'],
    target: 'http://localhost:8082',
    secure: false,
    changeOrigin: true,
    pathRewrite: { '^/PIproject': '' },
  },
  {
    context: ['/api'],
    target: 'http://localhost:3000',
    secure: false,
    changeOrigin: true,
  },
];

module.exports = PROXY_CONFIG;
