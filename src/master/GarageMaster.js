import { CloseOutlined, SearchOutlined } from '@mui/icons-material';
import {Box,Divider,Drawer,IconButton,InputAdornment,List,ListItem,ListItemButton,Skeleton,TextField,Typography} from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import Scrollbar from 'src/components/scrollbar';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { DRAWER, HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { CUSTOMER_API } from 'src/utils/constant';
import { CustomAvatar } from 'src/components/custom-avatar';

export default function GarageMaster({ open, onClose, NeedSelect = false, selectedGarage = '' }) {
    const { getApiData } = useApi();

    const controller = new AbortController();
    const { signal } = controller;
    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    async function GetList() {
        setLoading(true);
        const response = await getApiData(CUSTOMER_API.garage, signal);
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
                        <Typography variant="h6">{t('workshop')}</Typography>
                        <Box display={'flex'} alignItems="center" gap={1}>
                            <IconButton
                                onClick={() => {
                                    onClose({ status: false });
                                }}
                            >
                                <CloseOutlined />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box
                        sx={{ overflow: 'hidden', pt: 2 }}
                        display="flex"
                        flexDirection={'column'}
                        flex={1}
                        minHeight={0}
                    >
                        <TextField
                            sx={{ px: 2 }}
                            fullWidth
                            placeholder={t('search')}
                            variant="outlined"
                            onChange={(e) => setSearch(e.target.value)}
                            autoComplete="off"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlined />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Divider sx={{ py: 1 }} />
                        <Box display={'flex'} sx={{ overflow: 'hidden', flex: 1 }}>
                            <Scrollbar sx={{ flex: 1, height: '100%', pb: 2 }}>
                                <List sx={{ p: 0 }}>
                                    {!loading && responseList.length > 0
                                        ? responseList
                                              .sort((a, b) =>
                                                  a.garage_name.localeCompare(b.garage_name)
                                              )
                                              .filter((response) =>
                                                  response.garage_name
                                                      .toLowerCase()
                                                      .includes(search.toLowerCase())
                                              )
                                              .map((response, index) => (
                                                  <GargeList
                                                      key={index}
                                                      Row={response}
                                                      selectedGarage={selectedGarage}
                                                      NeedSelect={() =>
                                                          NeedSelect
                                                              ? onClose({
                                                                    status: false,
                                                                    data: response,
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

function GargeList({ Row, selectedGarage, NeedSelect }) {
    const { garage_name, address, garage_id, media_url } = Row;
    return (
        <>
            <ListItem sx={{ px: 0, py: 0, borderBottom: '1px solid', borderColor: 'divider' }}>
                <ListItemButton
                    sx={{ p: 2 }}
                    selected={garage_id == selectedGarage.garage_id}
                    onClick={() => NeedSelect()}
                >
                    <Box display={'flex'} alignItems={'start'} gap={2} flex={1}>
                        {media_url ? (
                            <CustomAvatar src={media_url} />
                        ) : (
                            <CustomAvatar name={garage_name} />
                        )}
                        <Box display={'flex'} flexDirection="column" alignItems={'flex-start'}>
                            <Box display={'flex'} flexDirection="column" alignItems="flex-start">
                                <Typography variant="body1" fontWeight={'bold'}>
                                    {garage_name}
                                </Typography>
                                <Typography variant="caption" my={0.3} color={'text.secondary'}>
                                    {address}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </ListItemButton>
            </ListItem>
        </>
    );
}
