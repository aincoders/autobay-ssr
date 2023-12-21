import { CloseOutlined } from '@mui/icons-material';
import { Box, Button, Drawer, Grid, IconButton, Skeleton, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { DRAWER, HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { CUSTOMER_API } from 'src/utils/constant';

export default function TimeSlotModal({ open, onClose, AddTimeSlot = false, selectedDate = '', selectedTime = '' }) {
    const { getApiData } = useApi();
    const { currentCity } = useSettingsContext();
    const controller = new AbortController();
    const { signal } = controller;
    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [timeslotList, setTimeslotList] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
            setTimeslotList([]);
            setCurrentDate('');
            setCurrentTime('');
    }, [open]);

    async function GetList() {
        setLoading(true);
        const params = { region_slug: currentCity.region_slug };
        const response = await getApiData(CUSTOMER_API.getTimeSlot, params, signal);
        if (response) {
            const data = response.data.result;
            setLoading(false);
            setResponseList(data);

            if(selectedDate && selectedTime){
                const selectedDateExist = data.find((item) => item.date == selectedDate.date)
                if (selectedDateExist) {
                    setCurrentDate(selectedDateExist)
                    setTimeslotList(selectedDateExist.timeslot)
                    const selectedTimeExist = selectedDateExist.timeslot.find((slot) => slot.timeslot_id == selectedTime.timeslot_id)
                    if(selectedTimeExist){
                        setCurrentTime(selectedTimeExist) 
                    }
                }
            }
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
   

    function changeTimeSlot(data) {
        setTimeslotList([]);
        setCurrentDate(data);
        setTimeslotList(data.timeslot);
        setCurrentTime('');
    }

    function setTimeSlot(timeslot) {
        onClose({ status: false, data: { date: currentDate, timeslot: timeslot } });
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
                        <Typography variant="h6">{t('date_time')}</Typography>

                        <Box display={'flex'} alignItems="center" gap={1}>
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

                    <Box sx={{ overflow: 'hidden', pt: 2 }} display="flex" flexDirection={'column'} flex={1} minHeight={0}>
                        <Box display={'flex'} sx={{ overflow: 'hidden', flex: 1 }}>
                            <Scrollbar sx={{ flex: 1, height: '100%', px: 2, pb: 2 }}>
                                <Grid container spacing={2}>
                                    {!loading && responseList.length > 0
                                        ? responseList.map((response, i) => (
                                            <Grid item xs={4} md={3} key={i} >
                                                <Box
                                                    onClick={() => changeTimeSlot(response)}
                                                    component={Button}
                                                    variant={currentDate.date == response.date ? 'soft' : 'outlined'}
                                                    sx={{ p: 1.5, width: '100%', borderRadius: 2, borderColor: 'divider' }}
                                                >
                                                    <Box sx={{ color: currentDate.date == response.date ? 'primary.main' : 'text.primary', }}>
                                                        <Typography variant="caption" fontWeight={'medium'} textAlign="center" textTransform={'uppercase'} noWrap>
                                                            {response.day.slice(0, 3).toUpperCase()}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight={'medium'} textAlign="center" noWrap>
                                                            {response.only_date}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))
                                        : !loading && (
                                            <SkeletonEmptyOrder
                                                isNotFound={!responseList.length}
                                            />
                                        )}
                                    {loading &&
                                        [...Array(9)].map((_, index) => (
                                            <Grid item xs={4} md={3} key={index} >
                                                <Box display={'flex'} alignItems="center" flexDirection={'column'} gap={1} sx={{ cursor: 'pointer' }}>
                                                    <Skeleton sx={{ width: 56, height: 56, }} variant="rounded" />
                                                    <Skeleton variant="text" sx={{ width: 50, }} />
                                                </Box>
                                            </Grid>
                                        ))}

                                </Grid>

                                <Box sx={{ mt: 5 }}>
                                    <Grid container spacing={2}>
                                        {currentDate && !loading && timeslotList.length > 0
                                            ? timeslotList.map((response, i) => (
                                                <Grid item xs={4} md={4} key={i} >
                                                    <Box
                                                        onClick={() => setTimeSlot(response)}
                                                        component={Button}
                                                        variant={currentTime.timeslot_id == response.timeslot_id ? 'soft' : 'outlined'}
                                                        sx={{ p: 1.5, width: '100%', borderRadius: 2, borderColor: 'divider' }}
                                                    >
                                                        <Box sx={{ color: currentTime.timeslot_id == response.timeslot_id ? 'primary.main' : 'text.primary' }}>
                                                            <Typography fontWeight={'medium'} variant="body2" textAlign="center" noWrap>{`${response.start_time} - ${response.end_time}`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            ))
                                            : !loading && currentDate != '' && (<SkeletonEmptyOrder isNotFound={!timeslotList.length} />
                                            )}
                                    </Grid>
                                </Box>
                            </Scrollbar>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}
