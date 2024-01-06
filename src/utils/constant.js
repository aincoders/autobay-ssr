/* eslint-disable import/no-unresolved */
import { APP_NAME, WORKSHOP_TYPE } from 'src/config-global';

export const ESTIMATE_STATUS_CREATED = '1';
export const ESTIMATE_STATUS_REJECTED = '2';
export const ESTIMATE_STATUS_SENT = '3';
export const ESTIMATE_STATUS_APPROVED = '4';
export const ESTIMATE_STATUS_CONVERTED = '5';

export const TIMEOUT = 'TIMEOUT';
export const INTERNET_NETWORK_ERROR = 'Network Error';
export const API_PAGE_LIMIT = 12;
export const RUPEE_SYMBOL = '₹';
export const SMALL_MODAL = 'sm';
export const MEDIUM_MODAL = 'md';
export const LARGE_MODAL = 'lg';
export const EXTRA_LARGE_MODAL = 'xl';

export const CUSTOMER_KEY = 'q2w3qs3de3ddd@sasweddwwwe#';

export const NEXT_IMAGE_QUALITY = 90;

export const FUEL_TYPE_OPTION = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];

export const ADDRESS_TYPE = ['HOUSE', 'OFFICE', 'APARTMENT','OTHERS'];

export const NOT_EXIST_CHECK = ['premium', 'garage', 'request-quote', 'our-services', 'cart'];

export const GENERAL = 'general';
export const SPECIFIC = 'specific';
export const CUSTOM = 'custom';

export const DRAFT = 'draft';
export const PUBLISED = 'published';

export const SLUG_CHECK = 'slug_verify';
export const SLUG_CHECK_TEST = 'slug_verify_test';


export const AUTH_API = {
    logIn: 'login',
    logOut: 'login/logout',
};

export const COMPANY_API = {
    create: 'company/create',
    update: 'company/update',
};


export const WORKSHOP_TYPE_API = {
    list: 'workshop_type',
    update: 'workshop_type/update',
    create: 'workshop_type/create',
};

export const SEO_PAGE_TYPE = {
    homePage: 'HOME_PAGE',
    aboutUs: 'ABOUT_US',
    ourService: 'OUR_SERVICE',
    blog: 'BLOG',
    contact: 'CONTACT',
    packageList: 'PACKAGE_LIST',
    packageDetails: 'PACKAGE_DETAILS',
    workshop: 'WORKSHOP',
    partner: 'PARTNER',
    ownFranchise: 'OWN_FRANCHISE',
    requestQuote: 'REQUEST_QUOTE',
    membership: 'MEMBERSHIP',
    blogDetails: 'BLOG_DETAILS',
}



