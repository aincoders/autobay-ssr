import { Add, CloseOutlined, EditOutlined, SearchOutlined, ToggleOff, ToggleOn } from '@mui/icons-material';
import { Box, Button, Drawer, IconButton, InputAdornment, List, ListItem, MenuItem, Skeleton, TextField, Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import BadgeStatus from 'src/components/badge-status/BadgeStatus';
import Label from 'src/components/label/Label';
import Scrollbar from 'src/components/scrollbar';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { TableMoreMenu } from 'src/components/table';
import { DRAWER, HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { CUSTOMER_API } from 'src/utils/constant';
import AddFleetDriverModal from './AddFleetDriverModal';

export default function FleetDriverModal({ open, onClose, customer_vehicle_id }) {
    const { getApiData, postApiData } = useApi();
    // const { currentVehicle, onChangeVehicle, currentCity } = useSettingsContext();
    const controller = new AbortController();
    const { signal } = controller;
    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    async function GetList() {

        try {
            setLoading(true);
            const params = { search_keyword: search };
            const response = await getApiData(CUSTOMER_API.fleet_management_driver, params, signal);
            if (response) {
                const data = response.data.result;
                setLoading(false);
                setResponseList(data);
            }
        }
        catch (error) {
            controller.abort()
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

    useEffect(() => {
        GetList();
        return () => {
            controller.abort();
        };
    }, [search]);

    const isDesktop = useResponsive('up', 'lg');
    async function selectDriver(row) {
        const data = { customer_vehicle_id: customer_vehicle_id, driver_id: row.driver_id }
        await postApiData(CUSTOMER_API.fleet_management_vehicledriver_assign, data);
        onClose({ status: false });
    }

    const [addFleetDriverModal, setAddFleetDriverModal] = useState({ status: false, data: '' });

    function addFleetDriverModalClose(value) {
        if (value.update) {
            GetList();
        }
        setAddFleetDriverModal({ status: value.status, data: '' });
    }

    async function updateDriverStatus(row) {
        const data = { driver_status: row.driver_status == '1' ? '0' : '1', driver_id: row.driver_id }
        await postApiData(CUSTOMER_API.fleet_management_driver_update_status, data);
        GetList()
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
                        <Typography variant="h6">{t('my_driver')}</Typography>

                        <Box display={'flex'} alignItems="center" gap={1}>
                            <Button startIcon={<Add />} variant="contained" color='secondary' onClick={() => setAddFleetDriverModal({ status: true, data: "" })}>
                                {t('add_driver')}
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
                                            // .filter((response) => response && response.name.toLowerCase().includes(search.toLowerCase()))
                                            .map((response, i) => (
                                                <DriverList
                                                    key={i}
                                                    Row={response}
                                                    onEdit={() => setAddFleetDriverModal({ status: true, data: response })}
                                                    upDateStatus={() => updateDriverStatus(response)}
                                                    currentVehicle={""}
                                                    selectDriver={() => selectDriver(response)}
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

            {addFleetDriverModal.status && <AddFleetDriverModal
                open={addFleetDriverModal.status}
                referenceData={addFleetDriverModal.data}
                onClose={addFleetDriverModalClose}
            />
            }
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

function DriverList({ Row, onEdit, upDateStatus, selectDriver, currentDriver }) {
    const { driver_id, name, phone_number, driver_status, } = Row;
    const theme = useTheme();

    const [openMenu, setOpenMenuActions] = useState(null);
    const handleOpenMenu = (event) => {
        setOpenMenuActions(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setOpenMenuActions(null);
    };

    return (
        <>
            <ListItem sx={{ px: 0, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box display={'flex'} alignItems={'center'} gap={2} flex={1} onClick={() => selectDriver()} sx={{ cursor: 'pointer' }}>
                    <Box sx={{ position: 'relative' }}>
                        {currentDriver == driver_id && (
                            <BadgeStatus status={'online'} sx={{ position: 'absolute', right: 2, bottom: 2 }} />
                        )}
                    </Box>
                    <Box display={'flex'} flexDirection="column" alignItems={'start'}>
                        <Typography variant="body2" fontWeight={'medium'} textAlign="center">
                            {name}
                        </Typography>
                        <Typography
                            variant="caption"
                            color={'text.secondary'}
                        >{phone_number}
                        </Typography>
                    </Box>

                </Box>

                <Box display={'flex'} gap={2} alignItems="center">

                    {driver_status == 1 && (
                        <Typography variant="button" color="primary" sx={{ cursor: 'pointer' }} onClick={() => selectDriver()}>
                            {t('assign')}
                        </Typography>
                    )}
                    <Box display={'flex'} flexDirection='column' flex={1} alignItems='center'>

                        {driver_status == "1" ?
                            <Label variant={theme.palette.mode === 'light' ? 'soft' : 'filled'} color={'success'} sx={{ textTransform: 'capitalize', color: driver_status == "1" ? 'success.main' : 'error.main' }}>{t('active')}</Label> :
                            <Label variant={theme.palette.mode === 'light' ? 'soft' : 'filled'} color={'error'} sx={{ textTransform: 'capitalize', color: driver_status == "1" ? 'success.main' : 'error.main' }}>{t('inactive')}</Label>
                        }
                    </Box>
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

                                <MenuItem onClick={() => { upDateStatus(); handleCloseMenu(); }} sx={{ color: driver_status == "1" ? 'error.main' : 'success.main' }}>
                                    {driver_status == "1" ? <ToggleOff /> : <ToggleOn />}
                                    {driver_status == "1" ? t('inactive') : t('active')}
                                </MenuItem>
                            </>
                        }
                    />
                </Box>
            </ListItem>


        </>
    );
}