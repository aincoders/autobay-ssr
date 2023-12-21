import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from '../components/settings';
import localStorageAvailable from '../utils/localStorageAvailable';
import { allLangs, defaultLang } from './config-lang';

export default function useLocales() {
    const { i18n, t: translate } = useTranslation();

    const { onChangeDirectionByLang } = useSettingsContext();

    const storageAvailable = localStorageAvailable();

    const langStorage = storageAvailable ? localStorage.getItem('i18nextLng') : '';

    const currentLang = allLangs.find((_lang) => _lang.value === langStorage) || defaultLang;

    useEffect(()=>{
        document.documentElement.lang = currentLang.value;
    })

    const handleChangeLanguage = (newlang) => {
        window.location.reload()
        i18n.changeLanguage(newlang);
        onChangeDirectionByLang(newlang);
        console.log(document.documentElement.lang)

    };

    return {
        onChangeLang: handleChangeLanguage,
        translate: (text, options) => translate(text, options),
        currentLang,
        allLangs,
    };
}
