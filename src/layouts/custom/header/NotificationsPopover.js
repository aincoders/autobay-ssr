import { CalculateOutlined, CloseOutlined, DoneAll, NotificationsOutlined, ReceiptOutlined, RequestQuoteOutlined } from '@mui/icons-material';
import { Avatar, Badge, Box, Divider, Drawer, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Tab, Tabs, Typography } from '@mui/material';
import { t } from 'i18next';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { IconButtonAnimate } from 'src/components/animate';
import Label from 'src/components/label';
import { SkeletonEmptyOrder, SkeletonGridRowItem } from 'src/components/skeleton';
import { HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { ConfirmDialog } from 'src/master';
import { PATH_CUSTOMER } from 'src/routes/paths';
import { API_PAGE_LIMIT, CUSTOMER_API } from 'src/utils/constant';

export default function NotificationsPopover() {
    const { getApiData, postApiData } = useApi()
    const { customer } = useAuthContext();


    const [openDrawer, setOpenDrawer] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [totalUnRead, setTotalUnRead] = useState(0);
    const [totalNotification, setTotalNotification] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentTab, setCurrentTab] = useState('unread');
    const [loadMore, setLoadMore] = useState(false);
    const [loading, setLoading] = useState(true);

    async function GetNotificationCount() {
        try {
            var response = await getApiData(CUSTOMER_API.notificationCount, '');
            setTotalUnRead(response.data.result.unread)
            setTotalNotification(response.data.result.all)
        } catch (error) {
            console.log(error)
        }
    }
    async function GetNotificationList() {
        try {
            const params = { start_page: currentPage, limit: API_PAGE_LIMIT, read_customer: currentTab == 'unread' ? '0' : '' }
            var response = await getApiData(CUSTOMER_API.notification, params);
            setNotifications(res => res.concat(response.data.result.list));
            setLoadMore(response.data.result.list.length == API_PAGE_LIMIT)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        customer && GetNotificationCount();
    }, [customer])

    useEffect(() => {
        if (openDrawer) {
            GetNotificationList()
        }
        setNotifications([]);
    }, [currentTab, openDrawer, customer])

    const handleOpenPopover = (event) => {
        setOpenDrawer(true);
    };

    const handleClosePopover = () => {
        setOpenDrawer(false);
    };

    const handleScroll = (event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight && loadMore) {
            setCurrentPage((prevPage) => prevPage + 1 * ~~API_PAGE_LIMIT);

        }
    };


    const TABS = [
        { value: 'unread', label: 'Unread', count: totalUnRead },
        { value: 'all', label: 'All', count: totalNotification },
    ];


    const handleChangeTab = useCallback((event, newValue) => {
        setCurrentTab(newValue);
    }, []);


    const isDesktop = useResponsive('up', 'md');
    async function readNotification(row) {
        const response = await postApiData(CUSTOMER_API.readNotification, { notification_id: row.notification_id });
        if (response) {
            setNotifications([])
            GetNotificationCount()
            GetNotificationList()
        }
    }


    const router = useRouter()
    function handleView(row) {
        handleClosePopover()
        if (row.reference_type === 'ORDER_DETAILS') {
            router.push(PATH_CUSTOMER.ordersDetails(btoa(row.reference_id)))
        }
        else if (row.reference_type === 'ESTIMATE_DETAILS') {
            router.push(PATH_CUSTOMER.estimateDetails(btoa(row.reference_id)))
        }
        row.read_customer == '0' && readNotification(row)
    }


    const [confirmation, setConfirmation] = useState(false);
    function confirmationClose(value) {
        if (value.confirmation) {
            handleMarkAllAsRead()
        }
        setConfirmation(value.status)
    }

    return (
        <>
            <IconButtonAnimate onClick={handleOpenPopover}>
                <Badge badgeContent={~~totalUnRead} color="error"><NotificationsOutlined /></Badge>
            </IconButtonAnimate>

            <Drawer
                anchor={isDesktop ? 'right' : "bottom"}
                onClose={handleClosePopover}
                open={openDrawer}
                PaperProps={{ sx: { width: { xs: '100%', md: '550px' }, } }}

            >

                <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2, }}>
                    <Typography variant="h6">{t('notifications')}</Typography>
                    <IconButton aria-label="close modal" onClick={handleClosePopover}>
                        <CloseOutlined />
                    </IconButton>
                </Box>

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ pl: 2.5, pr: 1 }}
                >
                    <Tabs value={currentTab} onChange={handleChangeTab}>
                        {TABS.map((tab) => (
                            <Tab
                                key={tab.value}
                                iconPosition="end"
                                value={tab.value}
                                label={tab.label}
                                sx={{ minHeight: '56px' }}
                                icon={
                                    <Label
                                        variant={tab.value === currentTab ? 'filled' : 'soft'}
                                        color={'primary'}
                                    >
                                        {tab.count}
                                    </Label>
                                }
                            />
                        ))}
                    </Tabs>
                </Stack>

                <Divider />

                <Box sx={{ flex: 1, height: 'calc(100vh - 142px)', overflowX: "hidden" }} onScroll={handleScroll}>
                    <List disablePadding >

                        {!loading && notifications.length > 0 ? notifications.map((item, _i) => {
                            return (
                                <NotificationItem
                                    key={_i}
                                    notification={item}
                                    readNotification={() => readNotification(item)}
                                    onView={() => handleView(item)}

                                />
                            );
                        }) :
                            !loading && <SkeletonEmptyOrder isNotFound={!notifications.length} />
                        }

                        {loading && <SkeletonGridRowItem />}

                    </List>
                </Box>
            </Drawer>

            {
                confirmation &&
                <ConfirmDialog
                    icon={<DoneAll />}
                    title={t('mark_all_as_read')}
                    open={confirmation}
                    onClose={confirmationClose} />
            }
        </>
    );
}

function NotificationItem({ notification, readNotification, onView }) {
    const { description, title, read_customer, created_on } = notification;
    const { avatar } = renderIcon(notification);

    return (
        <ListItemButton
            onClick={() => onView(notification)}
            disableRipple
            sx={{
                py: 1.5,
                px: 1,
                ...(notification.isUnRead && {
                    bgcolor: 'action.selected',
                }),
                borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
            </ListItemAvatar>

            <ListItemText
                primaryTypographyProps={{ typography: 'subtitle2', mb: 0.20 }}
                secondaryTypographyProps={{ typography: 'caption' }}
                primary={title}
                secondary={
                    <Box display={'flex'} flexDirection='column' component={'span'}>
                        <Typography variant='caption' color={'primary'}>{moment(Number(created_on)).fromNow()}</Typography>
                        <Typography variant='caption'>{description}</Typography>
                    </Box>
                }
            />
            {read_customer == '0'
                && <IconButton onClick={(e) => { e.stopPropagation(); readNotification() }}><CloseOutlined fontSize='small' /></IconButton>
            }

        </ListItemButton>
    );
}

// ----------------------------------------------------------------------

function renderIcon(notification) {
    if (notification.reference_type === 'ESTIMATE_DETAILS') {
        return {
            avatar: <CalculateOutlined />,
        };
    }
    if (notification.reference_type === 'ORDER_DETAILS') {
        return {
            avatar: <ReceiptOutlined />,
        };
    }
    if (notification.reference_type === 'REQUEST_QUOTE_DETAILS') {
        return {
            avatar: <RequestQuoteOutlined />,
        };
    }

    return {
        avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    };
}
