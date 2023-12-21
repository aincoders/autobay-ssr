import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import Link from 'next/link';
import { useContext } from 'react';
import { useSettingsContext } from 'src/components/settings';
import SocialsButton from 'src/components/SocialsButton';
import { APP_NAME } from 'src/config-global';
import { ReviewContext } from 'src/mycontext/ReviewContext';

export default function ReviewFooter() {
    const { orderDetails, } = useContext(ReviewContext);
    const { basicInfo, } = useSettingsContext();
    const ADDRESS = basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type == 'ADDRESS').description : '';


    return (
        <>
            <Box sx={{ borderTop: '1px solid', borderColor: "divider", p: 1, }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
                    <SocialsButton initialColor  />
                    <Typography variant='subtitle1' letterSpacing={0.5} >VISIT US</Typography>
                    <Box display={'flex'} flexDirection='column' alignItems={'center'}>
                        <Typography variant='body2' color={'text.secondary'} letterSpacing={0.5} >{`©${new Date().getFullYear()} ${APP_NAME} W.L.L. All Rights Reserved`}</Typography>
                        {ADDRESS && <Typography variant='body2' color={'text.secondary'} letterSpacing={0.5} >{ADDRESS}</Typography>}
                    </Box>
                    <Box display={'flex'} gap={3}>
                        <Typography variant="body2" fontWeight={'medium'}><Link href={`/privacy-policy`} style={{ color: 'inherit' }}>{t('privacy_policy')}</Link></Typography>
                        <Typography variant="body2" fontWeight={'medium'}><Link href={`/`} style={{ color: 'inherit' }}>{t('webiste')}</Link></Typography>
                        <Typography variant="body2" fontWeight={'medium'}><Link href={`/contact-us`} style={{ color: 'inherit' }}>{t('contact_us')}</Link></Typography>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
