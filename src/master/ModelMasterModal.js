import { CloseOutlined, SearchOutlined } from '@mui/icons-material';
import { Box, Button, Drawer, Grid, IconButton, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import Scrollbar from '../components/scrollbar';
import { useSettingsContext } from '../components/settings';
import { DRAWER, HEADER } from '../config-global';
import useApi from '../hooks/useApi';
import useResponsive from '../hooks/useResponsive';
import { CUSTOMER_API, NOT_EXIST_CHECK } from '../utils/constant';

import { useDispatch } from 'src/redux/store';
import { ModelMasterModalList } from 'src/sections/master';
import { getCartItemOnline, resetCart } from '../redux/slices/product';
import MakeMasterModal from './MakeMasterModal';
import RequestVehicleAddModal from './RequestVehicleAddModal';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { getCookie } from 'cookies-next';

export default function ModelMasterModal({ open, onClose, referenceData, NeedSelect = false, directOpen = false }) {
    const { getApiData, postApiData } = useApi();
    const { currentCity, onChangeVehicle, currentVehicle } = useSettingsContext();
    const { customer } = useAuthContext();

    const controller = new AbortController();
    const { signal } = controller;

    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [currentMake, setCurrentMake] = useState('');

    async function GetList(makeMasterID) {
        setLoading(true);
        const params = { vehicle_make_master_id: makeMasterID };
        const response = await getApiData(CUSTOMER_API.getModel, params, signal);
        if (response) {
            const data = response.data.result.list;
            setLoading(false);
            setResponseList(data);
        }
    }
    useEffect(() => {
        if (open) {
            setCurrentMake(referenceData)
            setSearch('')
            GetList(referenceData.vehicle_make_master_id)
        }
        return () => {
            controller.abort();
        };
    }, [open]);

    const router = useRouter();
    const dispatch = useDispatch();


    async function vehicleModelSet(model) {
        onChangeVehicle(currentMake, model);
        onClose({ setvehicle: true, status: false });
        const pathSegments = router.query.category || [];

        if (!router.pathname.split('/').some((path) => NOT_EXIST_CHECK.includes(path))) {
            var getUrl;
            const currentPage = getCookie('currentPage')
            if (currentPage == 'PACKAGE_LIST' || currentPage == 'PACKAGE_DETAILS') {
                getUrl = `/${currentCity.slug}/${pathSegments[0]}/${model.vehicle_model_slug}`;
            } else {
                getUrl = `/${currentCity.slug}/${model.vehicle_model_slug}`;
            }
            router.push(`/[city]/[...category]`, getUrl);
        }
        dispatch(resetCart());
        if (customer) {
            await CustomerAddVehicle(model);
            const params = { vehicle_model_master_id: model.vehicle_model_master_id, promo_code_id: '', };
            dispatch(getCartItemOnline(params));
        }
    }


    const isDesktop = useResponsive('up', 'md');
    async function CustomerAddVehicle(model) {
        if (model) {
            const response = await postApiData(CUSTOMER_API.addVehicle, { vehicle_model_master_id: model.vehicle_model_master_id });
            if (response) {
            }
        }
    }

    const [makeModal, setMakeModal] = useState(false);
    function makeModalClose(value) {
        if (value.data) {
            setCurrentMake(value.data)
            GetList(value.data.vehicle_make_master_id)
        }
        setMakeModal(value.status);
    }

    const filteredList = responseList
        .sort((a, b) => a.vehicle_model_name.localeCompare(b.vehicle_model_name))
        .filter((response) => response && response.vehicle_model_name.toLowerCase().includes(search.toLowerCase()));


    const [addRequestVehicleModal, setAddRequestVehicleModal] = useState(false)
    async function addRequestVehicleModalClose(value) {
        setAddRequestVehicleModal(false)
    }

    return (
        <>
            <Drawer
                variant="temporary"
                anchor={isDesktop ? 'right' : 'bottom'}
                open={open}
                onClose={() => { onClose({ setvehicle: false, status: false }); }}
                PaperProps={{ sx: { width: { xs: '100%', md: '550px' }, height: { xs: DRAWER.MOBILE_HEIGHT, md: '100%' } } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2, }}>
                        <Box display="flex" flexDirection={'column'}>
                            <Typography variant="h6">{t('select_model')}</Typography>
                            <Typography variant="caption" color={'text.secondary'}>{currentMake && currentMake.vehicle_make_name}</Typography>
                        </Box>

                        <Box display="flex" alignItems={'center'} gap={1}>
                            {currentVehicle?.make && directOpen &&
                                <Button onClick={() => { setMakeModal(true); }}>{t('change_vehicle')}</Button>
                            }
                            <IconButton aria-label="close modal" onClick={() => { onClose({ setvehicle: false, status: false }) }}>
                                <CloseOutlined />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ overflow: 'hidden', pt: 2 }} display="flex" flexDirection={'column'} gap={1} flex={1} minHeight={0}>
                        <TextField
                            type={'search'}
                            sx={{ px: 2 }}
                            fullWidth
                            placeholder={t('search')}
                            variant="outlined"
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchOutlined /></InputAdornment>) }}
                        />
                        <Box display={'flex'} sx={{ overflow: 'hidden', flex: 1 }}>
                            <Scrollbar sx={{ flex: 1, height: '100%', px: 2, pb: 2 }}>
                                <Grid container spacing={1} rowSpacing={2}>
                                    {!loading && filteredList.length > 0 ? filteredList
                                        .sort((a, b) => a.vehicle_model_name.localeCompare(b.vehicle_model_name))
                                        .filter((response) => response && response.vehicle_model_name.toLowerCase().includes(search.toLowerCase()))
                                        .map((response, i) => (
                                            <ModelMasterModalList
                                                key={i}
                                                row={response}
                                                onView={() => NeedSelect ? onClose({ status: false, data: response, }) : vehicleModelSet(response)}
                                            />
                                        ))
                                        : !loading &&
                                        <>
                                            {customer ?
                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', py: 3 }}>
                                                        <Typography variant="h6">{t('cant_find_your_car')}</Typography>
                                                        <Typography variant="body2" color={'text.secondary'}>{t('cant_find_your_car_desc')}</Typography>
                                                        <Button sx={{ mt: 3 }} variant='contained' onClick={() => setAddRequestVehicleModal(true)}>{t('request_to_add_vehicle')}</Button>
                                                    </Box>
                                                </Grid>
                                                :
                                                <SkeletonEmptyOrder isNotFound={!filteredList.length} />}
                                        </>
                                        }

                                    {loading &&
                                        [...Array(24)].map((_, index) => (
                                            <Grid item xs={4} md={4} key={index}>
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
                </Box>
            </Drawer>

            <RequestVehicleAddModal open={addRequestVehicleModal} onClose={addRequestVehicleModalClose} referenceData={''}  />


            {makeModal && <MakeMasterModal open={makeModal} onClose={makeModalClose} NeedSelect />}
        </>
    );
}