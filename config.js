var config = {
  host: 'localhost',
  port: 3000,
  path: '/api',
  mongoUri: 'mongodb://localhost/nodejstask'
};

module.exports = config;

module.exports.requestOptions = {
  baseUrl: 'http://' + config.host + ':' + config.port + config.path,
  json: true
};
