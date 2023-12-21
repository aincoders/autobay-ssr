import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, FormHelperText, Grid, Rating, Typography } from '@mui/material';
import { t } from 'i18next';
import { useContext, useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import Image from 'src/components/image';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { ReviewContext } from 'src/mycontext/ReviewContext';
import * as yup from 'yup';

export default function ReviewOrder() {
    const { loading, serviceGroupList, saveCustomerFeedback, } = useContext(ReviewContext);

    const defaultValues = {
        items: [],
    }
    useEffect(() => {
        if (!loading) {
            setValue('items', serviceGroupList.map((item) => ({ ...item, description: '', rating_star: 4 })))
        }
    }, [loading])

    const validationSchema = yup.object({
        items: yup.array().of(
            yup.object().shape({
                description: yup.string().required(`${t('description')} ${t('is_required')}`),
                rating_star: yup.string().required(`${t('rating')} ${t('is_required')}`),
            })
        ),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch, setValue, control, handleSubmit, formState: { errors, isSubmitting } } = methods;

    const { fields, } = useFieldArray({
        control,
        name: 'items',
    });
    async function onSubmit(values) {
        const newArray = values.items.map((element) => {
            const { media_url, ...rest } = element;
            return rest;
        });
        const data = JSON.stringify(newArray)
        await saveCustomerFeedback(data)
    }


    return (
        <>
            <Box sx={{ p: 3, px: 2 }}>
                <FormProvider methods={methods} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2} rowSpacing={3}>
                        {watch('items').map((service, _i) => {
                            return (
                                <Grid item xs={12} md={12} key={_i}>
                                    <Box sx={{ border: '1px solid', borderColor: 'divider', p: 2, borderRadius: 2 }}>
                                        <Box display={'flex'} alignItems='center' gap={2}>
                                            <Image src={service.media_url} sx={{ minWidth: 84, width: 84, height: 84, borderRadius: 2 }} />
                                            <Box sx={{ width: "100%" }} display='flex' flexDirection={'column'} gap={1}>
                                                <Typography variant='subtitle1'>{service.service_group_name}</Typography>
                                                <RHFTextField
                                                    variant='filled'
                                                    multiline
                                                    rows={3}
                                                    name={`items[${_i}].description`}
                                                    label={t('type_your_feedback_here')}
                                                />
                                                <Box>
                                                    <Controller
                                                        name={`items[${_i}].rating_star`}
                                                        control={control}
                                                        render={({ field }) => <Rating size='small' {...field} value={Number(field.value)} />}
                                                    />
                                                    {!!errors.items && errors.items[_i] && <FormHelperText error> {errors.items[_i].rating_star?.message}</FormHelperText>}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            );
                        })}
                        <Grid item xs={12}>
                            <LoadingButton fullWidth variant="contained" type="submit" loading={isSubmitting}>
                                {t('submit_feedback')}
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </FormProvider>
            </Box>
        </>
    );
}
