import { yupResolver } from '@hookform/resolvers/yup';
import { CloseOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Drawer, FormGroup, Grid, IconButton, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFUpload } from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar';
import { HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import { CUSTOMER_API, S3_BUCKET_API } from 'src/utils/constant';
import * as yup from 'yup';

export default function UploadFleetVehiclePhoto({ open, onClose, referenceData, customer_vehicle_id }) {

    const controller = new AbortController();
    const { signal } = controller;
    const { getApiData, postApiData } = useApi();

    const [loading, setLoading] = useState(false);
    const defaultValues = {
        file: [],
    };
    const validationSchema = yup.object({
        file: yup.array().min(1, `${t('image_')} ${t('is_required')}`).required("required")
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });

    const {
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = methods;



    async function uploadBucketImage(data) {
        const response = await postApiData(S3_BUCKET_API.uploadImage, data);
        if (response.status == 200) {
            const data = response.data.result;

            const value = {
                file: data.link,
                customer_vehicle_id: customer_vehicle_id

            }
            setValue('file', watch('file').filter((item) => item != data.file))

            await CreateMedia(value)
        }
    }


    async function CreateMedia(data) {
        const response = await postApiData(CUSTOMER_API.fleet_vehicle_photo_create, data);
        
        if (response.status == 200) {
           
        }
    }



    const onSubmit = async (values) => {
        // console.log(values)
        setLoading(true)
        for (let i = 0; i < values.file.length; i++) {
            const data = { file: values.file[i], folder_name: "fleet_vehicle_photo" }
            await uploadBucketImage(data)
        }
        setLoading(false)
        onClose({ status: false, update: true })
    }

    
    const handleDrop = useCallback(
        (acceptedFiles) => {
            acceptedFiles.map(async (file) => {
                // const options = { maxSizeMB: 0.30 };
                // const compressedFile = await imageCompression(file, options);
                // const createdFile = new File([compressedFile], compressedFile.name, { type: compressedFile.type });
                // Object.assign(createdFile, { preview: URL.createObjectURL(file), })
                Object.assign(file, { preview: URL.createObjectURL(file), })
                setValue('file', [...watch('file'), file]);
            })
        },
        [watch('file')]
    );

    // const handleDrop = useCallback(
    //     async (acceptedFiles) => {
    //         const compressedImages = await Promise.all(
    //             acceptedFiles.map(async (file) => {
    //                 try {
    //                     const compressedFile = await compressImage(file);
    //                     return {
    //                         originalFile: file,
    //                         compressedFile: new File([compressedFile], compressedFile.name, { type: compressedFile.type }),
    //                         previewUrl: URL.createObjectURL(compressedFile),
    //                     };
    //                 } catch (error) {
    //                     console.error('Error compressing image:', error);
    //                     return null;
    //                 }
    //             })
    //         );
    
    //         const validCompressedImages = compressedImages.filter((image) => image !== null);
    //         const newFiles = validCompressedImages.map(({ compressedFile }) => compressedFile);
    //         setValue('file', [...watch('file'), ...newFiles]);
    //     },
    //     [watch('file')]
    // );
    
    


    function singleImageRemove(inputFile) {
        const filtered = watch('file').filter((file) => file !== inputFile);
        setValue('file', filtered);
    }

    const handleRemoveAllFiles = () => {
        setValue('file', []);
    };




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
                        <Typography variant="h6">{t('vehicle_photo')}</Typography>
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
                                                        onRemove={singleImageRemove}
                                                        onRemoveAll={handleRemoveAllFiles}
                                                        onDrop={handleDrop}

                                                    />
                                                </Box>
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
