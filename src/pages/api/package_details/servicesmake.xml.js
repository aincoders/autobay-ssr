import axios from "axios";
const EXTERNAL_DATA_URL = 'https://api.okmechanic.store/customer/sitemap/service_group_with_city';

function generateSiteMap(posts) {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${posts
            .map((item) => {
                return `
       <url>
           <loc>${`${process.env.NEXT_PUBLIC_SITE_URL}${item.slug}`}</loc>
           <lastmod>${item.date}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
            })
            .join('')}
   </urlset>
 `;
}


export default async (req, res) => {
    try {
        const city = req.query.city.replaceAll('_','-');
        const servicegroup = req.query.servicegroup;
        const headers = { 'applicationId': '1', 'companyId': '2', 'city': city,'servicegroup':servicegroup }
        const response = await axios.get(EXTERNAL_DATA_URL, { headers });
        const allData = response.data.result;
        const sitemap = generateSiteMap(allData);
        res.setHeader('Content-Type', 'text/xml');
        res.write(sitemap);
        res.end();
    } catch (error) {
        console.log(error);
        res.writeHead(302, { Location: '../404' });
        res.end();
    }
};
