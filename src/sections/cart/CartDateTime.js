import { EditOutlined, EventNote, KeyboardArrowRightOutlined } from '@mui/icons-material';
import { Box, Card, CardActionArea, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useResponsive from 'src/hooks/useResponsive';
import { TimeSlotModal } from 'src/master';
import { applyBookingDateTime } from 'src/redux/slices/product';
import { useSelector } from 'src/redux/store';

export default function CartDateTime() {
    const router = useRouter();

    const { checkout } = useSelector((state) => state.product);
    const { bookingDate, bookingTime } = checkout;
    const dispatch = useDispatch();

    // useEffect(()=>{
    //     dispatch(applyBookingDateTime({ bookingDate: '', bookingTime: '' }));
    // },[])

    

    const [timeslotModal, setTimeslotModal] = useState(false);
    async function timeslotModalClose(value) {
        if (value.data) {
            dispatch(applyBookingDateTime({ bookingDate: value.data.date, bookingTime: value.data.timeslot }));
        }
        setTimeslotModal(value.status);
    }

    const isDesktop = useResponsive('up', 'lg');

    return (
        <>
            {bookingDate ? (
                <Card
                    sx={{ px: 2, py: 1 }}
                    component={CardActionArea}
                    onClick={() => setTimeslotModal(true)}
                >
                    <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                        <Box display={'flex'} alignItems="center" gap={2}>
                            <EventNote color="primary" fontSize={isDesktop ? 'medium' : 'small'} />
                            <Box>
                                <Box>
                                    <Typography
                                        variant={isDesktop ? 'subtitle2' : 'body2'}
                                        fontWeight="medium"
                                    >{`${bookingDate.date}`}</Typography>
                                    <Typography
                                        variant="caption"
                                        color={'text.secondary'}
                                    >{`${bookingTime.start_time} - ${bookingTime.end_time}`}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <EditOutlined
                            fontSize={isDesktop ? 'medium' : 'small'}
                            sx={{ color: 'text.secondary' }}
                        />
                    </Box>
                </Card>
            ) : (
                <Card
                    sx={{ px: 2, py: 1 }}
                    component={CardActionArea}
                    onClick={() => setTimeslotModal(true)}
                >
                    <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                        <Box display={'flex'} alignItems="center" gap={2}>
                            <EventNote color="primary" fontSize={isDesktop ? 'medium' : 'small'} />
                            <Box>
                                <Typography
                                    variant={isDesktop ? 'subtitle2' : 'body2'}
                                    fontWeight="medium"
                                >
                                    {t('date_time')}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color={'text.secondary'}
                                >{`---`}</Typography>
                            </Box>
                        </Box>
                        <KeyboardArrowRightOutlined
                            sx={{ color: 'text.secondary' }}
                            fontSize={isDesktop ? 'medium' : 'small'}
                        />
                    </Box>
                </Card>
            )}
            <TimeSlotModal
                open={timeslotModal}
                onClose={timeslotModalClose}
                AddTimeSlot
                selectedDate={bookingDate}
                selectedTime={bookingTime}
            />
        </>
    );
}
