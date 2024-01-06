import { yupResolver } from '@hookform/resolvers/yup';
import { CloseOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Drawer, FormGroup, Grid, IconButton, MenuItem, Skeleton, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { t } from 'i18next';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { FormProvider, RHFAutocomplete, RHFSelect, RHFTextField, RHFUpload } from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import { CUSTOMER_API, S3_BUCKET_API } from 'src/utils/constant';
import * as yup from 'yup';

export default function AddDocumentReminderModal({ open, onClose, referenceData, customer_vehicle_id }) {

    const { currentCity } = useSettingsContext();
    const { getApiData, postApiData } = useApi();
    const { customer } = useAuthContext();
    const controller = new AbortController();
    const { signal } = controller;

    const INTERVAL_TYPE = [{ title: t('day'), value: 1 }, { title: t('month'), value: 2 }, { title: t('year'), value: 3 }];
    const [loading, setLoading] = useState(false);
    const [documentTypeList, setDocumentTypeList] = useState([]);

    const defaultValues = {
        document_type: referenceData ? referenceData.document_type_info : {},
        time_due_threshold: referenceData ? referenceData.time_due_threshold : '',
        time_due_threshold_type: referenceData ? referenceData?.time_due_threshold_type : INTERVAL_TYPE[0].value,
        file: referenceData ? referenceData?.document :[],
        expiry_date:referenceData ? moment(referenceData.expiry_date, 'DD-MM-YYYY').format('MM-DD-YYYY') : '',
    };



    useEffect(() => {
        async function getRfqServiceList() {
            const response = await getApiData(CUSTOMER_API.fleet_management_document_type, signal);
            if (response) {
                setDocumentTypeList(response.data.result);
            }
        }
        getRfqServiceList();
        return () => {
            controller.abort();
        };
    }, []);

    const validationSchema = yup.object({
        document_type: yup.object()
            .test('is-not-empty', `${t('document_type_')} ${t('is_required')}`, (value) => {
                return Object.keys(value).length > 0;
            }),
        time_due_threshold: yup.string().required(`${t('time_due_threshold')} ${t('is_required')}`),
        expiry_date: yup.string().required(`${t('expiry_date_')} ${t('is_required')}`),
        // file:  yup.string().required(`${t('dr_media_')} ${t('is_required')}`),

    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch, setValue, handleSubmit, reset, control } = methods;

    async function onSubmit(values) {

        var jsonArray = [];
        values.file.forEach((item) => {
            jsonArray.push({ media_url: item });
        });

        setLoading(true);
        const data = {
            document_type_id: values?.document_type?.document_type_id,
            expiry_date: values.expiry_date ? moment(values.expiry_date).format('DD-MM-YYYY') : "",
            time_due_threshold_type: values?.time_due_threshold_type,
            time_due_threshold: values?.time_due_threshold,
            customer_vehicle_id: customer_vehicle_id,
            // document_file: values.file,
            images_list: JSON.stringify(jsonArray),
            ...(referenceData && { fleet_vehicle_document_id: referenceData?.fleet_vehicle_document_id }),

        };
        referenceData?.fleet_vehicle_document_id ? await UpdateDocumentReminder(data) : await CreateDocumentReminder(data)
        setLoading(false);
    }

    async function CreateDocumentReminder(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.fleet_management_document_reminder_create, data);
            if (response) {
                reset();
                onClose({ update: true });
            }
        }
    }

    async function UpdateDocumentReminder(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.fleet_management_document_reminder_update, data);
            if (response) {
                reset();
                onClose({ update: true });
            }
        }
    }

    const [loadImage, setLoadImage] = useState(false)

    // const handleDrop = useCallback(
    //     async (acceptedFiles) => {
    //         const options = { maxSizeMB: 0.15, maxWidthOrHeight: 900, useWebWorker: true };
    //         const maxImages = Math.min(acceptedFiles.length, 10);
    //         setLoadImage(true)
    //         for (let i = 0; i < maxImages; i++) {
    //             const file = acceptedFiles[i];
    //             // const compressedFile = await imageCompression(file, options);
    //             // const createdFile = new File([compressedFile], compressedFile.name, { type: compressedFile.type, path: compressedFile.name, });
    //             Object.assign(file, { preview: URL.createObjectURL(file) });
    //             await imageUploadInBucket(file);
    //         }
    //         setLoadImage(false)
    //     },
    //     [watch('file')]
    // );

    const handleDrop = useCallback(
        async (acceptedFiles) => {
            const options = { maxSizeMB: 0.15, maxWidthOrHeight: 900, useWebWorker: true };
            const maxImages = Math.min(acceptedFiles.length, 10);
            for (let i = 0; i < maxImages; i++) {
                const file = acceptedFiles[i];
                setLoadImage(true);
                Object.assign(file, { preview: URL.createObjectURL(file) });
                await imageUploadInBucket(file);
                setLoadImage(false);
            }
        },
        [watch('file')]
    );

    // const handleRemoveFile = (inputFile) => {
    //     setValue('file', null);
    // };
    // const handleRemoveAllFiles = () => {
    //     setValue('file', null);
    // };

    function handleRemoveFile(inputFile) {
        const filtered = watch('file').filter((file) => file !== inputFile);
        setValue('file', filtered);
    }

    const handleRemoveAllFiles = () => {
        setValue('file', []);
    };



    // async function uploadBucketImage(data) {
    //     const response = await postApiData(S3_BUCKET_API.uploadImage, data);
    //     if (response.status == 200) {
    //         const data = response.data.result;
    //         setValue('file', data.link, { shouldValidate: true });
    //     }
    // }

    async function uploadBucketImage(data) {
        const response = await postApiData(S3_BUCKET_API.uploadImage, data);
        if (response.status == 200) {
            const data = response.data.result;
            setValue('file', [...watch('file'), data.link], { shouldValidate: true });
        }
    }


    async function imageUploadInBucket(item) {
        const data = { file: item, folder_name: 'fleet_vehicle_document' };
        await uploadBucketImage(data);
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
                        <Typography variant="h6">{t('document_reminder')}</Typography>
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
                                                {documentTypeList.length > 0 &&
                                                    <RHFAutocomplete
                                                        disableClearable={false}
                                                        placeholder={t('document_type_')}
                                                        name="document_type"
                                                        label={t('document_type_')}
                                                        options={documentTypeList}
                                                        getOptionLabel={(option) => option.document_type || ''}
                                                        isOptionEqualToValue={(option, value) => option.document_type === value.document_type_id}
                                                        renderOption={(props, option) => {
                                                            const { document_type, document_type_id } = documentTypeList.filter((item) => item.document_type_id === option.document_type_id)[0];
                                                            if (!document_type_id) {
                                                                return null;
                                                            }
                                                            return (
                                                                <li {...props} key={document_type_id}>
                                                                    {document_type}
                                                                </li>
                                                            );
                                                        }}
                                                    />}
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                {!loading ?
                                                    <Controller
                                                        name="expiry_date"
                                                        control={control}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <DatePicker
                                                                disablePast
                                                                inputFormat='dd/MM/yyyy'
                                                                label={t('expiry_date_')}
                                                                value={field.value}
                                                                onChange={(newValue) => {
                                                                    field.onChange(newValue);
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                                                                )}
                                                            />
                                                        )}
                                                    />
                                                    : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />}
                                            </Grid>


                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="number"
                                                    name="time_due_threshold"
                                                    label={t('time_due_threshold')}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFSelect
                                                    fullWidth
                                                    name="time_due_threshold_type"
                                                    label={t('time_due_threshold_type')}
                                                    SelectProps={{ native: false, }}
                                                >
                                                    {INTERVAL_TYPE.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.title}
                                                        </MenuItem>
                                                    ))}
                                                </RHFSelect>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Box
                                                    display={'flex'}
                                                    alignItems="center"
                                                    justifyContent={'space-between'}
                                                    flexDirection="column"
                                                    gap={2}
                                                >
                                                    <RHFUpload
                                                        name="file"
                                                        thumbnail
                                                        multiple
                                                        onRemove={handleRemoveFile}
                                                        onRemoveAll={handleRemoveAllFiles}
                                                        onDrop={handleDrop}
                                                    />
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <LoadingButton
                                                    loading={loading}
                                                    disabled={loadImage}
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
