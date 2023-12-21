import { arSA, enUS } from '@mui/material/locale';
export const allLangs = [
    {
        label: 'English',
        value: 'en',
        systemValue: enUS,
        icon: '/assets/flags/ic_flag_en.svg',
    },
    {
        label: 'Arabic',
        value: 'ar',
        systemValue: arSA,
        icon: '/assets/flags/ic_flag_sa.svg',
    },
];

export const defaultLang = allLangs[0]; // English
