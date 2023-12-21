import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
// utils
import localStorageAvailable from '../../utils/localStorageAvailable';
//
import { useAuthContext } from 'src/auth/useAuthContext';
import axios from 'src/utils/axios';
import { COUNTRY_API, SETTING_API } from 'src/utils/constant';
import useLocalStorage from '../../hooks/useLocalStorage';
import { defaultSettings } from 'src/config-global';
import getColorPresets, { defaultPreset, presetsOption } from './presets';
import { setCountryTypeHeader } from 'src/utils/utils';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

// ----------------------------------------------------------------------

const initialState = {
    ...defaultSettings,
    // Mode
    onToggleMode: () => {},
    onChangeMode: () => {},
    // Direction
    onToggleDirection: () => {},
    onChangeDirection: () => {},
    onChangeDirectionByLang: () => {},
    // Layout
    onToggleLayout: () => {},
    onChangeLayout: () => {},
    // Contrast
    onToggleContrast: () => {},
    onChangeContrast: () => {},
    // Color
    onChangeColorPresets: () => {},
    presetsColor: defaultPreset,
    presetsOption: [],
    basicInfo: [],
    // Stretch
    onToggleStretch: () => {},
    // Reset
    onResetSetting: () => {},
    onChangeCity: () => {},
    onChangeVehicle: () => {},
};

// ----------------------------------------------------------------------

export const SettingsContext = createContext(initialState);

export const useSettingsContext = () => {
    const context = useContext(SettingsContext);

    if (!context) throw new Error('useSettingsContext must be use inside SettingsProvider');

    return context;
};

// ----------------------------------------------------------------------

SettingsProvider.propTypes = {
    children: PropTypes.node,
};

