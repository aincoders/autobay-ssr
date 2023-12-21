import { CloseOutlined, SearchOutlined } from '@mui/icons-material';
import { Box, Button, Drawer, Grid, IconButton, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { MakeMasterModalList } from 'src/sections/master';
import Scrollbar from '../components/scrollbar';
import { DRAWER, HEADER } from '../config-global';
import useApi from '../hooks/useApi';
import useResponsive from '../hooks/useResponsive';
import { CUSTOMER_API } from '../utils/constant';
import ModelMasterModal from './ModelMasterModal';
import RequestVehicleAddModal from './RequestVehicleAddModal';

export default function MakeMasterModal({ open, onClose, NeedSelect = false }) {
    const { getApiData } = useApi();
    const controller = new AbortController();
    const { signal } = controller;
    const { customer } = useAuthContext();

    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    async function GetList() {
        setLoading(true);
        const response = await getApiData(CUSTOMER_API.getMake, signal);
        if (response) {
            const data = response.data.result.list;
            setLoading(false);
            setResponseList(data);
        }
    }

    useEffect(() => {
        if (open) {
            setSearch('')
            GetList();
        }
        return () => {
            controller.abort();
        };
    }, [open]);

    function openModelModal(make) {
        setModelModal({ status: true, data: make });
    }

    const [modelModal, setModelModal] = useState({ status: false, data: '' });
    function modelModalClose(value) {
        if (value.setvehicle) {
            onClose({ status: false });
        }
        setModelModal({ status: false, data: '' });
    }

    const isDesktop = useResponsive('up', 'md');


    const filteredList = responseList
        .sort((a, b) => a.vehicle_make_name.localeCompare(b.vehicle_make_name))
        .filter((response) => response && response.vehicle_make_name.toLowerCase().includes(search.toLowerCase()));


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
                onClose={() => { onClose({ status: false }) }}
                PaperProps={{ sx: { width: { xs: '100%', md: '550px' }, height: { xs: DRAWER.MOBILE_HEIGHT, md: '100%' } } }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2, }}>
                        <Typography variant="h6">{t('select_make')}</Typography>
                        <IconButton aria-label="close modal" onClick={() => { onClose({ status: false }) }}>
                            <CloseOutlined />
                        </IconButton>
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
                                        .sort((a, b) => a.vehicle_make_name.localeCompare(b.vehicle_make_name))
                                        .filter((response) => response && response.vehicle_make_name.toLowerCase().includes(search.toLowerCase()))
                                        .map((response, i) => (
                                            <MakeMasterModalList
                                                key={i}
                                                row={response}
                                                onView={() => NeedSelect ? onClose({ status: false, data: response }) : openModelModal(response)}
                                            />
                                        ))
                                        :
                                        !loading &&
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
                                                    <Skeleton sx={{ width: 56, height: 56 }} variant="rounded" />
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

            <RequestVehicleAddModal open={addRequestVehicleModal} onClose={addRequestVehicleModalClose} referenceData={''} />


            <ModelMasterModal open={modelModal.status} onClose={modelModalClose} referenceData={modelModal.data} />
        </>
    );
}

MakeMasterModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
