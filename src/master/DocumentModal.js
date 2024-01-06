import { CloseOutlined, DeleteOutline, VisibilityOutlined } from '@mui/icons-material';
import { Box, Card, Drawer, FormGroup, IconButton, Link, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/system';
import { t } from 'i18next';
import NextLink from 'next/link';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFUpload } from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { DRAWER, HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { CUSTOMER_API, S3_BUCKET_API } from 'src/utils/constant';
import ConfirmDialog from './ConfirmDialog';

export default function DocumentModal({ open, onClose, referenceData, customer_vehicle_id }) {

    const controller = new AbortController();
    const { signal } = controller;
    const [documentList, setDocumentList] = useState(referenceData?.documents_list);
    const { getApiData, postApiData } = useApi();

    console.log(referenceData)
    const isDesktop = useResponsive('up', 'lg');


    const defaultValues = {
        file: [],
    };





    async function GetList() {
        const params = { customer_vehicle_id: customer_vehicle_id, fleet_vehicle_document_id: referenceData?.fleet_vehicle_document_id }
        const response = await getApiData(CUSTOMER_API.fleet_management_document_reminder_documents_list, params, signal);
        if (response) {
            const data = response.data.result;
            setDocumentList(data);
        }
    }


    const handleDelete = async (row) => {
        await DeleteItem(row.fleet_vehicle_document_image_id)
    };

    async function DeleteItem(fleet_vehicle_document_image_id) {
        try {
            const data = {
                fleet_vehicle_document_image_id: fleet_vehicle_document_image_id,
                fleet_vehicle_document_id: referenceData?.fleet_vehicle_document_id,
                customer_vehicle_id: customer_vehicle_id,
            };
            const response = await postApiData(CUSTOMER_API.fleet_management_document_reminder_delete_document, data);
            GetList()
        } catch (err) {
            console.log(err)
        }
    }


    const methods = useForm({
        defaultValues,
    });
    const { watch, setValue, handleSubmit, reset, control } = methods;

    async function onSubmit(values) {
    }


    const handleDrop = useCallback(
        (acceptedFiles) => {
            const maxImages = Math.min(acceptedFiles.length, 10);
            acceptedFiles.map(async (file) => {
                const options = { maxSizeMB: 0.30 };
                Object.assign(file, { preview: URL.createObjectURL(file) });
                setValue('file', [...watch('file'), file]);
                setTimeout(async () => {
                    // await imageUploadInBucket(file);
                    setValue('file', watch('file').filter((item) => item.preview !== file.preview));
                    // GetList()
                }, 100); // Adjust the delay as needed
            });
        },
        [watch('file')]
    );


    async function uploadBucketImage(data) {
        const response = await postApiData(S3_BUCKET_API.uploadImage, data);
        if (response.status == 200) {
            const response_data = response.data.result;
            const data = { customer_vehicle_id: customer_vehicle_id, fleet_vehicle_document_id: referenceData?.fleet_vehicle_document_id, document_file: response_data.link };
            await UpdateDocumentReminder(data)
        }
    }

    async function UpdateDocumentReminder(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.fleet_management_document_reminder_upload_document, data);
        }
    }

    async function imageUploadInBucket(item) {
        const data = { file: item, folder_name: 'fleet_vehicle_document' };
        await uploadBucketImage(data);
    }

    function handleRemoveFile(inputFile) {
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
                anchor={isDesktop ? 'right' : 'bottom'}
                open={open}
                onClose={() => { onClose({ status: false }) }}
                PaperProps={{ sx: { width: { xs: '100%', md: '550px' }, height: { xs: DRAWER.MOBILE_HEIGHT, md: '100%' } } }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2, }}>
                        <Box display={'flex'} flexDirection={'column'}  >
                            <Typography variant="h6">{referenceData?.document_type_info?.document_type}</Typography>
                            <Typography variant="body2" color={'primary'}>
                                {`${t('expiry_date_')} ${referenceData?.expiry_date}`}
                            </Typography>
                        </Box>
                        <Box display={'flex'} alignItems="center" gap={1}>
                            <IconButton aria-label="close modal" onClick={() => { onClose({ status: false }) }}>
                                <CloseOutlined />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ overflow: 'hidden', pt: 2 }} display="flex" flexDirection={'column'} gap={1} flex={1} minHeight={0}>
                        <Box display={'flex'} sx={{ overflow: 'hidden', flex: 1 }}>
                            <Scrollbar sx={{ flex: 1, height: '100%', px: 2, pb: 2 }}>

                                <Box
                                    gap={2}
                                    display="grid"
                                    gridTemplateColumns={{
                                        xs: 'repeat(1, 1fr)',
                                        sm: 'repeat(2, 1fr)',
                                        md: 'repeat(3, 1fr)',
                                    }}
                                    sx={{ p: 2 }}
                                >

                                    {documentList?.length > 0
                                        ? documentList
                                            .map((response, i) => (
                                                <DocumentList
                                                    key={i}
                                                    Row={response}
                                                    onDelete={() => handleDelete(response)}
                                                />
                                            ))
                                        : (<SkeletonEmptyOrder isNotFound={!referenceData.length} />)}
                                </Box>
                                <FormProvider
                                    methods={methods}
                                    autoComplete="off"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <FormGroup>
                                        <RHFUpload
                                            name="file"
                                            thumbnail
                                            multiple
                                            onDrop={handleDrop}
                                        />

                                    </FormGroup>
                                </FormProvider>

                            </Scrollbar>


                        </Box>
                    </Box>
                </Box>
            </Drawer>

        </>
    );
}


function DocumentList({ Row, onDelete }) {
    const { media_url, extension } = Row;
    const theme = useTheme();
    const [confirmation, setConfirmation] = useState(false);

    async function confirmationClose(value) {
        if (value.confirmation) {
            onDelete();
        }
        setConfirmation(value.status);
    }

    return (
        <>

            <Card
                key={media_url}
                sx={{
                    pt: 2,
                    display: 'flex',
                    position: 'relative',
                    alignItems: 'center',
                    flexDirection: 'column',
                    borderRadius: 4
                }}

            >
                {extension === "pdf" ? (
                    <Box component="img" src={'/assets/images/ic_pdf.svg'} sx={{ width: 150, height: 150, mb: 1, p: 1 }} />
                ) : (
                    <Box component="img" src={media_url} sx={{ width: 150, height: 150, mb: 1, p: 1, borderRadius: 4 }} />
                )}

                <Stack alignItems="center" justifyContent="center" direction="row">
                    <Link
                        component={NextLink}
                        href={media_url}
                        noWrap
                        underline="none"
                        target="_blank"  // Add this line to open the link in a new tab

                    >
                        <IconButton>
                            <VisibilityOutlined />
                        </IconButton>
                    </Link>
                    <IconButton onClick={() => { setConfirmation(true); }}>
                        <DeleteOutline />
                    </IconButton>

                </Stack>


            </Card>



            {confirmation && (
                <ConfirmDialog
                    title={`${t('remove')}`}
                    open={confirmation}
                    description={` ${t('msg_remove').replace('%1$s', t('document'))}`}
                    onClose={confirmationClose}
                />
            )}
        </>
    );
}
