import { yupResolver } from '@hookform/resolvers/yup';
import { CloseOutlined, SpeedOutlined, TitleOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Drawer, FormGroup, Grid, IconButton, InputAdornment, MenuItem, Typography, } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { FormProvider, RHFSelect, RHFTextField } from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import { CUSTOMER_API } from 'src/utils/constant';
import * as yup from 'yup';

export default function EditVehicleModal({ open, onClose, referenceData }) {
    const { currentCity } = useSettingsContext();
    const { postApiData } = useApi();
    const { customer } = useAuthContext();

    const [loading, setLoading] = useState(false);
    const OWNERSHIP_TYPE = [{ title: t('owned'), value: "Owned" }, { title: t('leased'), value: "Leased" }, { title: t('rented'), value: "Rented" }, { title: t('customer'), value: "Customer" }];

    const defaultValues = {
        engine_number: '',
        chassis_number: '',
        year: '',
        vehicle_reg_no: '',
        customer_vehicle_id: '',
        kilometre: '',
        make: '',
        model: '',
        trim: '',
        registration_province: '',
        color: '',
        body_type: '',
        body_sub_type: '',
        msrp: '',
        ownership: '',

    };

    console.log(referenceData)

    useEffect(() => {
        if (referenceData) {
            setValue('engine_number', referenceData.engine_number);
            setValue('chassis_number', referenceData.chassis_number);
            setValue('year', referenceData.year);
            setValue('vehicle_reg_no', referenceData.vehicle_reg_no);
            setValue('customer_vehicle_id', referenceData.customer_vehicle_id);
            setValue('kilometre', referenceData.kilometre);
            setValue('make', referenceData.vehicle_make_name);
            setValue('model', referenceData.vehicle_model_name);
            setValue('trim', referenceData.trim);
            setValue('registration_province', referenceData.registration_province);
            setValue('color', referenceData.color);
            setValue('ownership', referenceData.ownership);
            setValue('body_type', referenceData.body_type);
            setValue('body_sub_type', referenceData.body_sub_type);
            setValue('msrp', referenceData.msrp);

        }
    }, [referenceData, open]);

    const validationSchema = yup.object({
        vehicle_reg_no: yup.string()
            .test('max-length', t('maximum_characters').replace('%1$s', 6), function (value) {
                return currentCity.country_code == '973' ? value.length <= 6 : true
            })
            .required(`${t('vehicle_reg_no_')} ${t('is_required')}`),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch, setValue, handleSubmit, reset } = methods;

    async function onSubmit(values) {
        setLoading(true);
        const data = {
            engine_number: values.engine_number,
            chassis_number: values.chassis_number,
            year: values.year,
            vehicle_reg_no: values.vehicle_reg_no,
            customer_vehicle_id: values.customer_vehicle_id,
            kilometre: values.kilometre,
            trim: values.trim,
            registration_province: values.registration_province,
            color: values.color,
            ownership: values.ownership,
            body_type: values.body_type,
            body_sub_type: values.body_sub_type,
            msrp: values.msrp,
        };
        await CustomerUpdateVehicle(data);
        setLoading(false);
    }

    async function CustomerUpdateVehicle(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.updateVehicle, data);
            if (response) {
                reset();
                onClose({ update: true });
            }
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
                        <Typography variant="h6">{t('edit_vehicle')}</Typography>
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
                        <Scrollbar sx={{ flex: 1 }}>
                            <Box sx={{ py: 3, px: 2 }}>
                                <FormProvider
                                    methods={methods}
                                    autoComplete="off"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <FormGroup>
                                        <Grid container spacing={2} rowSpacing={3}>
                                            <Grid item xs={12}>
                                                {currentCity.country_code == '973'
                                                    ?
                                                    <RHFTextField
                                                        inputProps={{ maxLength: 6 }}
                                                        name="vehicle_reg_no"
                                                        label={t('vehicle_reg_no_')}
                                                        onChange={(e) => {
                                                            const numericValue = e.target.value.replace(/\D/g, '');
                                                            e.target.value = numericValue;
                                                            setValue('vehicle_reg_no', numericValue);
                                                        }}
                                                        InputProps={{ startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>) }}
                                                    />
                                                    :
                                                    <RHFTextField name="vehicle_reg_no" label={t('vehicle_reg_no_')} InputProps={{ startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>) }} />
                                                }
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="text"
                                                    name="make"
                                                    label={t('make')}
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="text"
                                                    name="model"
                                                    label={t('model')}
                                                    disabled
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <RHFTextField
                                                    name="engine_number"
                                                    label={t('engine_number')}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <RHFTextField
                                                    name="chassis_number"
                                                    label={t('chassis_number')}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="number"
                                                    name="year"
                                                    label={t('make_year')}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="number"
                                                    name="kilometre"
                                                    label={t('odometer_in_km')}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <SpeedOutlined />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="text"
                                                    name="trim"
                                                    label={t('trim')}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="text"
                                                    name="registration_province"
                                                    label={t('registration_province')}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <RHFSelect
                                                    fullWidth
                                                    name="ownership"
                                                    label={t('ownership')}
                                                    SelectProps={{ native: false, }}
                                                >
                                                    {OWNERSHIP_TYPE.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.title}
                                                        </MenuItem>
                                                    ))}
                                                </RHFSelect>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="text"
                                                    name="body_type"
                                                    label={t('body_type')}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="text"
                                                    name="body_sub_type"
                                                    label={t('body_sub_type')}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="text"
                                                    name="color"
                                                    label={t('color')}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="number"
                                                    name="msrp"
                                                    label={t('msrp')}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <LoadingButton
                                                    loading={loading}
                                                    fullWidth
                                                    variant="contained"
                                                    type="submit"
                                                >
                                                    {t('save')}
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
