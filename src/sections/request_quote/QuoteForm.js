import { yupResolver } from '@hookform/resolvers/yup';
import { AlternateEmail, ArrowDropDown, CallOutlined, TitleOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Backdrop, Box, Chip, CircularProgress, Grid, InputAdornment, MenuItem, Stack, Typography } from '@mui/material';
import imageCompression from 'browser-image-compression';
import { m } from 'framer-motion';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import Avatar from 'src/components/custom-avatar/Avatar';
import { FormProvider, RHFAutocomplete, RHFSelect, RHFTextField, RHFUpload } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import useLocalStorage from 'src/hooks/useLocalStorage';
import useResponsive from 'src/hooks/useResponsive';
import { MakeMasterModal } from 'src/master';
import ModelMasterModal from 'src/master/ModelMasterModal';
import { CUSTOMER_API, S3_BUCKET_API } from 'src/utils/constant';
import createAvatar from 'src/utils/createAvatar';
import * as yup from 'yup';
import { MotionViewport, varFade } from '../../components/animate';

export default function QuoteForm() {
    const { customer } = useAuthContext();
    const { getApiData, postApiData } = useApi();
    const { currentCity, currentVehicle, countryList } = useSettingsContext();
    const { make, model } = currentVehicle

    const [phoneNumber, setPhoneNumber] = useLocalStorage('cup', '');

    const defaultValues = {
        vehicle_make: { vehicle_make_master_id: '', vehicle_make_name: '' },
        vehicle_model: { vehicle_model_master_id: '', vehicle_model_name: '' },
        name: '',
        phone: '',
        email: '',
        chassis_vin_no: '',
        vehicle_reg_no: '',
        message: '',
        country_master_id: '',
        file: [],
        rfq_services: [],
    };

    useEffect(() => {
        setValue('vehicle_make', { vehicle_make_master_id: make?.vehicle_make_master_id || '', vehicle_make_name: make?.vehicle_make_name || '', });
        setValue('vehicle_model', { vehicle_model_master_id: model?.vehicle_model_master_id || '', vehicle_model_name: model?.vehicle_model_name || '' });
        setValue('vehicle_reg_no', model?.vehicle_reg_no || '');
        setValue('name', customer ? `${customer.first_name} ${customer.last_name}` : '');
        setValue('phone', customer ? customer.phone : phoneNumber);
        setValue('email', customer ? customer.email : '');
        setValue('country_master_id', currentCity ? currentCity.country_master_id : '');
    }, [make, model, customer]);

    const validationSchema = yup.object({
        vehicle_make: yup.object().shape({ vehicle_make_name: yup.string().required(`${t('select_make_')} ${t('is_required')}`), }),
        vehicle_model: yup.object().shape({ vehicle_model_name: yup.string().required(`${t('select_model_')} ${t('is_required')}`), }),
        name: yup.string().required(`${t('name_')} ${t('is_required')}`),
        message: yup.string().required(`${t('message_')} ${t('is_required')}`),
        file: yup.array().max(10, `Max 10 Image is allow`),

        vehicle_reg_no: yup.string()
            .test('max-length', t('maximum_characters').replace('%1$s', 6), function (value) {
                return currentCity.country_code == '973' ? value.length <= 6 : true
            })
            .required(`${t('vehicle_reg_no_')} ${t('is_required')}`),

        phone: yup.string()
            .required(`${t('phone_number_')} ${t('is_required')}`)
            .min(currentCity.min_area_code_length, t('minium_characters').replace('%1$s', currentCity.min_area_code_length))
            .max(currentCity.max_area_code_length, t('maximum_characters').replace('%1$s', currentCity.max_area_code_length)),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch,
        setValue,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = methods;


    const [successMessage, setSuccessMessage] = useState('');
    // lead
    async function requestQuote(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.requestQuote, data);
            if (response) {
                setSuccessMessage(response.data.msg);
                reset();
            }
        }
    }

    const controller = new AbortController();
    const { signal } = controller;

    const [rfqServiceList, setRfqServiceList] = useState([]);
    useEffect(() => {
        async function getRfqServiceList() {
            const response = await getApiData(CUSTOMER_API.getRfqService, signal);
            if (response) {
                setRfqServiceList(response.data.result);
            }
        }
        getRfqServiceList();
        return () => {
            controller.abort();
        };
    }, []);

    const isDesktop = useResponsive('up', 'lg');

    const [makeModal, setMakeModal] = useState(false);
    function makeModalClose(value) {
        if (value.data) {
            setValue('vehicle_make', {
                vehicle_make_master_id: value.data.vehicle_make_master_id,
                vehicle_make_name: value.data.vehicle_make_name,
            });
            setValue('vehicle_model', { vehicle_model_master_id: '', vehicle_model_name: '' });
        }
        setMakeModal(false);
    }

    const [modelModal, setModelModal] = useState(false);
    function modelModalClose(value) {
        if (value.data) {
            setValue('vehicle_model', {
                vehicle_model_master_id: value.data.vehicle_model_master_id,
                vehicle_model_name: value.data.vehicle_model_name,
            });
        }
        setModelModal(false);
    }
    const [loadImage, setLoadImage] = useState(false)
    const handleDrop = useCallback(
        async (acceptedFiles) => {
            const options = { maxSizeMB: 0.15, maxWidthOrHeight: 900, useWebWorker: true };
            const maxImages = Math.min(acceptedFiles.length, 10);
            setLoadImage(true)
            for (let i = 0; i < maxImages; i++) {
                const file = acceptedFiles[i];
                const compressedFile = await imageCompression(file, options);
                const createdFile = new File([compressedFile], compressedFile.name, { type: compressedFile.type, path: compressedFile.name, });
                Object.assign(createdFile, { preview: URL.createObjectURL(createdFile) });
                await imageUploadInBucket(createdFile);
            }
            setLoadImage(false)
        },
        [watch('file')]
    );

    const handleRemoveFile = (inputFile) => {
        const filtered = watch('file') && watch('file')?.filter((file) => file !== inputFile);
        setValue('file', filtered);
    };

    const handleRemoveAllFiles = () => {
        setValue('file', []);
    };

    // Update Countersale customer
    async function uploadBucketImage(data) {
        const response = await postApiData(S3_BUCKET_API.uploadImage, data);
        if (response.status == 200) {
            const data = response.data.result;
            setValue('file', [...watch('file'), data.link], { shouldValidate: true });
        }
    }

    async function imageUploadInBucket(item) {
        const data = { file: item, folder_name: 'request_quote_media' };
        await uploadBucketImage(data);
    }


    async function onSubmit(values) {
        var jsonArray = [];
        values.file.forEach((item) => {
            jsonArray.push({ media_url: item });
        });
        const data = {
            make_id: values.vehicle_make.vehicle_make_master_id,
            model_id: values.vehicle_model.vehicle_model_master_id,
            vehicle_reg_no: values.vehicle_reg_no,
            name: values.name,
            phone: values.phone,
            email: values.email,
            chassis_vin_no: values.chassis_vin_no,
            message: values.message,
            country_master_id: values.country_master_id,
            images_list: JSON.stringify(jsonArray),
            rfq_services: values.rfq_services.map((item) => item.service_master_id).toString()
        };
        await requestQuote(data);
    }



    return (
        <>
            <Backdrop
                sx={{ color: 'primary.main', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadImage}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <FormProvider methods={methods} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <Stack component={MotionViewport} spacing={5}>
                    <m.div variants={varFade().inUp}>
                        <Typography variant={isDesktop ? 'h3' : 'h6'} textTransform='capitalize'>{t('request_a_quote')}</Typography>
                        <Typography
                            variant={isDesktop ? 'body1' : 'caption'}
                            color={'text.secondary'}
                        >{t('request_quote_desc')}</Typography>
                    </m.div>

                    <Stack spacing={3}>
                        <Grid container spacing={2} rowSpacing={3}>
                            <Grid item xs={12} md={6}>
                                <m.div variants={varFade().inUp}>
                                    <RHFTextField
                                        name="vehicle_make.vehicle_make_name"
                                        label={t('select_make_')}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <ArrowDropDown />
                                                </InputAdornment>
                                            ),
                                            readOnly: true,
                                        }}
                                        onClick={() => setMakeModal(true)}
                                    />
                                </m.div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <m.div variants={varFade().inUp}>
                                    <RHFTextField
                                        name="vehicle_model.vehicle_model_name"
                                        label={t('select_model_')}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <ArrowDropDown />
                                                </InputAdornment>
                                            ),
                                            readOnly: true,
                                        }}
                                        onClick={() => setModelModal(true)}
                                    />
                                </m.div>
                            </Grid>
                            <Grid item xs={12}>
                                <m.div variants={varFade().inUp}>
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
                                        />
                                        :
                                        <RHFTextField name="vehicle_reg_no" label={t('vehicle_reg_no_')} />
                                    }
                                </m.div>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <m.div variants={varFade().inUp}>
                                    <RHFTextField
                                        name="name"
                                        label={t('full_name_')}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <TitleOutlined />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </m.div>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <m.div variants={varFade().inUp}>
                                    <RHFTextField
                                        name="email"
                                        label={t('email_')}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AlternateEmail />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </m.div>
                            </Grid>

                            <Grid item xs={4}>
                                <m.div variants={varFade().inUp}>
                                    <RHFSelect
                                        name="country_master_id"
                                        label={t('country_')}
                                        SelectProps={{ native: false }}
                                    >
                                        {countryList.map((option, i) => (
                                            <MenuItem
                                                key={i}
                                                value={option.country_master_id}
                                                sx={{
                                                    mx: 1,
                                                    my: 0.5,
                                                    borderRadius: 0.75,
                                                    typography: 'body2',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                <Box display={'flex'} alignItems="center" gap={1}>
                                                    <Avatar
                                                        src={option.media_url}
                                                        alt={option.media_url_alt}
                                                        sx={{
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: 0.2,
                                                        }}
                                                    />
                                                    <Typography variant="body2">
                                                        {option.country_code}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </RHFSelect>
                                </m.div>
                            </Grid>

                            <Grid item xs={8}>
                                <m.div variants={varFade().inUp}>
                                    <RHFTextField
                                        name="phone"
                                        type='number'
                                        label={t('phone_number_')}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><CallOutlined /></InputAdornment>) }}
                                    />
                                </m.div>
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <m.div variants={varFade().inUp}>
                                    <RHFTextField name="chassis_vin_no" label={t('chassis_vin_number')} />
                                </m.div>
                            </Grid>
                            <Grid item xs={12}>
                                <m.div variants={varFade().inUp}>
                                    {rfqServiceList.length > 0 &&
                                        <RHFAutocomplete
                                            disableCloseOnSelect
                                            multiple
                                            placeholder={t('service')}
                                            name="rfq_services"
                                            label={t('preferred_services')}
                                            options={rfqServiceList}
                                            getOptionLabel={(option) => option.service_name}
                                            isOptionEqualToValue={(option, value) => option.service_master_id === value.service_master_id}
                                            renderTags={(selected, getTagProps) =>
                                                selected.map((option, index) => (
                                                    <Chip
                                                        {...getTagProps({ index })}
                                                        key={option.service_master_id}
                                                        label={option.service_name}
                                                        size="small"
                                                        color="primary"
                                                        variant="soft"
                                                    />
                                                ))
                                            }
                                            renderOption={(props, option) => {
                                                const { service_master_photo, service_name, service_master_id } = rfqServiceList.filter((item) => item.service_master_id === option.service_master_id)[0];
                                                if (!service_master_id) {
                                                  return null;
                                                }
                                                return (
                                                  <li {...props} key={service_master_id}>
                                                        {service_master_photo
                                                            ? <Avatar src={service_master_photo} sx={{ mr: 2,width:28,height:28 }} />
                                                            : <Avatar color={createAvatar(service_name).color} sx={{ mr: 2,width:28,height:28 }}>
                                                                <Typography variant='body2'>{createAvatar(service_name).name}</Typography>
                                                            </Avatar>
                                                        }
                                                    {service_name}
                                                  </li>
                                                );
                                              }}
                                        />}
                                </m.div>
                            </Grid>
                            <Grid item xs={12}>
                                <m.div variants={varFade().inUp}>
                                    <RHFTextField
                                        multiline
                                        rows={4}
                                        fullWidth
                                        name="message"
                                        label={t('enter_your_message_here')}
                                    />
                                </m.div>
                            </Grid>
                          

                            <Grid item xs={12}>
                                <m.div variants={varFade().inUp}>
                                    <Box
                                        display={'flex'}
                                        alignItems="center"
                                        justifyContent={'space-between'}
                                        flexDirection="column"
                                        gap={2}
                                    >
                                        <RHFUpload
                                            accept="image/png"
                                            name="file"
                                            multiple
                                            thumbnail
                                            onRemove={handleRemoveFile}
                                            onRemoveAll={handleRemoveAllFiles}
                                            onDrop={handleDrop}
                                        />
                                    </Box>
                                </m.div>
                            </Grid>

                            <Grid item xs={12}>
                                <m.div variants={varFade().inUp}>
                                    <LoadingButton
                                        size="large"
                                        loading={isSubmitting}
                                        variant="soft"
                                        type="submit"
                                    >
                                        {t('submit_now')}
                                    </LoadingButton>
                                </m.div>
                            </Grid>
                            {successMessage && (
                                <Grid item xs={12}>
                                    <Alert severity="success" variant="standard">
                                        {successMessage}
                                    </Alert>
                                </Grid>
                            )}
                        </Grid>
                    </Stack>
                </Stack>
            </FormProvider>

            <MakeMasterModal open={makeModal} onClose={makeModalClose} NeedSelect />
            <ModelMasterModal open={modelModal} onClose={modelModalClose} NeedSelect referenceData={watch('vehicle_make')} />
        </>
    );
}
