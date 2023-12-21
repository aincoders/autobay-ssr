import { CloseOutlined, EditOutlined } from '@mui/icons-material';
import {
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    Skeleton,
    Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import Scrollbar from 'src/components/scrollbar';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { DRAWER, HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { CUSTOMER_API } from 'src/utils/constant';
import AddCancelOrderModal from './AddCancelOrderModal';

export default function CancelOrderModal({
    open,
    onClose,
    NeedSelect = false,
    selectedAddress = '',
}) {
    const { getApiData, postApiData } = useApi();

    const controller = new AbortController();
    const { signal } = controller;

    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    async function GetList() {
        setLoading(true);
        const response = await getApiData(CUSTOMER_API.cancelReason, signal);
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

    const isDesktop = useResponsive('up', 'lg');

    const [openModal, setOpenModal] = useState(false);
    function openModalClose(value) {
        if (value.data) {
            onClose({ status: false, data: value.data.title });
        }
        setOpenModal(false);
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
                    <Box
                        sx={{
                            minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            px: 2,
                        }}
                    >
                        <Typography variant="h6">{t('cancel_reason')}</Typography>

                        <Box display={'flex'} alignItems="center" gap={1}>
                            <Button
                                onClick={() => setOpenModal(true)}
                                startIcon={<EditOutlined fontSize="small" />}
                                variant="soft"
                            >
                                {' '}
                                {t('write_your_known')}
                            </Button>
                            <IconButton
                                aria-label="close modal"
                                onClick={() => {
                                    onClose({ status: false });
                                }}
                            >
                                <CloseOutlined />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box
                        sx={{ overflow: 'hidden' }}
                        display="flex"
                        flexDirection={'column'}
                        flex={1}
                        minHeight={0}
                    >
                        <Box display={'flex'} sx={{ overflow: 'hidden', flex: 1 }}>
                            <Scrollbar sx={{ flex: 1, height: '100%', pb: 2 }}>
                                <List sx={{ p: 0 }}>
                                    {!loading && responseList.length > 0
                                        ? responseList.map((response, index) => (
                                              <AddressModalList
                                                  key={index}
                                                  Row={response}
                                                  selectedAddress={selectedAddress}
                                                  onEdit={() =>
                                                      setOpenModal({
                                                          status: true,
                                                          data: response,
                                                      })
                                                  }
                                                  onDelete={() => CustomerDeleteAddress(response)}
                                                  NeedSelect={() =>
                                                      NeedSelect
                                                          ? onClose({
                                                                status: false,
                                                                data: response.title,
                                                            })
                                                          : ''
                                                  }
                                              />
                                          ))
                                        : !loading && (
                                              <SkeletonEmptyOrder
                                                  isNotFound={!responseList.length}
                                              />
                                          )}
                                    {loading && loadData()}
                                </List>
                            </Scrollbar>
                        </Box>
                    </Box>
                </Box>
            </Drawer>

            <AddCancelOrderModal open={openModal} onClose={openModalClose} referenceData={''} />
        </>
    );
}

function loadData() {
    return Array.from(new Array(4)).map((_, _i) => (
        <ListItem key={_i} disablePadding sx={{ px: 2, py: 1 }}>
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

function AddressModalList({ Row, selectedAddress, NeedSelect }) {
    const { title, customer_address_id } = Row;

    return (
        <>
            <ListItem sx={{ px: 0, py: 0, borderBottom: '1px solid', borderColor: 'divider' }}>
                <ListItemButton sx={{ p: 2 }} selected={title == selectedAddress}>
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                        gap={2}
                        flex={1}
                        onClick={() => NeedSelect()}
                    >
                        <Box display={'flex'} flexDirection="column" alignItems={'flex-start'}>
                            <Box display={'flex'} alignItems="center" gap={1}>
                                <Typography variant="body2" fontWeight={'medium'}>
                                    {title}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </ListItemButton>
            </ListItem>
        </>
    );
}
