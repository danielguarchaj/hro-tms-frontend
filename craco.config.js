const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@atoms': path.resolve(__dirname, 'src/components/atoms'),
      '@molecules': path.resolve(__dirname, 'src/components/molecules'),
      '@organisms': path.resolve(__dirname, 'src/components/organisms'),
      '@pages': path.resolve(__dirname, 'src/components/pages'),
      '@templates': path.resolve(__dirname, 'src/components/templates'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@redux': path.resolve(__dirname, 'src/redux'),
      '@reducers': path.resolve(__dirname, 'src/redux/reducers'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
    },
  },
};