export function SettingsProvider({ children,props }) {
    const [themeMode, setThemeMode] = useState(defaultSettings.themeMode);
    const [themeLayout, setThemeLayout] = useState(defaultSettings.themeLayout);
    const [themeStretch, setThemeStretch] = useState(defaultSettings.themeStretch);
    const [themeContrast, setThemeContrast] = useState(defaultSettings.themeContrast);
    const [themeDirection, setThemeDirection] = useState(defaultSettings.themeDirection);
    const [themeColorPresets, setThemeColorPresets] = useState(defaultSettings.themeColorPresets);

    const getCity = getCookie('currentCity_v1')
    const getVehicle = getCookie('currentVehicle');

    const city = getCity ? JSON.parse(getCity) : ""
    const vehicle = getVehicle ? JSON.parse(getVehicle) :{ make: "", model: "" }


    const [currentCity, setCurrentCity] = useState(props?.currentCity?props?.currentCity: city);
    const [currentVehicle, setCurrentVehicle] = useState(props?.currentVehicle?props?.currentVehicle: vehicle);

    const { isInitialized } = useAuthContext();
    const [basicInfo, setBasicInfo] = useState([]);

    const getSetting = useCallback(async () => {
        try {
            const response = await axios.get(SETTING_API);
            setBasicInfo(response.data.result.list);
        } catch (error) {
            if (error.status === 401) {
                localStorage.clear();
                location.replace('/');
            }
        }
    }, []);

    useEffect(() => {
        if (isInitialized && currentCity?.city_master_id) {
            getSetting();
        }
    }, [isInitialized, currentCity?.city_master_id, getSetting]);

    const storageAvailable = localStorageAvailable();

    const langStorage = storageAvailable ? localStorage.getItem('i18nextLng') : '';

    const isArabic = langStorage === 'ar';

    useEffect(() => {
        if (isArabic) {
            onChangeDirectionByLang('ar');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isArabic]);

    useEffect(() => {
        if (storageAvailable) {
            const mode = getCookie('themeMode') || defaultSettings.themeMode;
            const layout = getCookie('themeLayout') || defaultSettings.themeLayout;
            const stretch = getCookie('themeStretch') || defaultSettings.themeStretch;
            const contrast = getCookie('themeContrast') || defaultSettings.themeContrast;
            const direction = getCookie('themeDirection') || defaultSettings.themeDirection;
            const colorPresets = getCookie('themeColorPresets') || defaultSettings.themeColorPresets;
            setThemeMode(mode);
            setThemeLayout(layout);
            setThemeStretch(stretch);
            setThemeContrast(contrast);
            setThemeDirection(direction);
            setThemeColorPresets(colorPresets);

           
        }
    }, [storageAvailable]);


    const [countryList, setCountryList] = useLocalStorage('countryList', []);
    useEffect(() => {
        async function getCountryList() {
            try {
                const response = await axios.get(COUNTRY_API);
                setCountryList(response.data.result);
            } catch (error) {
                console.error(error);
            }
        }
        getCountryList();
    }, []);

    
    // Mode
    const onToggleMode = useCallback(() => {
        const value = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(value);
        setCookie('themeMode', value);
    }, [themeMode]);
    

    const onChangeMode = useCallback((event) => {
        const { value } = event.target;
        setThemeMode(value);
        setCookie('themeMode', value);
    }, []);

    // Direction
    const onToggleDirection = useCallback(() => {
        const value = themeDirection === 'rtl' ? 'ltr' : 'rtl';
        setThemeDirection(value);
        setCookie('themeDirection', value);
    }, [themeDirection]);

    const onChangeDirection = useCallback((event) => {
        const { value } = event.target;
        setThemeDirection(value);
        setCookie('themeDirection', value);
    }, []);

    const onChangeDirectionByLang = useCallback((lang) => {
        const value = lang === 'ar' ? 'rtl' : 'ltr';
        setThemeDirection(value);
        setCookie('themeDirection', value);
    }, []);

    // Layout
    const onToggleLayout = useCallback(() => {
        const value = themeLayout === 'vertical' ? 'mini' : 'vertical';
        setThemeLayout(value);
        setCookie('themeLayout', value);
    }, [themeLayout]);

    const onChangeLayout = useCallback((event) => {
        const { value } = event.target;
        setThemeLayout(value);
        setCookie('themeLayout', value);
    }, []);

    // Contrast
    const onToggleContrast = useCallback(() => {
        const value = themeContrast === 'default' ? 'bold' : 'default';
        setThemeContrast(value);
        setCookie('themeContrast', value);
    }, [themeContrast]);

    const onChangeContrast = useCallback((event) => {
        const { value } = event.target;
        setThemeContrast(value);
        setCookie('themeContrast', value);
    }, []);

    // Color
    const onChangeColorPresets = useCallback((event) => {
        const { value } = event.target;
        setThemeColorPresets(value);
        setCookie('themeColorPresets', value);
    }, []);

    // Stretch
    const onToggleStretch = useCallback(() => {
        const value = !themeStretch;
        setThemeStretch(value);
        setCookie('themeStretch', JSON.stringify(value));
    }, [themeStretch]);

    const onChangeVehicle = useCallback((make = '', model = '') => {
        setCurrentVehicle({ make, model })
        setCookie('currentVehicle', { make, model }, { maxAge: 31536000 });
        
    }, [setCurrentVehicle]);

    const onChangeCity = useCallback((city) => {


        setCookie('currentCity_v1', JSON.stringify(city), { maxAge: 31536000 });

        setCurrentCity(city);
        setCountryTypeHeader(city)
    }, [setCurrentCity]);

    // Reset
    const onResetSetting = useCallback(() => {
        setThemeMode(defaultSettings.themeMode);
        setThemeLayout(defaultSettings.themeLayout);
        setThemeStretch(defaultSettings.themeStretch);
        setThemeContrast(defaultSettings.themeContrast);
        setThemeDirection(defaultSettings.themeDirection);
        setThemeColorPresets(defaultSettings.themeColorPresets);
        deleteCookie('themeMode');
        deleteCookie('themeLayout');
        deleteCookie('themeStretch');
        deleteCookie('themeContrast');
        deleteCookie('themeDirection');
        deleteCookie('themeColorPresets');
    }, []);

    const memoizedValue = useMemo(
        () => ({
            themeMode,
            onToggleMode,
            onChangeMode,

            themeDirection,
            onToggleDirection,
            onChangeDirection,
            onChangeDirectionByLang,

            themeLayout,
            onToggleLayout,
            onChangeLayout,

            themeContrast,
            onChangeContrast,
            onToggleContrast,

            themeStretch,
            onToggleStretch,

            themeColorPresets,
            onChangeColorPresets,
            presetsOption,
            presetsColor: getColorPresets(themeColorPresets),

            onResetSetting,

            currentCity,
            onChangeCity,

            currentVehicle,
            onChangeVehicle,
            basicInfo,
            countryList
        }),
        [
            themeMode,
            onChangeMode,
            onToggleMode,

            themeColorPresets,
            onChangeColorPresets,
            onChangeContrast,

            themeDirection,
            onToggleDirection,
            onChangeDirection,
            onChangeDirectionByLang,

            themeLayout,
            onToggleLayout,
            onChangeLayout,

            themeContrast,
            onToggleContrast,

            themeStretch,
            onToggleStretch,

            onResetSetting,

            currentCity,
            onChangeCity,

            currentVehicle,
            onChangeVehicle,
            basicInfo,
            countryList
        ]
    );

    return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}