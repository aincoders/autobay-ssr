import { Add, CloseOutlined, DeleteOutlined, EditOutlined, SearchOutlined, } from '@mui/icons-material';
import { Box, Button, Divider, Drawer, IconButton, InputAdornment, List, ListItem, ListItemButton, MenuItem, Skeleton, TextField, Typography, } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import Scrollbar from 'src/components/scrollbar';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { TableMoreMenu } from 'src/components/table';
import { DRAWER, HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { CUSTOMER_API } from 'src/utils/constant';
import { getAddressIcon } from 'src/utils/StatusUtil';
import AddAddressModal from './AddAddressModal';
import ConfirmDialog from './ConfirmDialog';

export default function AddressModal({ open, onClose, AddAddress = false, selectedAddress = '' }) {
    const { getApiData, postApiData } = useApi();

    const controller = new AbortController();
    const { signal } = controller;

    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    async function GetList() {
        setLoading(true);
        const response = await getApiData(CUSTOMER_API.getAddress, signal);
        if (response) {
            const data = response.data.result;
            setLoading(false);
            setResponseList(data);
        }
    }

    useEffect(() => {
        if (open) {
            GetList();
        }
        return () => {
            controller.abort();
        };
    }, [open]);

    const isDesktop = useResponsive('up', 'md');

    const [openModal, setOpenModal] = useState({ status: false, data: '' });
    function openModalClose(value) {
        if (value.update) {
            GetList();
        }
        setOpenModal({ status: false, data: '' });
    }

    async function CustomerDeleteAddress(address) {
        const response = await postApiData(CUSTOMER_API.deleteAddress, {
            customer_address_id: address.customer_address_id,
        });
        if (response) {
            setResponseList(
                responseList.filter(
                    (response) => response.customer_address_id != address.customer_address_id
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
                onClose={() => {
                    onClose({ status: false });
                }}
                PaperProps={{
                    sx: {
                        width: { xs: '100%', md: '550px' },
                        height: { xs: DRAWER.MOBILE_HEIGHT, md: '100%' },
                    },
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2, }}>
                        <Typography variant="h6">{t('my_address')}</Typography>

                        <Box display={'flex'} alignItems="center" gap={1}>
                            <Button startIcon={<Add />} variant="soft" onClick={() => setOpenModal({ status: true, data: '' })}>{t('address')}</Button>
                            <IconButton onClick={() => { onClose({ status: false }); }}>
                                <CloseOutlined />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ overflow: 'hidden', pt: 2 }} display="flex" flexDirection={'column'} flex={1} minHeight={0}>
                        <TextField
                            sx={{ px: 2 }}
                            fullWidth
                            placeholder={t('search')}
                            variant="outlined"
                            onChange={(e) => setSearch(e.target.value)}
                            autoComplete="off"
                            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchOutlined /></InputAdornment>) }}
                        />
                        <Divider sx={{ py: 1 }} />
                        <Box display={'flex'} sx={{ overflow: 'hidden', flex: 1 }}>
                            <Scrollbar sx={{ flex: 1, height: '100%', pb: 2 }}>
                                <List sx={{ p: 0 }}>
                                    {!loading && responseList.length > 0
                                        ? responseList
                                            .sort((a, b) => a.full_name.localeCompare(b.full_name))
                                            .filter((response) => response.address_type.toLowerCase().includes(search.toLowerCase()))
                                            .map((response, index) => (
                                                <AddressModalList
                                                    key={index}
                                                    Row={response}
                                                    selectedAddress={selectedAddress}
                                                    onEdit={() => setOpenModal({ status: true, data: response })}
                                                    onDelete={() => CustomerDeleteAddress(response)}
                                                    AddAddress={() => AddAddress ? onClose({ status: false, data: response, }) : ''}
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

            <AddAddressModal open={openModal.status} onClose={openModalClose} referenceData={openModal.data} />
        </>
    );
}

function loadData() {
    return Array.from(new Array(4)).map((_, _i) => (
        <ListItem key={_i} disablePadding sx={{ px: 2, py: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2, textAlign: 'center', flex: 1, }}>
                <Skeleton variant="circular" sx={{ height: 48, minWidth: 48 }} />
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Skeleton sx={{ width: '70%', height: 16 }} />
                    <Skeleton sx={{ width: '40%', height: 12 }} />
                </Box>
            </Box>
        </ListItem>
    ));
}

function AddressModalList({ Row, selectedAddress, onEdit, onDelete, AddAddress }) {
    const { address_type, full_name, address_line1, address_line2, phone, customer_address_id } =
        Row;

    const [openMenu, setOpenMenuActions] = useState(null);
    const handleOpenMenu = (event) => {
        setOpenMenuActions(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setOpenMenuActions(null);
    };

    const [confirmation, setConfirmation] = useState(false);
    async function confirmationClose(value) {
        if (value.confirmation) {
            onDelete();
        }
        setConfirmation(value.status);
    }
    return (
        <>
            <ListItem sx={{ px: 0, py: 0, borderBottom: '1px solid', borderColor: 'divider' }}>
                <ListItemButton sx={{ p: 2 }} selected={customer_address_id == selectedAddress.customer_address_id}>
                    <Box display={'flex'} alignItems={'start'} gap={2} flex={1} onClick={() => AddAddress()}>
                        <Box sx={{ width: 35, height: 35, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                            <Box component={getAddressIcon(address_type)} />
                        </Box>
                        <Box display={'flex'} flexDirection="column" alignItems={'flex-start'}>
                            <Box display={'flex'} alignItems="center" gap={1}>
                                <Typography variant="body1" fontWeight={'bold'}>{full_name}</Typography>
                            </Box>
                            <Typography variant="caption" my={0.3} color={'text.secondary'}>{`${address_line1},${address_line2}`}</Typography>
                            <Typography variant="body2">{phone}</Typography>
                        </Box>
                    </Box>
                    <TableMoreMenu
                        open={openMenu}
                        onOpen={handleOpenMenu}
                        onClose={handleCloseMenu}
                        actions={
                            <>
                                <MenuItem onClick={() => { onEdit(true); handleCloseMenu(); }}><EditOutlined />{t('edit')}</MenuItem>
                                <MenuItem onClick={() => { setConfirmation(true); handleCloseMenu(); }} sx={{ color: 'error.main' }}><DeleteOutlined />{t('delete')}</MenuItem>
                            </>
                        }
                    />
                </ListItemButton>
            </ListItem>

            {confirmation && (
                <ConfirmDialog
                    title={`${t('remove')}`}
                    open={confirmation}
                    description={` ${t('msg_remove').replace('%1$s', t('address'))}`}
                    onClose={confirmationClose}
                />
            )}
        </>
    );
}
