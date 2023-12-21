import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { Provider as ReduxProvider } from 'react-redux';
import 'simplebar-react/dist/simplebar.min.css';
import { getIconList } from 'src/config-global';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import { AuthProvider } from '../auth/JwtContext';
import { MotionLazyContainer } from '../components/animate';
import ProgressBar from '../components/progress-bar';
import { SettingsProvider, ThemeSettings } from '../components/settings';
import SnackbarProvider from '../components/snackbar';
import ThemeLocalization from '../locales';
import '../locales/i18n';
import { ApiProvider } from '../mycontext/ApiContext';
import { store } from '../redux/store';
import ThemeProvider from '../theme';
import createEmotionCache from '../utils/createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

MyApp.propTypes = {
    Component: PropTypes.elementType,
    pageProps: PropTypes.object,
    emotionCache: PropTypes.object,
};

export default function MyApp(props) {
    const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;
    const getLayout = Component.getLayout ?? ((page) => page);

    const currentCity = pageProps?.referenceData?.currentCity || '';
    const currentVehicle = pageProps?.referenceData?.currentVehicle || { make: "", model: "" };
    const schemaInfo = pageProps?.referenceData?.schemaInfo || '';


    useEffect(() => {
        TagManager.initialize({ gtmId: 'GTM-PLZ8VK2' });
    }, []);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loader = document.getElementById('globalLoader');
            if (loader) {
                loader.remove();
            }
        }
    }, []);



    return (
        <>
            <AppCacheProvider {...props}>
                <Head>
                    <script src="https://www.googletagmanager.com/gtag/js?id=G-7PNRPTY48V" strategy="beforeInteractive" />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', 'G-7PNRPTY48V');
                            `,
                        }}
                    />
                    {currentCity &&
                        <>
                            <meta name="geo.region" content={currentCity?.geo_region} />
                            <meta name="geo.placename" content={currentCity?.region_name} />
                            <meta name="geo.position" content={`${currentCity?.latitude};${currentCity?.longitude}`} />
                            <meta name="ICBM" content={`${currentCity?.latitude}, ${currentCity?.longitude}`} />
                        </>
                    }
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                    <link rel="apple-touch-icon" sizes="57x57" href={getIconList().metaIcon.AppleIcon57.src} />
                    <link rel="apple-touch-icon" sizes="60x60" href={getIconList().metaIcon.AppleIcon60.src} />
                    <link rel="apple-touch-icon" sizes="72x72" href={getIconList().metaIcon.AppleIcon72.src} />
                    <link rel="apple-touch-icon" sizes="76x76" href={getIconList().metaIcon.AppleIcon76.src} />
                    <link rel="apple-touch-icon" sizes="114x114" href={getIconList().metaIcon.AppleIcon114.src} />
                    <link rel="apple-touch-icon" sizes="120x120" href={getIconList().metaIcon.AppleIcon120.src} />
                    <link rel="apple-touch-icon" sizes="144x144" href={getIconList().metaIcon.AppleIcon144.src} />
                    <link rel="apple-touch-icon" sizes="152x152" href={getIconList().metaIcon.AppleIcon152.src} />
                    <link rel="apple-touch-icon" sizes="180x180" href={getIconList().metaIcon.AppleIcon180.src} />
                    <link rel="icon" type="image/png" href={getIconList().metaIcon.FavIcon.src} />
                    <link rel="icon" type="image/png" sizes="16x16" href={getIconList().metaIcon.FavIcon16.src} />
                    <link rel="icon" type="image/png" sizes="32x32" href={getIconList().metaIcon.FavIcon32.src} />
                    <link rel="icon" type="image/png" sizes="96x96" href={getIconList().metaIcon.FavIcon96.src} />
                    <link rel="icon" type="image/png" sizes="192x192" href={getIconList().metaIcon.AndroidIcon192.src} />
                    <meta name="msapplication-TileImage" content={getIconList().metaIcon.MsIcon144.src} />
                    <meta property="og:image" content={getIconList().metaIcon.FavIcon.src} />
                    <meta name="theme-color" content={'#E61B47'} />
                    <meta name="msapplication-TileColor" content={'#E61B47'} />

                    {schemaInfo?.area_served && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaInfo?.area_served) }} />}
                    {schemaInfo?.category && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaInfo?.category) }} />}
                    {schemaInfo?.faqs && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaInfo?.faqs) }} />}
                    {schemaInfo?.organization && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaInfo?.organization) }} />}
                    {schemaInfo?.software_application && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaInfo?.software_application) }} />}
                    {schemaInfo?.website && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaInfo?.website) }} />}
                    {schemaInfo?.webpage && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaInfo?.webpage) }} />}
                    {schemaInfo?.breadcrumb_list && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaInfo?.breadcrumb_list) }} />}
                    {schemaInfo?.product && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaInfo?.product) }} />}

                </Head>
                <AuthProvider>
                    <ReduxProvider store={store}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <SettingsProvider props={{ currentCity: currentCity, currentVehicle: currentVehicle }}>
                                <MotionLazyContainer>
                                    <ThemeProvider>
                                        <ThemeSettings>
                                            <ThemeLocalization>
                                                <SnackbarProvider>
                                                    <ApiProvider>
                                                        <div id="globalLoader" >
                                                            <div className="loader">
                                                                <div className="circle" id="circle1"></div>
                                                                <div className="circle" id="circle2"></div>
                                                                <div className="circle" id="circle3"></div>
                                                            </div>
                                                        </div>
                                                        <ProgressBar />
                                                        {getLayout(<Component {...pageProps} />)}
                                                    </ApiProvider>
                                                </SnackbarProvider>
                                            </ThemeLocalization>
                                        </ThemeSettings>
                                    </ThemeProvider>
                                </MotionLazyContainer>
                            </SettingsProvider>
                        </LocalizationProvider>
                    </ReduxProvider>
                </AuthProvider>
            </AppCacheProvider>
        </>
    );
}