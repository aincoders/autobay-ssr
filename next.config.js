module.exports = {
  swcMinify: true,
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'okmechanic-wms.s3.amazonaws.com',
        port: '',
        pathname: '**',
      },
    ],
    timeout: 10000, // Set the timeout to 10 seconds (adjust as needed)

  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.okmechanic.store/customer',
    NEXT_PUBLIC_SITE_URL: "https://www.autobay.me/",
    GOOGLE_MAP_KEY: "AIzaSyASP2OLzzIbn85Rm_2Zp8_usp0jsVXigbk",
    NEXT_PUBLIC_TABBY_KEY: "pk_test_5b1eec5c-cd44-49e6-974e-7380e3ecb45e",
  },
  rewrites: async () => [

    { source: '/city.xml', destination: '/api/homepage/city.xml' },
    { source: '/city-model.xml', destination: '/api/homepage/city-model.xml' },
    { source: '/city-make.xml', destination: '/api/homepage/city-make.xml' },
    { source: '/:city-make-sitemap.xml', destination: '/api/homepage/citymake.xml' },

    { source: '/category.xml', destination: '/api/package_list/category.xml' },
    { source: '/category-model.xml', destination: '/api/package_list/category-model.xml' },
    { source: '/category-make.xml', destination: '/api/package_list/category-make.xml' },
    { source: '/:city-:category-category-sitemap.xml', destination: '/api/package_list/categorymake.xml' },

    { source: '/services.xml', destination: '/api/package_details/services.xml' },
    { source: '/services-model.xml', destination: '/api/package_details/services-model.xml' },
    { source: '/services-make.xml', destination: '/api/package_details/services-make.xml' },
    { source: '/:city-:servicegroup-service-group-sitemap.xml', destination: '/api/package_details/servicesmake.xml' },
  
  
    { source: '/:city-:category.xml', destination: '/api/package_list/categorymodel.xml' },
    { source: '/:page.xml', destination: '/api/homepage/citymodel.xml' },
  ],
};
