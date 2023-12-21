import { WorkspacePremium } from '@mui/icons-material';
import { Box, Divider, Typography } from '@mui/material';
import { blue, green, red, yellow } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';

export default function NavbarDocs({ expiredInfomation }) {
    const { t } = useTranslation();

    if (!expiredInfomation.subscription_type) {
        return null;
    }

    let title;
    let bgColor;
    let color = '';
    if (expiredInfomation.subscription_type == '1') {
        title = t('free_trial');
        bgColor = red[100];
        color = red[900];
    } else if (expiredInfomation.subscription_type == '2') {
        title = t('essential');
        bgColor = blue[100];
        color = blue[900];
    } else if (expiredInfomation.subscription_type == '3') {
        title = t('professional');
        bgColor = green[100];
        color = green[900];
    } else if (expiredInfomation.subscription_type == '4') {
        title = t('enterprise');
        bgColor = yellow[100];
        color = yellow[900];
    }

    return (
        <Box sx={{ p: 1.5, py: 2, bgcolor: bgColor, color, borderRadius: 1 }}>
            <Box display={'flex'} alignItems={'center'} gap={2}>
                <WorkspacePremium fontSize="large" />
                <Divider
                    sx={{ borderWidth: 2, borderColor: color }}
                    orientation="vertical"
                    variant="middle"
                    flexItem
                />
                <Box display={'flex'} alignItems={'flex-start'} flexDirection={'column'}>
                    <Typography variant="subtitle1">{title}</Typography>
                    {expiredInfomation.subscription_days > 0 && (
                        <Typography variant="caption" display={'block'}>{`${t('valid_thru')} ${
                            expiredInfomation.expiry_date
                        }`}</Typography>
                    )}
                    {expiredInfomation.subscription_days > 0 ? (
                        <Typography variant="caption">
                            {' '}
                            {`${expiredInfomation.subscription_days} ${t('days_remaining')}`}
                        </Typography>
                    ) : (
                        <Typography variant="caption"> {t('expired')}</Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
