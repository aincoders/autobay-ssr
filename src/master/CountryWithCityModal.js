import { Delete, MyLocation, ReportProblemOutlined, SearchOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Button, Dialog, Drawer, Grid, InputAdornment, Skeleton, Tab, Tabs, TextField, Typography, Zoom } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { forwardRef, useEffect, useState } from 'react';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { CityMasterModalList } from 'src/sections/master';
import { useSettingsContext } from '../components/settings';
import { DRAWER, HEADER } from '../config-global';
import useApi from '../hooks/useApi';
import useResponsive from '../hooks/useResponsive';
import { CITY_API, NOT_EXIST_CHECK } from '../utils/constant';
import ConfirmDialog from './ConfirmDialog';

export default function CountryWithCityModal({ open, onClose }) {
    const { getApiData } = useApi();
    const { currentCity, onChangeCity } = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar()

    const controller = new AbortController();
    const { signal } = controller;

    const isDesktop = useResponsive('up', 'lg');

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const params = useRouter().query;
    const router = useRouter();

    const [countryList, setCountryList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [currentCountry, setCurrentCountry] = useState('');


    async function GetCityList() {
        setLoading(true);
        const response = await getApiData(CITY_API.locationAllCity, signal);
        if (response) {
            const data = response.data.result;
            setCountryList(data);
            setCurrentCountry(data[0]['country_master_id'])
            setCityList(data[0]['city_list'])
            setLoading(false);
        }
    }

    useEffect(() => {
        if (countryList.length === 0 && open) {
            GetCityList();
        }
        return () => {
            controller.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    function changeCity(city) {
        onChangeCity(city);
        onClose(false)
        const pathSegments = router.query.category || [];
        // const pathSegments = router.asPath.split('/').filter((item) => item.length > 0) || [];
        var getUrl = `/${city.slug}/${pathSegments.join('/')}`;

        if (router.query.packageDetailSlug) {
            router.push(`/[city]/[...category]?packageDetailSlug=true`, getUrl);
        }
        else if (router.query.packageCategory) {
            router.push(`/[city]/[...category]?packageCategory=true`, getUrl);
        }
        else if (router.query.vehicleSlug) {
            router.push(`/[city]/[...category]?vehicleSlug=true`, getUrl);
        }
        else {
            if (!router.pathname.split('/').some((path) => NOT_EXIST_CHECK.includes(path))) {
                router.push(`/${city.slug}`);
            }
        }

        document.cookie = `currentCity_v1=${JSON.stringify(city)}; path=/`
    }

    function handleTabChange(value) {
        setCurrentCountry(value)
        setCityList(countryList.find((country) => country.country_master_id == value)['city_list'])
    }


    const[loadingButton,setLoadingButton] = useState(false)
    async function getLocation() {
        setLoadingButton(true);
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const { latitude, longitude } = position.coords;
                const params = { latitude, longitude };
                await fetchCountry(params);
            } catch (error) {
                if (error.code === error.PERMISSION_DENIED) {
                    enqueueSnackbar('User denied the request for Geolocation.', { variant: 'error', autoHideDuration: 15000 })
                } else {
                    console.error('Error occurred while retrieving location:', error.message);
                }
            }
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
        setLoadingButton(false);
    }

    const [currentCustomerLocation, setCurrentCustomerLocation] = useLocalStorage('currentCustomerLocation', '');
    async function fetchCountry(params) {
        try {
            const response = await getApiData(CITY_API.detectMyLocationCity, params);
            if (response.data.result) {
                onChangeCity(response.data.result);
                setCurrentCustomerLocation(response.data.result);
                router.push(response.data.result.slug);
            }
        } catch (error) {
            error.status == 999 && setConfirmation(true)
        }
    }
    
    const [confirmation, setConfirmation] = useState(false);
    async function confirmationClose(value) {
        if (value.confirmation) {
            await deleteCustomerAccount()
        }
        setConfirmation(value.status);
    }


    return (
        <>
            <Drawer
                hideBackdrop={!open}
                variant="temporary"
                anchor={isDesktop ? 'top' : 'bottom'}
                open={open}
                PaperProps={{
                    sx: { minHeight: { xs: DRAWER.MOBILE_HEIGHT, md: DRAWER.MAIN_DESKTOP_HEIGHT } },
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
                        <Typography variant="h6">{t('choose_your_city')}</Typography>
                        <Box display={'flex'} alignItems="center" gap={2}>
                            
                            <LoadingButton
                                loading={loadingButton}
                                variant='contained'
                                color='secondary'
                                startIcon={<MyLocation />}
                                onClick={() => getLocation()}
                            >
                                {t('detect_my_location')}
                            </LoadingButton>
                            
                            {isDesktop && (
                                <TextField
                                    value={search}
                                    size="small"
                                    autoFocus
                                    type={'search'}
                                    placeholder={t('search')}
                                    variant="outlined"
                                    onChange={(e) => setSearch(e.target.value)}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><SearchOutlined fontSize="small" sx={{ color: 'text.disabled' }} /></InputAdornment>), }}
                                />
                            )}
                            {/* <IconButton aria-label="close modal" onClick={() => onClose(false)}><CloseOutlined /></IconButton> */}
                        </Box>
                    </Box>

                    <Box sx={{ px: 2 }}>
                        {!isDesktop && (
                            <>
                                <TextField
                                    sx={{ mt: 1 }}
                                    fullWidth
                                    size="small"
                                    autoFocus={isDesktop}
                                    type={'search'}
                                    placeholder={t('search')}
                                    variant="outlined"
                                    onChange={(e) => setSearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: (<InputAdornment position="start"><SearchOutlined fontSize="small" sx={{ color: 'text.disabled' }} /></InputAdornment>),
                                    }}
                                />
                            </>
                        )}
                    </Box>
                    <Box sx={{ p: 2, flex: 1 }}>
                        {countryList.length > 1 &&
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    value={currentCountry}
                                    onChange={(e, value) => handleTabChange(value)}
                                    TabIndicatorProps={{ sx: { height: '3px', borderRadius: 5 }, }}
                                >
                                    {countryList.map((tab) => (
                                        <Tab
                                            sx={{ py: 1.5 }}
                                            key={tab.country_master_id}
                                            value={tab.country_master_id}
                                            label={
                                                <Box display={'flex'} flexDirection="row" gap={1} alignItems="center">
                                                    <Avatar src={tab.media_url} alt={tab.media_url} sx={{ width: 32, height: 32, }} />
                                                    <Typography variant={'body1'} color='text.primary'>
                                                        {tab.country_name}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    ))}
                                </Tabs>
                            </Box>
                        }

                        <Scrollbar sx={{ flex: 1, maxHeight: isDesktop ? '60vh' : '73vh' }}>
                            <Grid container spacing={1} rowSpacing={3}>
                                {!loading &&
                                    cityList
                                        .sort((a, b) => a.city_name.localeCompare(b.city_name))
                                        .filter((response) => response.city_name.toLowerCase().includes(search.toLowerCase()))
                                        .map((response, i) => (
                                            <CityMasterModalList
                                                key={i}
                                                row={response}
                                                onView={() => changeCity(response)}
                                            />
                                        ))}

                                {loading &&
                                    [...Array(24)].map((_, index) => (
                                        <Grid item xs={3} md={1} key={index}>
                                            <Box display={'flex'} alignItems="center" flexDirection={'column'} gap={1} sx={{ cursor: 'pointer' }}>
                                                <Skeleton sx={{ width: 56, height: 56, }} variant="rounded" />
                                                <Skeleton variant="text" sx={{ width: 50 }} />
                                            </Box>
                                        </Grid>
                                    ))}
                            </Grid>
                        </Scrollbar>
                    </Box>
                </Box>
            </Drawer>

                <ErrorCodeDialog
                    title={t('delete_account')}
                    description={t('msg_delete_account')}
                    open={confirmation}
                    onClose={confirmationClose}
                />
        </>
    );
}




const Transition = forwardRef((props, ref) => <Zoom ref={ref} {...props} />);
  function ErrorCodeDialog({   open, onClose }) {
    return (
        <Dialog
            TransitionComponent={Transition}
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={() => onClose({ status: false, confirmation: false })}
        >
            <Box sx={{ p: 2 }}>
                <Box display={'flex'} flexDirection="column" gap={2} alignItems='center'>
                    <Box display="flex" alignItems="center" gap={1}>
                        <ReportProblemOutlined fontSize='large' sx={{color:"text.secondary"}} />
                    </Box>
                    <Typography variant={'subtitle1'} fontWeight='normal'  textAlign={'center'}>
                        {t('please_choose_city_from_this_list')}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ p: 2, display: 'flex', gap: 2,justifyContent:'center' }}>
                <Button variant="soft"  onClick={() => onClose({ status: false, confirmation: false })}>{t('cancel')}</Button>
            </Box>
        </Dialog>
    );
}