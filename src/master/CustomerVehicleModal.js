import { Add, CloseOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@mui/icons-material';
import { Box, Button, Drawer, IconButton, InputAdornment, List, ListItem, MenuItem, Skeleton, TextField, Typography } from '@mui/material';
import { getCookie } from 'cookies-next';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BadgeStatus from 'src/components/badge-status/BadgeStatus';
import Image from 'src/components/image';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { TableMoreMenu } from 'src/components/table';
import { DRAWER, HEADER, VEHICLE_TYPE_ICON } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { getCartItemOnline, resetCart } from 'src/redux/slices/product';
import { useDispatch } from 'src/redux/store';
import { CUSTOMER_API, NOT_EXIST_CHECK } from 'src/utils/constant';
import ConfirmDialog from './ConfirmDialog';
import EditVehicleModal from './EditVehicleModal';
import MakeMasterModal from './MakeMasterModal';

export default function CustomerVehicleModal({ open, onClose }) {
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
        onChangeVehicle(data, data);
        dispatch(resetCart());
        const params = { vehicle_model_master_id: data.vehicle_model_master_id, promo_code_id: '' };
        dispatch(getCartItemOnline(params));

        const pathSegments = router.query.category || [];

        if (!router.pathname.split('/').some((path) => NOT_EXIST_CHECK.includes(path))) {
            var getUrl;
            const currentPage = getCookie('currentPage')
            if (currentPage == 'PACKAGE_LIST' || currentPage == 'PACKAGE_DETAILS') {
                getUrl = `/${currentCity.slug}/${pathSegments[0]}/${data.vehicle_model_slug}`;
            } else {
                getUrl = `/${currentCity.slug}/${data.vehicle_model_slug}`;
            }
            router.push(`/[city]/[...category]`, getUrl);
        }
    }

    const [makeModal, setMakeModal] = useState(false);
    function makeModalClose(value) {
        setMakeModal(false);
        onClose({ status: false });
    }

    const [editVehicleModal, setEditVehicleModal] = useState({ status: false, data: '' });
    function editVehicleModalClose(value) {
        if (value.update) {
            GetList();
        }
        setEditVehicleModal({ status: value.status, data: '' });
    }

    // delete customer vehicle
    async function CustomerDeleteVehicle(address) {
        const response = await postApiData(CUSTOMER_API.deleteVehicle, {
            customer_vehicle_id: address.customer_vehicle_id,
        });
        if (response) {
            setResponseList(
                responseList.filter(
                    (response) => response.customer_vehicle_id != address.customer_vehicle_id
                )
            );
        }
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
                        <Box display={'flex'} alignItems="center" gap={1}>
                            <Button startIcon={<Add />} variant="contained" color='secondary' onClick={() => setMakeModal(true)}>
                                {t('add_vehicle')}
                            </Button>
                            <IconButton aria-label="close modal" onClick={() => { onClose({ status: false }) }}>
                                <CloseOutlined />
                            </IconButton>
                        </Box>
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
                                                    onEdit={() => setEditVehicleModal({ status: true, data: response })}
                                                    onDelete={() => CustomerDeleteVehicle(response)}
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

            <MakeMasterModal open={makeModal} onClose={makeModalClose} />

            <EditVehicleModal
                open={editVehicleModal.status}
                referenceData={editVehicleModal.data}
                onClose={editVehicleModalClose}
            />
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

function VehicleList({ Row, onEdit, onDelete, selectVehicle }) {
    const {show_delete_button,vehicle_reg_no,vehicle_model_fuel_type,year,kilometre,chassis_number,engine_number,customer_vehicle_id,vehicle_model_master_id,vehicle_model_group_name,vehicle_make_name,vehicle_model_name,vehicle_model_photo,} = Row;

    const [openMenu, setOpenMenuActions] = useState(null);
    const handleOpenMenu = (event) => {
        setOpenMenuActions(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setOpenMenuActions(null);
    };

    const { currentVehicle } = useSettingsContext();
    const { make, model } = currentVehicle


    const [confirmation, setConfirmation] = useState(false);
    async function confirmationClose(value) {
        if (value.confirmation) {
            onDelete();
        }
        setConfirmation(value.status);
    }
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
                        {model.vehicle_model_master_id == vehicle_model_master_id && (
                            <BadgeStatus status={'online'} sx={{ position: 'absolute', right: 2, bottom: 2 }} />
                        )}
                    </Box>
                    <Box display={'flex'} flexDirection="column" alignItems={'start'}>
                        <Typography variant="caption" color={'text.secondary'}>
                            {vehicle_reg_no}
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
                <Box display={'flex'} gap={1} alignItems="center">
                    {model && model.vehicle_model_master_id == vehicle_model_master_id ? (
                        <Typography variant="button" color="primary">{t('selected')}</Typography>
                    ) : (
                        <Typography variant="button" color="text.secondary" sx={{ cursor: 'pointer' }} onClick={() => selectVehicle()}>
                            {t('select')}
                        </Typography>
                    )}
                    <TableMoreMenu
                        open={openMenu}
                        onOpen={handleOpenMenu}
                        onClose={handleCloseMenu}
                        actions={
                            <>
                                <MenuItem onClick={() => { onEdit(true); handleCloseMenu() }}>
                                    <EditOutlined />
                                    {t('edit')}
                                </MenuItem>
                                {show_delete_button == '0' && model && model.vehicle_model_master_id != vehicle_model_master_id && (
                                    <MenuItem onClick={() => { setConfirmation(true); handleCloseMenu(); }} sx={{ color: 'error.main' }}>
                                        <DeleteOutlined />
                                        {t('delete')}
                                    </MenuItem>
                                )}
                            </>
                        }
                    />
                </Box>
            </ListItem>

            {confirmation && (
                <ConfirmDialog
                    title={`${t('remove')}`}
                    open={confirmation}
                    description={` ${t('msg_remove').replace('%1$s', t('vehicle'))}`}
                    onClose={confirmationClose}
                />
            )}
        </>
    );
}