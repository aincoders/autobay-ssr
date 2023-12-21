import { Delete, DeleteOutline, DeleteOutlined, Edit, EditOutlined } from '@mui/icons-material';
import { Box, Button, Card, Chip, Grid, IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from 'src/master';
import { getAddressIcon } from 'src/utils/StatusUtil';

CustomerAddressList.propTypes = {
    Row: PropTypes.object.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

export default function CustomerAddressList({ Row, onEdit, onDelete, updateStatus }) {
    const {
        address_type,
        address_line1,
        address_line2,
        full_name,
        phone,
        customer_address_default,
    } = Row;
    const { t } = useTranslation();

    const [confirmation, setConfirmation] = useState(false);
    async function confirmationClose(value) {
        if (value.confirmation) {
            onDelete();
        }
        setConfirmation(value.status);
    }

    return (
        <>
            <Grid item xs={12} md={4}>
                <Box
                    display={'flex'}
                    flexDirection="column"
                    gap={1}
                    flex={1}
                    component={Card}
                    p={2}
                    variant="elevation"
                    sx={{ height: '100%' }}
                >
                    <Box
                        display={'flex'}
                        flexDirection="column"
                        alignItems={'flex-start'}
                        gap={2}
                        justifyContent="space-between"
                        sx={{ height: '100%' }}
                    >
                        <Box display={'flex'} flexDirection="column" sx={{ width: '100%' }}>
                            <Box
                                display={'flex'}
                                alignItems="center"
                                justifyContent={'space-between'}
                            >
                                <Typography variant="subtitle1" fontWeight={'bold'}>
                                    {full_name}
                                </Typography>
                                <Chip
                                    variant="filled"
                                    color="primary"
                                    size="small"
                                    label={address_type}
                                />
                            </Box>
                            <Typography
                                variant="body2"
                                mt={1}
                                color={'text.secondary'}
                            >{`${address_line1},${address_line2}`}</Typography>
                            <Typography variant="body2">{phone}</Typography>
                        </Box>
                        <Box
                            display={'flex'}
                            alignItems="center"
                            justifyContent={'space-between'}
                            sx={{ width: '100%' }}
                        >
                            <Box
                                display={'flex'}
                                alignItems="center"
                                justifyContent={'space-between'}
                                gap={1}
                            >
                                <IconButton
                                    size="small"
                                    variant="soft"
                                    color="inherit"
                                    onClick={() => onEdit()}
                                >
                                    <EditOutlined fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    variant="soft"
                                    color="error"
                                    onClick={() => setConfirmation(true)}
                                >
                                    <DeleteOutlined fontSize="small" />
                                </IconButton>
                            </Box>
                            {customer_address_default == '1' ? (
                                <Typography variant="button" color="primary">
                                    {t('default')}
                                </Typography>
                            ) : (
                                <Typography
                                    variant="button"
                                    color="text.secondary"
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => updateStatus()}
                                >
                                    {t('set_default')}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Grid>
            {confirmation && (
                <ConfirmDialog
                    title={`${t('remove')}`}
                    open={confirmation}
                    description={` ${t('msg_remove').replace('%1$s', t('address'))}`}
                    onClose={confirmationClose}
                />
            )}
        </>
    );
}
