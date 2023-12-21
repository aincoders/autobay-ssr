import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Grid, Rating, useTheme } from '@mui/material';
import { t } from 'i18next';
import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import { ReviewContext } from 'src/mycontext/ReviewContext';
import * as yup from 'yup';

export default function ReviewOrderWithEstimate() {
    const { saveCustomerFeedbackEstimateOrder } = useContext(ReviewContext);
    const { basicInfo, } = useSettingsContext();

    const theme = useTheme()

    const defaultValues = {
        rating_star: 4,
        description: ""
    }

    const validationSchema = yup.object({
        rating_star: yup.string().required(`${t('rating_star')} ${t('is_required')}`),
        description: yup.string().required(`${t('description')} ${t('is_required')}`),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { setValue, control, handleSubmit, formState: { errors,isSubmitting } } = methods;


    async function onSubmit(values) {
        await saveCustomerFeedbackEstimateOrder(values)
    }


    return (
        <>
            <Box sx={{ p: 3, px: 2 }}>
                <FormProvider methods={methods} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2} rowSpacing={3}>
                        
                        <Grid item xs={12} md={12}>
                            <Controller
                                name={`rating_star`}
                                control={control}
                                render={({ field }) => <Rating size='' {...field} value={Number(field.value)} />}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <RHFTextField
                                variant='filled'
                                multiline
                                rows={3}
                                name={`description`}
                                label={t('type_your_feedback_here')}
                            />
                        </Grid>
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
