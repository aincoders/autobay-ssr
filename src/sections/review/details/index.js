import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, FormHelperText, Grid, lighten, Rating, Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useContext, useEffect, useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import LauncherIcon from 'src/assets/logo/LauncherIcon';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import Image from 'src/components/image';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useSettingsContext } from 'src/components/settings';
import SocialsButton from 'src/components/SocialsButton';
import { APP_NAME } from 'src/config-global';
import { ReviewContext } from 'src/mycontext/ReviewContext';
import { SMALL_MODAL } from 'src/utils/constant';
import * as yup from 'yup';
import LoadingScreen from '../../../components/loading-screen';
import ReviewFooter from './ReviewFooter';
import ReviewOrder from './ReviewOrder';
import ReviewOrderWithEstimate from './ReviewOrderWithEstimate';
import ReviewSuccess from './ReviewSuccess';
import ReviewTitle from './ReviewTitle';

export default function Review() {
    const { loading, orderDetails, } = useContext(ReviewContext);
    const { submit_review, estimate_id, order_number } = orderDetails

    if (loading) return <LoadingScreen />;

    return (
        <>
            <Head>
                <title>{`${order_number || ''} | ${APP_NAME}`}</title>
                <meta name="description" content={t('thanks_order_message').replace('%1$s', APP_NAME)} />
                <meta property="og:title" content={`${order_number || ''} | ${APP_NAME}`} />
                <meta property="og:description" content={t('thanks_order_message').replace('%1$s', APP_NAME)} />
            </Head>

            <Box
                display='flex' alignItems={'center'} justifyContent='center'
                sx={{ bgcolor: (theme) => lighten(theme.palette.primary.main, 0.90), height: submit_review == '1' ? "inherit" : "auto" }}
            >
                <Box display='flex' alignItems={'center'} justifyContent='center'>
                    <Box maxWidth={SMALL_MODAL} sx={{ bgcolor: 'background.default', borderRadius: 3, my: 2, }} >
                        <Box >

                            <Box >
                                {submit_review == '1' ? <ReviewSuccess />
                                    :
                                    <Box>
                                        <ReviewTitle />
                                        {estimate_id == '0' ? <ReviewOrder /> : <ReviewOrderWithEstimate />}
                                    </Box>
                                }
                                <ReviewFooter />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

        </>
    );
}
