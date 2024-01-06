// ----------------------------------------------------------------------

function path(root, sublink) {
    return `${root}${sublink}`;
}

export const ROOTS_AUTH = '';
export const ROOTS_DASHBOARD = '/dashboard';
export const ROOTS_USER = '/user';
export const ROOTS_CUSTOMER = '/customer';
export const ROOTS_CART = '/cart';
export const ROOTS_BLOG = '/blog';
export const ROOTS_NEWS_MEDIA = '/news-media';
export const ROOTS_FLEET_MANAGEMNT = '/fleet-management';

export const PATH_PAGE = {
    comingSoon: '/coming-soon',
    maintenance: '/maintenance',
    pricing: '/pricing',
    payment: '/payment',
    about: '/about-us',
    contact: '/contact-us',
    faqs: '/faqs',
    notFound: '/not-found',
    page404: '/404',
    page500: '/500',
    components: '/components',
    customer: '/customer',
};

export const PATH_CUSTOMER = {
    root: ROOTS_CUSTOMER,
    profile: path(ROOTS_CUSTOMER, '/profile'),
    vehicle: path(ROOTS_CUSTOMER, '/vehicle'),
    address: path(ROOTS_CUSTOMER, '/address'),
    estimate: path(ROOTS_CUSTOMER, '/estimate'),
    orders: path(ROOTS_CUSTOMER, '/orders'),
    wallet: path(ROOTS_CUSTOMER, '/wallet'),
    
    ordersDetails: (orderID) => path(ROOTS_CUSTOMER, `/orders/${orderID}`),
    estimateDetails: (estimateID) => path(ROOTS_CUSTOMER, `/estimate/${estimateID}`),
};

export const PATH_FLEET_MANAGEMNT = {
    root: ROOTS_FLEET_MANAGEMNT,
    vehicle: path(ROOTS_FLEET_MANAGEMNT, '/vehicle/'),
    service_reminder: path(ROOTS_FLEET_MANAGEMNT, '/service_reminder/'),
    document_reminder: path(ROOTS_FLEET_MANAGEMNT, '/document_reminder/'),
    vehicle_photo: path(ROOTS_FLEET_MANAGEMNT, '/vehicle_photo/'),
    driver: path(ROOTS_FLEET_MANAGEMNT, '/driver/'),

};



export const PATH_BLOG = {
    root: ROOTS_BLOG,
    details: (blogID) => path(ROOTS_BLOG, `/${blogID}`),
};

export const PATH_NEWS_MEDIA = {
    root: ROOTS_NEWS_MEDIA,
    details: (newsSlug) => path(ROOTS_NEWS_MEDIA, `/${newsSlug}`),
};
