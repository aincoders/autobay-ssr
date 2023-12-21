const siteUrl = 'https://www.autobay.me/';

module.exports = {
	siteUrl,
	changefreq: 'daily',
	priority: 0.7,
	sitemapSize: 5000,
	generateRobotsTxt: true,
	generateIndexSitemap: true,
	exclude: ['/404', '/package_detail', '/package_list', '/categorymodel.xml', '/citymodel.xml', '/customer/*', '/tabby-payment/*', '/tap-payment'],
	robotsTxtOptions: {
		policies: [
			{ userAgent: "*", allow: "/" },
			{
				userAgent: "*",
				disallow: ["/404", '/package_detail', '/package_list', '/categorymodel.xml', '/citymodel.xml', '/customer/*','/tabby-payment/*', '/tap-payment'],
			},
		],
		additionalSitemaps: [
			`${siteUrl}city.xml`,
			`${siteUrl}city-model.xml`,
			`${siteUrl}city-make.xml`,

			`${siteUrl}category.xml`,
			`${siteUrl}category-model.xml`,
			`${siteUrl}category-make.xml`,

			`${siteUrl}services.xml`,
			`${siteUrl}services-make.xml`,
			`${siteUrl}services-model.xml`
		],
	},

};