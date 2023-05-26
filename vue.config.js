// This code exports a configuration object that sets up a development server with a proxy configuration.
// The proxy configuration allows requests made to the '/api' path to be redirected to 'https://swapi.dev'.
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://swapi.dev', // The target URL where requests will be redirected to.
        changeOrigin: true, // Changes the origin of the request to match the target URL.
        pathRewrite: {
          '^/api': '' // Rewrites the path of the request by removing the '/api' prefix.
        }
      }
    }
  }
};