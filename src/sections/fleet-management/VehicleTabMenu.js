import { EventOutlined, InfoOutlined, InsertPhotoOutlined, PersonOutline, TopicOutlined } from '@mui/icons-material';
import { Box, Tab, Tabs } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { PATH_FLEET_MANAGEMNT } from 'src/routes/paths';

export default function VehicleTabMenu({ current = 'overview', responseList }) {
    const [currentTab, setCurrentTab] = useState(current);

    const TABS = [
        { value: 'overview', label: t('overview'), icon: <InfoOutlined /> },
        { value: 'service_reminder', label: t('service_reminder'), icon: <EventOutlined /> },
        { value: 'document_reminder', label: t('document_reminder'), icon: <TopicOutlined /> },
        { value: 'vehicle_photo', label: t('vehicle_photo'), icon: <InsertPhotoOutlined /> },
        // { value: 'maintenance_history', label: t('maintenance_history'), icon: <HistoryOutlined /> },
        { value: 'driver', label: t('driver'), icon: <PersonOutline /> },

    ];

    const router = useRouter();

    function tabChange(value) {
        switch (value) {
            case 'overview':
                router.push(`${PATH_FLEET_MANAGEMNT.vehicle}${router.query.vehicle}`);
                break;
            case 'service_reminder':
                router.push(`${PATH_FLEET_MANAGEMNT.service_reminder}${router.query.vehicle}`);
                break;
            case 'document_reminder':
                router.push(`${PATH_FLEET_MANAGEMNT.document_reminder}${router.query.vehicle}`);
                break;
            case 'vehicle_photo':
                router.push(`${PATH_FLEET_MANAGEMNT.vehicle_photo}${router.query.vehicle}`);
                break;
            // case 'maintenance_history':
            //     router.push(PATH_CUSTOMER.wallet);
            //     break;
            case 'driver':
                router.push(`${PATH_FLEET_MANAGEMNT.driver}${router.query.vehicle}`);
                break;


        }
    }

    const { customer } = useAuthContext();

    return (
        <>
            <Box display={'flex'} flexDirection="column" gap={3} px={2.5}>
                <Tabs
                    value={currentTab}
                    onChange={(event, newValue) => tabChange(newValue)}
                    variant="scrollable"
                >
                    {TABS.map((tab) => (
                        <Tab
                            key={tab.value}
                            label={tab.label}
                            icon={tab.icon}
                            value={tab.value}
                            iconPosition="start"
                        />
                    ))}
                </Tabs>
            </Box>
        </>
    );
}
