import { SearchOutlined } from '@mui/icons-material';
import { Box, Drawer, InputAdornment, List, ListItem, Skeleton, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BadgeStatus from 'src/components/badge-status/BadgeStatus';
import Image from 'src/components/image';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { DRAWER, HEADER, VEHICLE_TYPE_ICON } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { useDispatch } from 'src/redux/store';
import { CUSTOMER_API } from 'src/utils/constant';

export default function FleetVehicleModal({ open, onClose,referenceData }) {
    const { getApiData, postApiData } = useApi();
    const { currentVehicle, onChangeVehicle, currentCity } = useSettingsContext();

    const controller = new AbortController();
    const { signal } = controller;

    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const dispatch = useDispatch();
    const router = useRouter();

    async function GetList() {
        setLoading(true);
        const response = await getApiData(CUSTOMER_API.getVehicle, signal);
        if (response) {
            const data = response.data.result;
            setLoading(false);
            setResponseList(data);
        }
    }

    useEffect(() => {
        if (open) {
            GetList();
            setSearch('');
        }
        return () => {
            controller.abort();
        };
    }, [open]);

    const isDesktop = useResponsive('up', 'lg');

    async function selectVehicle(data) {
        onClose({ status: false });
        const newUrl = router.asPath.replace(/\/[^/]+\/?$/, `/${data.customer_vehicle_id}`);
        router.push(newUrl);
    
    }



    return (
        <>
            <Drawer
                variant="temporary"
                anchor={isDesktop ? 'right' : 'bottom'}
                open={open}
                onClose={() => { onClose({ status: false }) }}
                PaperProps={{ sx: { width: { xs: '100%', md: '550px' }, height: { xs: DRAWER.MOBILE_HEIGHT, md: '100%' } } }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2, }}>
                        <Typography variant="h6">{t('my_vehicle')}</Typography>
                        
                    </Box>

                    <Box sx={{ overflow: 'hidden', pt: 2 }} display="flex" flexDirection={'column'} gap={1} flex={1} minHeight={0}>
                        <TextField
                            sx={{ px: 2 }}
                            fullWidth
                            placeholder={t('search')}
                            variant="outlined"
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (<InputAdornment position="start"><SearchOutlined /></InputAdornment>),
                            }}
                        />
                        <Box display={'flex'} sx={{ overflow: 'hidden', flex: 1 }}>
                            <Scrollbar sx={{ flex: 1, height: '100%', px: 2, pb: 2 }}>
                                <List disablePadding>
                                    {!loading && responseList.length > 0
                                        ? responseList
                                            .filter((response) => response && response.vehicle_model_name.toLowerCase().includes(search.toLowerCase()))
                                            .map((response, i) => (
                                                <VehicleList
                                                    key={i}
                                                    Row={response}
                                                    currentVehicle={referenceData}
                                                    selectVehicle={() => selectVehicle(response)}
                                                />
                                            ))
                                        : !loading && (<SkeletonEmptyOrder isNotFound={!responseList.length} />)}
                                    {loading && loadData()}
                                </List>
                            </Scrollbar>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}

function loadData() {
    return Array.from(new Array(8)).map((_, _i) => (
        <ListItem key={_i} disablePadding sx={{ py: 1 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 2,
                    textAlign: 'center',
                    flex: 1,
                }}
            >
                <Skeleton variant="circular" sx={{ height: 48, minWidth: 48 }} />
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Skeleton sx={{ width: '70%', height: 16 }} />
                    <Skeleton sx={{ width: '40%', height: 12 }} />
                </Box>
            </Box>
        </ListItem>
    ));
}

function VehicleList({ Row, selectVehicle,currentVehicle }) {
    const { show_delete_button, vehicle_reg_no, vehicle_model_fuel_type, year, kilometre, chassis_number, engine_number, customer_vehicle_id, vehicle_model_master_id, vehicle_model_group_name, vehicle_make_name, vehicle_model_name, vehicle_model_photo, } = Row;
    return (
        <>
            <ListItem sx={{ px: 0, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box display={'flex'} alignItems={'center'} gap={2} flex={1} onClick={() => selectVehicle()} sx={{ cursor: 'pointer' }}>
                    <Box sx={{ position: 'relative' }}>
                        {vehicle_model_photo ? (
                            <Image src={vehicle_model_photo} alt={vehicle_model_name} sx={{ width: 56, height: 56, borderRadius: 2 }} />
                        ) : (
                            <Box sx={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box component={VEHICLE_TYPE_ICON} sx={{ color: 'text.secondary' }} />
                            </Box>
                        )}
                       {currentVehicle == customer_vehicle_id && (
                            <BadgeStatus status={'online'} sx={{ position: 'absolute', right: 2, bottom: 2 }} />
                        )}
                    </Box>
                    <Box display={'flex'} flexDirection="column" alignItems={'start'}>
                        <Typography variant="caption" color={'text.secondary'}>
                            {vehicle_reg_no}   
                        </Typography>
                        <Typography variant="caption" color={'text.secondary'}>
                            {customer_vehicle_id}   
                        </Typography>
                   
                        <Typography variant="body2" fontWeight={'medium'} textAlign="center">
                            {vehicle_model_name}
                        </Typography>
                        <Typography
                            variant="caption"
                            color={'text.secondary'}
                        >{`${vehicle_make_name} - ${vehicle_model_group_name} ${year != '0' ? ` - ${year}` : ''
                            }`}</Typography>
                    </Box>
                </Box>

            </ListItem>


        </>
    );
}