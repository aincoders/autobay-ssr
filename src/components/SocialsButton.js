import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/system';
import { Stack, Button, Tooltip, IconButton } from '@mui/material';
//
import Iconify from './iconify';

import ThreadLogo from 'src/assets/image/threads-logo.svg';
import Twitter from 'src/assets/image/twitter.svg';

import Image from './image';
import Link from 'next/link';
import { useSettingsContext } from './settings';


// ----------------------------------------------------------------------

SocialsButton.propTypes = {
    initialColor: PropTypes.bool,
    simple: PropTypes.bool,
    sx: PropTypes.object,
};

export default function SocialsButton({ initialColor = false, simple = true, links = {}, sx, ...other }) {

    const { basicInfo, } = useSettingsContext();

    const getSettingDescription = (type) => basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type === type)?.description || '' : '';

    const FACEBOOK = getSettingDescription('FACEBOOK');
    const INSTAGRAM = getSettingDescription('INSTAGRAM');
    const LINKEDIN = getSettingDescription('LINKEDIN');
    const TWITTER = getSettingDescription('TWITTER');
    const WHATSAPP = getSettingDescription('WHATSAPP');
    const THREAD = getSettingDescription('THREADS_LINK');


    const SOCIALS = [
        // {
        //     name: 'Whatsapp',
        //     icon: 'mdi:whatsapp',
        //     socialColor: '#30b742',
        //     path: WHATSAPP || '',
        // },
        {
            name: 'FaceBook',
            icon: 'eva:facebook-fill',
            socialColor: '#1877F2',
            path: FACEBOOK || '',
        },
        {
            name: 'Instagram',
            icon: 'mdi:instagram',
            socialColor: '#E02D69',
            path: INSTAGRAM || '',
        },
        {
            name: 'Linkedin',
            icon: 'eva:linkedin-fill',
            socialColor: '#007EBB',
            path: LINKEDIN || '',
        },
        {
            name: 'Twitter',
            icon: 'ri:twitter-x-fill',
            socialColor: '#000',
            path: TWITTER || '',
        },
        {
            name: 'Thread',
            icon: 'ri:threads-fill',
            socialColor: '#000',
            path: THREAD || '',
        },
    ];

    return (
        <Stack direction="row" flexWrap="wrap" alignItems="center">
            {SOCIALS.map((social) => {
                const { name, icon, path, socialColor } = social;
                return (
                    path ? simple ?
                        <Link key={name} href={path} passHref target={'_blank'}>
                            <Tooltip title={name} placement="top">
                                <IconButton
                                    color="inherit"
                                    sx={{
                                        ...(initialColor ? { color: socialColor, '&:hover': { bgcolor: alpha(socialColor, 0.08) } } : { color: "#fff" }),
                                        ...sx,
                                    }}
                                    {...other}
                                >
                                    <Iconify icon={icon} sx={{ width: 20, height: 20 }} />
                                </IconButton>
                            </Tooltip>
                        </Link>
                        :
                        <Button
                            key={name}
                            href={path}
                            color="inherit"
                            variant="outlined"
                            size="small"
                            startIcon={<Iconify icon={icon} />}
                            sx={{
                                m: 0.5,
                                flexShrink: 0,
                                ...(initialColor && {
                                    color: socialColor,
                                    borderColor: socialColor,
                                    '&:hover': {
                                        borderColor: socialColor,
                                        bgcolor: alpha(socialColor, 0.08),
                                    },
                                }),
                                ...sx,
                            }}
                            {...other}
                        >
                            {name}
                        </Button>
                        : ''
                );

            })}
        </Stack>
    );
}