export const CUSTOMER_API = {
    profile:"profile",
    industry:"industry",
    getSeo: 'seo',
    geo_location: 'getlocation',
    service: 'package_homepage',
    getMake: 'vehiclemake',
    getModel: 'vehiclemodel',
    profileUpdate: 'profile/update',
    updateProfilePhoto: 'profile/update_profile_photo',
    updateCrMedia: 'profile/update_cr_media',
    updateVatMedia: 'profile/vat_certificate_media',
    deleteAccountRequest: 'profile/delete_account_request',
    getAddress: 'customer_address',
    addAddress: 'customer_address/create',
    updateAddress: 'customer_address/update',
    deleteAddress: 'customer_address/delete',
    addVehicle: 'customer_vehicle/create',
    updateVehicle: 'customer_vehicle/update',
    deleteVehicle: 'customer_vehicle/delete',
    updateDefaultVehicle: 'customer_vehicle/update_default',
    getVehicle: 'customer_vehicle',
    getTimeSlot: 'timeslot',
    getOrders: 'order',
    referEarn: 'referearn',
    referEarnApply: 'referearn/apply',
    cashbackTransaction: 'cashback_transaction',
    orderReview: 'orderreview',
    saveFeedback: 'orderreview/save_feedback',
    saveFeedbackEstimate: 'orderreview/save_feedback_estimate',

    getOrderDetails: 'order/details',
    orderPlaced: 'order/order_place',
    orderPlacedMail: 'ordermail/order_placed_mail',
    

    orderCancel: 'order/order_cancel',
    createLead: 'lead/create',
    createLeadContact: 'lead/contact_us',
    popularBrand: 'vehiclemake/populer',
    luxuryBrand: 'vehiclemake/luxury',
    createBusinessCustomer: 'create_bussiness_customer',
    garage: 'garage',
    cancelReason: 'cancel_reason',
    requestQuote: 'requestquote/create',

    getEstimate: 'estimate',
    getEstimateDetails: 'estimate/details',
    approvedEstimate: 'estimate/approved_estimate',
    rejectEstimate: 'estimate/rejected_estimate',

    shareEstimate: 'shareestimate',
    shareEstimateReject: 'shareestimate/rejected_estimate',
    shareEstimateApproved: 'shareestimate/approved_estimate',

    createTapPayment: 'tabpayment/make_payment_link',
    retrieveTabPayment: 'tabpayment/retrieve_payment',

    createTabbyPayment: 'tabbypayment/make_payment_link',
    createWebhook: 'tabbypayment/create_webhook',
    retrieveCheckoutSession: 'tabbypayment/retrieve_checkout_session',

    categoryWhyChoose: 'category_why_choose',
    requestToAddVehicle: 'vehicle_not_list/create',

    notification: 'notification',
    notificationCount: 'notification/count',
    readNotification: 'notification/read_notification',
    
    getRfqService: 'rfq_services',
    downloadOrderPaymentReceipt: 'order_payment_receipt/download',

    //fleet
    vehicleDetail:"/fleet_management/vehicle/details",
    servicereminder:"/fleet_management/servicereminder",
    fleetService:"/fleet_management/services",
    serviceReminderCreate:"/fleet_management/servicereminder/create",
    serviceReminderDelete:"/fleet_management/servicereminder/delete",
    serviceReminderUpdate:"fleet_management/servicereminder/update",
    fleet_vehicle_photo_create:"fleet_management/vehiclephoto/create",
    fleet_vehicle_photo_list:"fleet_management/vehiclephoto",
    fleet_vehicle_photo_delete:"fleet_management/vehiclephoto/delete",
    fleet_request_to_sell_vehicle:"fleet_management/vehicle/request_to_sell_vehicle",

    fleet_management_driver:"fleet_management/driver",
    fleet_management_driver_create:"fleet_management/driver/create",
    fleet_management_driver_update_status:"fleet_management/driver/update_status",
    fleet_management_driver_update:"fleet_management/driver/update",
    fleet_management_vehicledriver_assign:"fleet_management/vehicledriver/assign_driver",
    fleet_management_vehicledriver:"fleet_management/vehicledriver",
    fleet_management_vehicledriver_delete_driver :"/fleet_management/vehicledriver/delete_driver",
    fleet_management_document_type:"fleet_management/document_type",
    fleet_management_document_reminder_create:"fleet_management/document_reminder/create",
    fleet_management_document_reminder:"fleet_management/document_reminder",
    fleet_management_document_reminder_delete:"fleet_management/document_reminder/delete",
    fleet_management_document_reminder_update:"fleet_management/document_reminder/update",
    fleet_management_servicegroup:"fleet_management/servicegroup",

    fleet_management_document_reminder_upload_document:"fleet_management/document_reminder/upload_document",
    fleet_management_document_reminder_documents_list:"fleet_management/document_reminder/documents_list",
    fleet_management_document_reminder_delete_document:"fleet_management/document_reminder/delete_document",


};
export const REGION_API = {
    list: 'region',
    update: 'region/update',
    create: 'region/create',
};
export const S3_BUCKET_API = {
    uploadImage: 's3_bucket',
};

export const CITY_API = {
    list: 'city',
    getNearCity: 'city/nearby_city',
    detectMyLocationCity: 'location/detect_my_location',
    locationAllCity: 'location/get_cities',
};

export const AREA_API = {
    list: 'area',
};

export const HOME_PAGE_API = {
    list: 'homepage_section',
    getSectionList: 'homepage_section/homepage_section_list',
};

export const SCHEMA_API = {
    homePage: 'schema/home_page',
    packageList: 'schema/service_list_page',
    packageDetail: 'schema/service_details_page',
    ourService: 'schema/our_service_page',
    faq: 'schema/faqs_page',
    requestQuote: 'schema/request_quote_page',
    otherPage: 'schema/other_page_schema',
};
export const HOW_IT_WORK = 'how_it_work';
export const FAQ_API = 'faq';
export const GARAGE_API = 'garage';
export const SETTING_API = 'setting';

export const CUSTOMER_REVIEW_API = {
    list:'customerreview',
    allReview: "customerreview/all_review"
}

export const CART_API = {
    list: 'cart',
    addToCart: 'cart/add_to_cart',
    removeToCart: 'cart/delete_cart_item',
    customerDefaultAddress: 'cart/customer_default_address',
};

export const PROMO_CODE_API = {
    list: 'promo_code',
    apply: 'promo_code/apply',
};

export const OTP_API = {
    sendOtp: 'otp/send_otp',
    verifyOtp: 'otp/verify_otp',
};

export const DOWNLOAD_APP_API = {
    sendSms: 'downloadapp/send_sms',
};

export const COUNTRY_API = 'country';
export const LOGIN_API = 'login';
export const SEARCH_PACKAGE = 'search';
export const PREMIUM_PACKAGE = 'premium';

