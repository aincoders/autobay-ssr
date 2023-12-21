import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { EstimateContext } from 'src/mycontext/EstimateContext';
import { estimateStatusHelper } from 'src/utils/StatusUtil';

export default function EstimateTitle() {
    const { loading, estimateDetails } = useContext(EstimateContext);

    const { t } = useTranslation();
    const router = useRouter();

    const theme = useTheme();

    return (
        <>
            <Box
                display={'flex'}
                alignItems={'center'}
                gap={1}
                justifyContent={'space-between'}
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                p={2}
            >
                <Box display={'flex'} alignItems={'center'} gap={2}>
                    <IconButton onClick={() => router.back()}>
                        <Tooltip title={t('prev')}>
                            {theme.direction === 'ltr' ? <ArrowBack /> : <ArrowForward />}
                        </Tooltip>
                    </IconButton>
                    <Box display="flex" flexDirection={'column'}>
                        <Typography variant="h6"> {estimateDetails.estimate_number}</Typography>
                        <Typography variant="body2" color={'text.secondary'}>
                            {estimateDetails.created_on}
                        </Typography>
                    </Box>
                </Box>
                <Box display={'flex'} alignItems={'center'} gap={2}>
                    <Typography variant="subtitle2" color={'primary'}>
                        {estimateStatusHelper(
                            estimateDetails.estimate_status
                        ).statusText.toLocaleUpperCase()}
                    </Typography>
                </Box>
            </Box>
        </>
    );
}
