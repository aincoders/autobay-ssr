import { CloseOutlined, SearchOutlined } from '@mui/icons-material';
import { Box, Drawer, Grid, IconButton, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { CityMasterModalList } from 'src/sections/master';
import { useSettingsContext } from '../components/settings';
import { DRAWER, HEADER } from '../config-global';
import useApi from '../hooks/useApi';
import useResponsive from '../hooks/useResponsive';
import { CITY_API, NOT_EXIST_CHECK } from '../utils/constant';

export default function CityMasterModal({ open, onClose}) {
    const { getApiData } = useApi();
    const { currentCity, onChangeCity } = useSettingsContext();

    const controller = new AbortController();
    const { signal } = controller;

    const isDesktop = useResponsive('up', 'lg');

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const params = useRouter().query;
    const router = useRouter();

    const [cityList, setCityList] = useState([]);
    async function GetCityList() {
        setLoading(true);
        const response = await getApiData(CITY_API.list, signal);
        if (response) {
            const data = response.data.result.list;
            setLoading(false);
            setCityList(data);
        }
    }

    useEffect(() => {
        if (cityList.length === 0 && open) {
            GetCityList();
        }
        return () => {
            controller.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    function changeCity(city) {
        const pathSegments = router.query.category || [];
        var getUrl = `/${city.slug}/${pathSegments.join('/')}`;

        if(pathSegments.length>0){
            router.push(`/[city]/[...category]`, getUrl);
        }else{
            if (!router.pathname.split('/').some((path) => NOT_EXIST_CHECK.includes(path))) {
                router.push(`/${city.slug}`);
            }
        }
        onChangeCity(city);
        onClose(false)
    }

    return (
        <>
            <Drawer
                hideBackdrop={!open}
                variant="temporary"
                anchor={isDesktop ? 'top' : 'bottom'}
                open={open}
                onClose={() => onClose(false)}
                PaperProps={{
                    sx: { minHeight: { xs: DRAWER.MOBILE_HEIGHT, md: DRAWER.MAIN_DESKTOP_HEIGHT } },
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
                        <Typography variant="h6">{t('choose_your_city')}</Typography>
                        <Box display={'flex'} alignItems="center" gap={2}>
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
                            <IconButton aria-label="close modal" onClick={() => onClose(false)}><CloseOutlined /></IconButton>
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
        </>
    );
}