export const PACKAGE_LIST_API = {
    packageCategory: 'package',
    packageSection: 'package_section',
};

export const PACKAGE_DETAIL_API = {
    details: 'service_group/package_details',
};

export const BLOG_API = {
    list: 'blog',
    details: 'blog/details',
};

export const NEWS_MEDIA_API = {
    list: 'news_media',
    details: 'news_media/details',
};

export const ABOUT_API = 'about_us';
export const OUR_SERVICE_API = 'category';

export const META_TAG = {
    homePageTitle: `Expert ${WORKSHOP_TYPE} Service and Repair in $CITY_NAME | Doorstep and In-Garage`,
    homePageDesc: `Need expert ${WORKSHOP_TYPE} service and repair in $CITY_NAME? Look no further than our garage. Our experienced mechanics provide a range of services, from regular maintenance to major repairs, to keep your vehicle running smoothly. And with our convenient doorstep service, we make it easy to get the care you need, wherever you are in $CITY_NAME. Or, if you prefer, visit our garage for top-quality care. Book now and experience the convenience and quality of our ${WORKSHOP_TYPE} service and repair in $CITY_NAME.`,

    packageListTitle: `Affordable and Quality ${WORKSHOP_TYPE} Service Packages in $CITY_NAME | Periodic Services, ${WORKSHOP_TYPE} Washing, RSA, and More`,
    packageListDesc: `Affordable and Quality ${WORKSHOP_TYPE} Service Packages in $CITY_NAME | Periodic Services, ${WORKSHOP_TYPE} Washing, RSA, and More Looking for affordable and quality ${WORKSHOP_TYPE} service packages in $CITY_NAME? Look no further than our experienced ${WORKSHOP_TYPE} service and repair garage. We offer a range of packages that cover everything from periodic services and ${WORKSHOP_TYPE} washing to RSA, tyre services, A/C services, custom services & repairs, denting & painting, clutch and body parts, and more. Our skilled technicians use top-quality products and equipment to ensure your ${WORKSHOP_TYPE} gets the care it deserves. And with our doorstep service and convenient location, we make it easy for you to get the care you need. Book now and experience the convenience and quality of our ${WORKSHOP_TYPE} service packages in $CITY_NAME.`,

    packageDetailTitle: `Quality ${WORKSHOP_TYPE} Service Package in $CITY_NAME | $PACKAGE_NAME | Affordable and Convenient`,
    packageDetailDesc: `Keep your ${WORKSHOP_TYPE} in top condition with our quality ${WORKSHOP_TYPE} service package in $CITY_NAME. Our $PACKAGE_NAME package includes a range of services to suit your needs, all performed by our experienced technicians using top-quality products. Whether you need an oil change, tyre rotation, or brake inspection, we've got you covered. And with our affordable prices and convenient doorstep service, it's never been easier to keep your ${WORKSHOP_TYPE} running smoothly. Book now and experience the convenience and quality of our $PACKAGE_NAME ${WORKSHOP_TYPE} service package in $CITY_NAME.`,

    premiumTitle: `Become an ${APP_NAME} Turbo Customer and Save on ${WORKSHOP_TYPE} Services in $CITY_NAME | Join Our Program Today`,
    premiumDesc: `Looking to save more on your ${WORKSHOP_TYPE} services in $CITY_NAME? Join our premium customer program today and enjoy exclusive benefits and discounts. Our program offers a range of perks, including discounted rates on services, priority booking, free doorstep service, and more. With our experienced technicians and top-quality products, you can trust us to take great care of your ${WORKSHOP_TYPE}. And with our convenient location and flexible scheduling, it's never been easier to get the care you need. Don't miss out on these great savings – join our premium customer program now and start enjoying the benefits!`,

    contactTitle: `Contact ${APP_NAME} | Get in Touch with Our ${WORKSHOP_TYPE} Service and Repair Experts Today`,
    contactDesc: `Have a question or need assistance with your ${WORKSHOP_TYPE}? Contact ${APP_NAME} today and get in touch with our ${WORKSHOP_TYPE} service and repair experts. Our friendly and knowledgeable staff are here to help you with all of your needs, from scheduling appointments to answering questions about our services. And with our convenient location and flexible scheduling, it's never been easier to get the care you need. Contact us today and experience the convenience and quality of our services.`,

    requestQuoteTitle: `Request Quote ${APP_NAME} | Get in Touch with Our ${WORKSHOP_TYPE} Service and Repair Experts Today`,
    requestQuoteDesc: `Have a question or need assistance with your ${WORKSHOP_TYPE}? Contact ${APP_NAME} today and get in touch with our ${WORKSHOP_TYPE} service and repair experts. Our friendly and knowledgeable staff are here to help you with all of your needs, from scheduling appointments to answering questions about our services. And with our convenient location and flexible scheduling, it's never been easier to get the care you need. Contact us today and experience the convenience and quality of our services.`,

    garageTitle:`Garage Locators | ${APP_NAME}`,
    garageDesc:`Garage Locators | ${APP_NAME}`,

    faqTitle: `Frequently Asked Questions | ${APP_NAME} ${WORKSHOP_TYPE} Service and Repair`,
    faqDesc: `Have questions about our ${WORKSHOP_TYPE} service and repair? Check out our frequently asked questions (FAQs) for answers to some of the most common inquiries we receive. Our experts have compiled a list of questions and answers to help you better understand our services and what we offer. And if you still have questions, don't hesitate to contact us. We're always happy to help.`,

    termsTitle: `${APP_NAME} ${WORKSHOP_TYPE} Service and Repair | Terms and Conditions`,
    termsDesc: `At ${APP_NAME}, we're committed to providing our customers with the best possible ${WORKSHOP_TYPE} service and repair. To ensure that we meet the highest standards of quality and professionalism, we've established a set of terms and conditions that govern our services. These terms and conditions outline the responsibilities of both ${APP_NAME} and our customers, and help us to maintain a positive and productive relationship with our clients. To learn more about our terms and conditions, please visit our website.`,

    privacyTitle: `${APP_NAME} ${WORKSHOP_TYPE} Service and Repair | Privacy Policy`,
    privacyDesc: `At ${APP_NAME}, we understand the importance of protecting your privacy and personal information. That's why we've established a comprehensive privacy policy that outlines how we collect, use, and safeguard your data. Our privacy policy covers everything from the information we collect when you use our services to how we store and share your data. We're committed to maintaining your trust and confidence, and we take your privacy seriously. To learn more about our privacy policy, please visit our website.`,

    cancelTitle: `${APP_NAME} ${WORKSHOP_TYPE} Service and Repair | Cancellation Policy`,
    cancelDesc: `At ${APP_NAME}, we understand that sometimes plans change, and you may need to cancel or reschedule your ${WORKSHOP_TYPE} service appointment. To help you understand our cancellation policy and ensure a smooth and hassle-free experience, we've established a clear and straightforward policy for cancellations and rescheduling. Our policy outlines the deadlines and fees associated with cancellations, as well as the process for rescheduling your appointment. We want to make sure that you have all the information you need to make the best decision for your needs, so please visit our website to learn more. `,

    aboutTitle: `${APP_NAME} ${WORKSHOP_TYPE} Service and Repair | About Us`,
    aboutDesc: `${APP_NAME} ${WORKSHOP_TYPE} Service and Repair | About Us`,

    ourServiceTitle: `Our Service in $CITY_NAME | ${APP_NAME}`,
    ourServiceDesc: `Our Service in $CITY_NAME | ${APP_NAME}`,

    blogTitle: `Blog | ${APP_NAME}`,
    blogDesc: `Blog | ${APP_NAME}`,


    newsMediaTitle: `News & Media | ${APP_NAME}`,
    newsMediaDesc: `News & Media | ${APP_NAME}`,

    cartTitle: `Cart | ${APP_NAME}`,
    cartDesc: `Cart | ${APP_NAME}`,

    reviewTitle: `Review | ${APP_NAME}`,
    reviewDesc: `Review | ${APP_NAME}`,

    blogDetailTitle: `$BLOG_TITLE | ${WORKSHOP_TYPE} Service and Repair Tips from Experts | $CITY_NAME Garage`,
    blogDetailDesc: `Looking for ${WORKSHOP_TYPE} service and repair tips from experts? Check out our latest blog post, '$BLOG_TITLE,' from $CITY_NAME Garage. Our experienced technicians share their expertise on everything from ${WORKSHOP_TYPE} maintenance and repair to industry news and trends. Whether you're a ${WORKSHOP_TYPE} enthusiast or just looking to keep your ${WORKSHOP_TYPE} running smoothly, you'll find valuable insights and advice in our blog. And when it's time for your next service or repair, trust the experts at $CITY_NAME Garage. Book now and experience the convenience and quality of our services.`,

    footerAbout: `Need expert ${WORKSHOP_TYPE} service and repair in $CITY_NAME? Look no further than our garage. Our experienced mechanics provide a range of services, from regular maintenance to major repairs, to keep your vehicle running smoothly. And with our convenient doorstep service, we make it easy to get the care you need, wherever you are in $CITY_NAME. Or, if you prefer, visit our garage for top-quality care. Book now and experience the convenience and quality of our ${WORKSHOP_TYPE} service and repair in $CITY_NAME.`,
};
