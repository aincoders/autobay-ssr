import DirectionsCarOutlined from '@mui/icons-material/DirectionsCarOutlined';
import AutoBayAndroidIcon192 from 'src/assets/image/favicon/auto_bay/android-icon-192x192.png';
import AutoBayAppleIcon114 from 'src/assets/image/favicon/auto_bay/apple-icon-114x114.png';
import AutoBayAppleIcon120 from 'src/assets/image/favicon/auto_bay/apple-icon-120x120.png';
import AutoBayAppleIcon144 from 'src/assets/image/favicon/auto_bay/apple-icon-144x144.png';
import AutoBayAppleIcon152 from 'src/assets/image/favicon/auto_bay/apple-icon-152x152.png';
import AutoBayAppleIcon180 from 'src/assets/image/favicon/auto_bay/apple-icon-180x180.png';
import AutoBayAppleIcon57 from 'src/assets/image/favicon/auto_bay/apple-icon-57x57.png';
import AutoBayAppleIcon60 from 'src/assets/image/favicon/auto_bay/apple-icon-60x60.png';
import AutoBayAppleIcon72 from 'src/assets/image/favicon/auto_bay/apple-icon-72x72.png';
import AutoBayAppleIcon76 from 'src/assets/image/favicon/auto_bay/apple-icon-76x76.png';
import AutoBayFavicon16 from 'src/assets/image/favicon/auto_bay/favicon-16x16.png';
import AutoBayFavicon32 from 'src/assets/image/favicon/auto_bay/favicon-32x32.png';
import AutoBayFavicon96 from 'src/assets/image/favicon/auto_bay/favicon-96x96.png';
import AutoBayFavicon from 'src/assets/image/favicon/auto_bay/favicon.png';
import AutoBayMsIcon144 from 'src/assets/image/favicon/auto_bay/ms-icon-144x144.png';

export const HEADER = {
    H_MOBILE: 56,
    H_MAIN_DESKTOP: 88,
    H_DASHBOARD_DESKTOP: 64,
    H_DASHBOARD_DESKTOP_OFFSET: 92 - 32,

    MOBILE_HEIGHT: 56,
    MAIN_DESKTOP_HEIGHT: 88,
    DASHBOARD_DESKTOP_HEIGHT: 64,
    DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
};
export const DRAWER = {
    MOBILE_HEIGHT: '90%',
    MAIN_DESKTOP_HEIGHT: '30%',
};
export const NAV = {
    W_BASE: 260,
    W_DASHBOARD: 280,
    W_DASHBOARD_MINI: 88,
    //
    H_DASHBOARD_ITEM: 48,
    H_DASHBOARD_ITEM_SUB: 36,
    //
    H_DASHBOARD_ITEM_HORIZONTAL: 32,
};

export const NAVBAR = {
    BASE_WIDTH: 260,
    DASHBOARD_WIDTH: 280,
    DASHBOARD_COLLAPSE_WIDTH: 88,
    //
    DASHBOARD_ITEM_ROOT_HEIGHT: 46,
    DASHBOARD_ITEM_SUB_HEIGHT: 40,
    DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const ICON = {
    NAV_ITEM: 24,
    NAV_ITEM_HORIZONTAL: 22,
    NAV_ITEM_MINI: 22,
};

export const SPACING = {
    xs: 2,
    md: 5,
};

export const APP_NAME = 'AutoBay';
export const COMPANY_ID = '2';
export const WORKSHOP_TYPE_ID = '2';
export const VEHICLE_TYPE_ICON = DirectionsCarOutlined;
export const WORKSHOP_TYPE = 'Car';

export const defaultSettings = {
    themeMode: 'light',
    themeDirection: 'ltr',
    themeColorPresets: 'purple',
    themeLayout: 'vertical',
    themeStretch: true,
};

export function getIconList() {
    let metaIcon = { AppleIcon57: '', AppleIcon60: '', AppleIcon72: '', AppleIcon76: '', AppleIcon114: '', AppleIcon120: '', AppleIcon144: '', AppleIcon152: '', AppleIcon180: '', FavIcon: '', FavIcon16: '', FavIcon32: '', FavIcon96: '', AndroidIcon192: '', MsIcon144: '', ThemeColor: '', TileColor: '', };
    metaIcon = {
        AppleIcon57: AutoBayAppleIcon57,
        AppleIcon60: AutoBayAppleIcon60,
        AppleIcon72: AutoBayAppleIcon72,
        AppleIcon76: AutoBayAppleIcon76,
        AppleIcon114: AutoBayAppleIcon114,
        AppleIcon120: AutoBayAppleIcon120,
        AppleIcon144: AutoBayAppleIcon144,
        AppleIcon152: AutoBayAppleIcon152,
        AppleIcon180: AutoBayAppleIcon180,
        FavIcon: AutoBayFavicon,
        FavIcon16: AutoBayFavicon16,
        FavIcon32: AutoBayFavicon32,
        FavIcon96: AutoBayFavicon96,
        AndroidIcon192: AutoBayAndroidIcon192,
        MsIcon144: AutoBayMsIcon144,
    };

    return { metaIcon, };
}


