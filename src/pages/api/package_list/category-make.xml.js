import axios from "axios";
const EXTERNAL_DATA_URL = 'https://api.okmechanic.store/customer/sitemap/package_category';

function generateSiteMap(data) {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${data
          .map((item) => {
            return `
          <sitemap>
            <loc>${`${process.env.NEXT_PUBLIC_SITE_URL}${item.slug.replaceAll('-','_')}-${item.category_slug}-category-sitemap.xml`}</loc>
          </sitemap>
        `;
          })
          .join('')}
      </sitemapindex>
    `;
  }


export default async (req, res) => {
    try {
        const headers = { 'applicationId': '1', 'companyId': '2' }
        const response = await axios.get(EXTERNAL_DATA_URL, { headers });
        const cityData = response.data.result;
        const sitemap = generateSiteMap(cityData);
        res.setHeader('Content-Type', 'text/xml');
        res.write(sitemap);
        res.end();
    } catch (error) {
        console.log(error);
        res.writeHead(302, { Location: '../404' });
        res.end();
    }
};
