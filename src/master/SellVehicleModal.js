import { yupResolver } from '@hookform/resolvers/yup';
import { CloseOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Drawer, FormGroup, Grid, IconButton, InputAdornment, MenuItem, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFSelect, RHFTextField } from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import VehicleInfo from 'src/sections/fleet-management/VehicleInfo';
import { CUSTOMER_API } from 'src/utils/constant';
import * as yup from 'yup';

export default function SellVehicleModal({ open, onClose, referenceData, customer_vehicle_id }) {
    const { currentCity } = useSettingsContext();
    const { getApiData, postApiData } = useApi();
    const controller = new AbortController();
    const { signal } = controller;
    const SELL_PRICE_TYPE = [{ title: t('non_negotiable'), value: 1 }, { title: t('negotiable'), value: 2 }];
    const [loading, setLoading] = useState(false);
    const defaultValues = {
        sell_price: "0",
        sell_price_type: SELL_PRICE_TYPE[0].value,
    };

    const validationSchema = yup.object({

    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch, setValue, handleSubmit, reset, control } = methods;

    async function onSubmit(values) {
        setLoading(true);
        const data = {
            sell_price: values?.sell_price,
            sell_price_type: values?.sell_price_type,
            customer_vehicle_id: customer_vehicle_id,
            currency:currentCity?.currency_symbol,
        };
        await SellVehicle(data)
        setLoading(false);
    }

    async function SellVehicle(data) {
        try {
            const response = await postApiData(CUSTOMER_API.fleet_request_to_sell_vehicle, data, false);
            const response_msg = response.data.msg;
            onClose({ status: false, update: true, data: response_msg });
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <>
            <Drawer
                variant="temporary"
                anchor={'right'}
                open={open}
                onClose={() => {
                    onClose({ update: false });
                    reset();
                }}
                PaperProps={{ sx: { width: { xs: '100%', md: '550px' } } }}
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
                        <Typography variant="h6">{t('request_to_sell')}</Typography>
                        <IconButton
                            aria-label="close modal"
                            onClick={() => {
                                onClose({ update: false });
                                reset();
                            }}
                        >
                            <CloseOutlined />
                        </IconButton>
                    </Box>

                    <Box
                        sx={{ overflow: 'hidden' }}
                        display="flex"
                        flexDirection={'column'}
                        gap={2}
                        flex={1}
                    >
                       <Box sx={{ py: 0, px: 2 }}>
                        <VehicleInfo responseList={referenceData} />
                        </Box>

                        <Scrollbar sx={{ flex: 1 }}>
                            <Box sx={{ py: 3, px: 2 }}>
                                <FormProvider
                                    methods={methods}
                                    autoComplete="off"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <FormGroup>
                                        <Grid container spacing={2} rowSpacing={3}>
                                            <Grid item xs={6}>
                                                <RHFSelect
                                                    fullWidth
                                                    name="sell_price_type"
                                                    label={t('sell_price_type')}
                                                    SelectProps={{ native: false, }}
                                                >
                                                    {SELL_PRICE_TYPE.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.title}
                                                        </MenuItem>
                                                    ))}
                                                </RHFSelect>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="number"
                                                    InputProps={{ startAdornment: (<InputAdornment position="start">{currentCity?.currency_symbol}</InputAdornment>) }}
                                                    name="sell_price"
                                                    label={t('sell_price')}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <LoadingButton
                                                    loading={loading}
                                                    fullWidth
                                                    variant="contained"
                                                    type="submit"
                                                >
                                                    {t('submit')}
                                                </LoadingButton>
                                            </Grid>
                                        </Grid>
                                    </FormGroup>
                                </FormProvider>
                            </Box>
                        </Scrollbar>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}
