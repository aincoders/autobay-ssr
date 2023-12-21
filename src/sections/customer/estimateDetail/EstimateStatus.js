import { ThumbDownAltOutlined, ThumbUpAltOutlined } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from 'src/master';
import { EstimateContext } from 'src/mycontext/EstimateContext';
import { ESTIMATE_STATUS_SENT } from 'src/utils/constant';

export default function EstimateStatus() {
    const { loading, estimateDetails, EstimateApprove, EstimateReject } =
        useContext(EstimateContext);
    const { estimate_status } = estimateDetails;
    const { t } = useTranslation();

    const [confirmation, setConfirmation] = useState({
        status: false,
        type: '',
        title: '',
        icon: '',
    });
    function confirmationClose(value) {
        setConfirmation(value.status);
        if (value.confirmation) {
            if (confirmation.type == 'approve') {
                EstimateApprove();
            } else if (confirmation.type == 'reject') {
                EstimateReject();
            }
        }
    }

    return (
        <>
            {estimate_status == ESTIMATE_STATUS_SENT && (
                <Box display={'flex'} alignItems={'flex-end'} gap={2} justifyContent={'end'}>
                    <Button
                        variant="soft"
                        color="primary"
                        fullWidth
                        startIcon={<ThumbUpAltOutlined />}
                        sx={{ textTransform: 'uppercase' }}
                        onClick={() =>
                            setConfirmation({
                                status: true,
                                type: 'approve',
                                title: t('approve_estimate'),
                                icon: <ThumbUpAltOutlined />,
                            })
                        }
                    >
                        {`approve`}
                    </Button>

                    <Button
                        variant="soft"
                        color="error"
                        fullWidth
                        startIcon={<ThumbDownAltOutlined />}
                        sx={{ textTransform: 'uppercase' }}
                        onClick={() =>
                            setConfirmation({
                                status: true,
                                type: 'reject',
                                title: t('reject_estimate'),
                                icon: <ThumbDownAltOutlined />,
                            })
                        }
                    >
                        {`reject`}
                    </Button>
                </Box>
            )}
            {confirmation.status && (
                <ConfirmDialog
                    icon={confirmation.icon}
                    title={confirmation.title}
                    open={confirmation.status}
                    onClose={confirmationClose}
                />
            )}
        </>
    );
}
