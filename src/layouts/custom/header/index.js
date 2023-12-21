import { ArrowDropDown, KeyboardArrowDownOutlined, MenuOutlined, PlaceOutlined, Verified } from '@mui/icons-material';
import { AppBar, Avatar, Box, Button, Collapse, Divider, Stack, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { styled } from '@mui/system';
import { t } from 'i18next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import SocialsButton from 'src/components/SocialsButton';
import ModelMasterModal from 'src/master/ModelMasterModal';
import LauncherIcon from '../../../assets/logo/LauncherIcon';
import { IconButtonAnimate } from '../../../components/animate';
import { useSettingsContext } from '../../../components/settings';
import { HEADER } from '../../../config-global';
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
import { CityMasterModal, CustomerVehicleModal, MakeMasterModal } from '../../../master';
import { bgBlur } from '../../../utils/cssStyles';
import NavbarVertical from '../navbar/NavbarVertical';
import DesktopHeaderMenu from './DesktopHeaderMenu';
import LanguagePopover from './LanguagePopover';
import Searchbar from './Searchbar';

const RootStyle = styled(AppBar, {
    shouldForwardProp: (prop) =>
        prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout',
})(({ isCollapse, isOffset, verticalLayout, theme }) => ({
    ...bgBlur(),
    // boxShadow: 'none',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    minHeight: 0,
    // height: isOffset ? HEADER.MOBILE_HEIGHT : HEADER.MOBILE_HEIGHT * 2,
    zIndex: theme.zIndex.appBar + 1,
    transition: theme.transitions.create(['width', 'height'], {
        duration: theme.transitions.duration.shorter,
    }),
    paddingBlock: theme.shape.borderRadius * 2,
    [theme.breakpoints.up('lg')]: {
        // height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
        // ...(isOffset && {
        //     height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
        // }),
        // ...(verticalLayout && {
        // 	width: '100%',
        // 	height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
        // 	backgroundColor: theme.palette.background.default,
        // }),
    },
}));

// ----------------------------------------------------------------------

DashboardHeader.propTypes = {
    isCollapse: PropTypes.bool,
    verticalLayout: PropTypes.bool,
};

export default function DashboardHeader({ isCollapse = false, verticalLayout = false, }) {
    const isOffset = useOffSetTop(HEADER.MOBILE_HEIGHT) && !verticalLayout;

    const isDesktop = useResponsive('up', 'md');


    const { customer } = useAuthContext();


    const [makeModal, setMakeModal] = useState(false);
    function makeModalClose(value) {
        setMakeModal(false);
    }

    const { currentCity, currentVehicle } = useSettingsContext();

    var path = currentVehicle?.model
        ? `/${currentCity?.slug}${`/${currentVehicle?.model?.vehicle_model_slug}`}`
        : `/${currentCity?.slug}${currentVehicle?.make && `/${currentVehicle?.make?.vehicle_make_slug}`}`;


    const [open, setOpen] = useState(false);


    const [cityModal, setCityModal] = useState(false);
    function cityModalClose() {
        setCityModal(false)
    }


    return (
        <>
            <RootStyle
                isCollapse={isCollapse}
                isOffset={isOffset}
                verticalLayout={verticalLayout}
                enableColorOnDark
            >
                <Box>
                    <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                        {isDesktop && (
                            <Collapse in={!isOffset} timeout={500}>
                                <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 1, pb: 1 }}>
                                    <Box display={'flex'} alignItems="center" justifyContent={'space-between'} sx={{ px: { xs: 2, lg: 5 } }}>
                                        <Box alignItems="center">
                                            <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} gap={1}>
                                                <Typography variant="body1" color={'text.secondary'} fontWeight={'500'}>
                                                    <Link href={`/about-us`} prefetch={false} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        {t('about_us')}
                                                    </Link>
                                                </Typography>

                                                <Typography variant="body1" color={'text.secondary'} fontWeight={'500'}>
                                                    <Link href={`/our-services`} prefetch={false} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        {t('our_services')}
                                                    </Link>
                                                </Typography>

                                                <Typography variant="body1" color={'text.secondary'} fontWeight={'500'}>
                                                    <Link href={`/`} prefetch={false} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        {t('partners')}
                                                    </Link>
                                                </Typography>

                                                <Typography variant="body1" color={'text.secondary'} fontWeight={'500'}>
                                                    <Link href={`/blog`} prefetch={false} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        {t('blog')}
                                                    </Link>
                                                </Typography>

                                                <Typography variant="body1" color={'text.secondary'} fontWeight={'500'}>
                                                    <Link href={`/contact-us`} prefetch={false} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        {t('contact')}
                                                    </Link>
                                                </Typography>
                                            </Stack>
                                        </Box>
                                        <Box display={'flex'} alignItems='center' gap={2}>
                                            <Button variant='contained'  prefetch={false} component={Link} href={'/request-quote'} >{t('request_a_quote')}</Button>
                                            <LanguagePopover />
                                            <SocialsButton initialColor />
                                        </Box>
                                    </Box>
                                </Box>
                            </Collapse>
                        )}

                        <Box sx={{ height: HEADER.MOBILE_HEIGHT, display: 'flex', minHeight: '100% !important', px: { xs: 2, lg: 5 }, }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" flex={1}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    {!isDesktop && (
                                        <IconButtonAnimate onClick={() => setOpen(true)} sx={{ color: 'text.primary' }}><MenuOutlined /></IconButtonAnimate>
                                    )}
                                    {isDesktop && (
                                        <Link href={{ pathname: path, query: { vehicleSlug: currentVehicle?.model ? true : false, }, }} as={`${path}`}>
                                            <LauncherIcon sx={{ mr: 3 }} />
                                        </Link>
                                    )}
                                    {isDesktop ?
                                        <Button endIcon={<ArrowDropDown />} color="inherit" onClick={() => setCityModal(true)} variant="outlined">
                                            <Box display={'flex'} gap={1} alignItems="center">
                                                {currentCity?.media_url ? <Avatar src={currentCity?.media_url} sx={{ height: 30, width: 30 }} alt={currentCity?.country_name} /> : <PlaceOutlined />}
                                                <Box display={'flex'} flexDirection="column" alignItems={'flex-start'}>
                                                    <Typography variant="caption" color={'text.secondary'}>{t('choose_your_city')}</Typography>
                                                    <Typography variant={isDesktop ? 'body2' : 'caption'} fontWeight={'bold'}>
                                                        {currentCity?  `${currentCity?.city_name},  ${currentCity?.country_name}` : '---'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Button>
                                        :
                                        <Button variant="contained" size="small" color='secondary' onClick={() => setCityModal(true)} sx={{ borderRadius: 16 }} endIcon={<KeyboardArrowDownOutlined />}>
                                            {currentCity ? currentCity?.city_name : '---'}
                                        </Button>
                                    }
                                </Box>

                                {isDesktop && <Searchbar />}

                                <Box display="flex" alignItems="stretch" gap={1} justifyContent="flex-end">
                                    <DesktopHeaderMenu />
                                </Box>
                            </Box>
                        </Box>
                        {!isDesktop && (
                            <Collapse in={!isOffset} >
                                <Divider />
                                <Box display={'flex'} alignItems="center" justifyContent={'space-between'} px={1} py={1} gap={1}>
                                    {currentVehicle?.model?.vehicle_model_name ?
                                        <Box display={'flex'} gap={1} alignItems="center">
                                            {currentVehicle?.make?.vehicle_make_photo && (
                                                <Avatar src={currentVehicle?.make?.vehicle_make_photo} sx={{ width: 32, height: 32, }} />
                                            )}
                                            <Box display={'flex'} flexDirection="column">
                                                <Box display={'flex'} gap={1} alignItems="center">
                                                    <Typography variant="body2" fontWeight={'bold'} color={'text.primary'}>
                                                        {`${currentVehicle?.make?.vehicle_make_name} ${currentVehicle?.model && `- ${currentVehicle?.model?.vehicle_model_name}`}`}
                                                    </Typography>
                                                    <Verified fontSize="small" sx={{ color: green[500], width: 14, height: 14 }} />
                                                </Box>
                                                <Typography variant="caption" color={'text.secondary'}>
                                                    {currentVehicle?.model?.vehicle_model_fuel_type ? `${currentVehicle?.model?.vehicle_model_fuel_type}${currentVehicle?.model?.vehicle_reg_no ? `- ${currentVehicle?.model?.vehicle_reg_no}` : ''}` : '---'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        :
                                        <Button variant="contained" color='secondary' fullWidth onClick={() => setMakeModal(true)}>{t('select_vehicle')}</Button>
                                    }
                                    <Box display={'flex'} gap={1}>
                                        {currentVehicle?.model?.vehicle_model_name && <Button variant="contained" color='secondary' size="small" onClick={() => setMakeModal(true)}>{t('change')}</Button>}
                                    </Box>
                                </Box>
                            </Collapse>
                        )}
                    </Box>
                </Box>
            </RootStyle>
            {customer ?
                <CustomerVehicleModal open={makeModal} onClose={makeModalClose} />
                :
                currentVehicle?.make
                    ? <ModelMasterModal open={makeModal} onClose={makeModalClose} referenceData={currentVehicle?.make} directOpen />
                    : <MakeMasterModal open={makeModal} onClose={makeModalClose} />
            }

            <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

            <CityMasterModal open={cityModal} onClose={cityModalClose} />

        </>
    );
}
