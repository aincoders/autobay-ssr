import { EmailOutlined, KeyboardArrowDownOutlined, PhoneOutlined, PlaceOutlined, WhatsApp } from '@mui/icons-material';
import { alpha, Box, Button, Collapse, Container, Grid, IconButton, Link as MaterialLink, Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AppStoreIcon from 'src/assets/image/get_it_on_app_store.svg';
import GooglePlayIcon from 'src/assets/image/get_it_on_google_play.svg';
import LauncherIcon from 'src/assets/logo/LauncherIcon';
import { IconButtonAnimate } from 'src/components/animate';
import Iconify from 'src/components/iconify/Iconify';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import SocialsButton from 'src/components/SocialsButton';
import { APP_NAME } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { CorporateCustomerModal } from 'src/master';
import { replaceString } from 'src/utils/arraytoTree';
import { CUSTOMER_API, META_TAG } from 'src/utils/constant';

export default function FooterBottombar() {
    const theme = useTheme();
    const { getApiData } = useApi();
    const controller = new AbortController();
    const { signal } = controller;
    const { basicInfo, currentVehicle, currentCity } = useSettingsContext();
    const make = currentVehicle?.make || ''; 
    const model = currentVehicle?.model || ''; 


    const Address = basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type == 'ADDRESS').description : '';
    const PhoneNumber = basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type == 'PHONE').description : '';
    const EMAIL = basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type == 'EMAIL').description : '';
    const APP_STORE = basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type == 'APP_STORE').description : '';
    const PLAY_STORE = basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type == 'PLAY_STORE').description : '';
    const WHATSAPP = basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type == 'WHATSAPP').description : '';

    const isDesktop = useResponsive('up', 'md');

    const [aboutExpand, setAboutExpand] = useState(false);
    const [serviceExpand, setServiceExpand] = useState(false);

    useMemo(() => {
        setAboutExpand(isDesktop);
        setServiceExpand(isDesktop);
    }, [isDesktop]);

    const [corporateModal, setCorporateModal] = useState(false);
    async function corporateModalClose(value) {
        setCorporateModal(false);
    }
    const [serviceList, setServiceList] = useState([]);
    async function GetServiceList() {
        const response = await getApiData(CUSTOMER_API.service);
        if (response) {
            setServiceList(response.data.result.list);
        }
    }
    useEffect(() => {
        if (currentCity.country_master_id) {
            GetServiceList();
        }
        return () => {
            controller.abort();
        };
    }, []);


    var message = `Hello ${APP_NAME}`;
    const encodedMessage = encodeURIComponent(message);

    return (
        <>

            <Box sx={{ py: { xs: 2, md: 5 }, pb: { xs: 8, md: 5 }, bgcolor: theme.palette.secondary.main, }}>

                {WHATSAPP &&
                    <>
                        {isDesktop
                            ?
                            <Box sx={{ position: 'fixed', bottom: 20, right: 20 }}>
                            <Button
                                startIcon={<WhatsApp />}
                                variant='contained'
                                color='success'
                                LinkComponent={'a'}
                                href={`https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodedMessage}`} target="_blank"
                            >
                                {t('chat_with_us')}
                            </Button>
                            </Box>
                            :
                            <Box sx={{ position: 'fixed', bottom: 56, right: 10 }}>
                                <IconButtonAnimate variant='contained' color='success' component={Link}
                                    href={`https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodedMessage}`}
                                    target={"_blank"}
                                >
                                    <Iconify icon={'logos:whatsapp-icon'} sx={{ width: 32, height: 32 }} />
                                </IconButtonAnimate>
                            </Box>
                        }
                    </>
                }

                <Container maxWidth="lg" >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3.5}>
                            <Box display={'flex'} flexDirection="column" gap={2}>
                                <LauncherIcon sx={{ width: 'auto' }} />
                                <Typography variant={isDesktop ? 'body1' : 'caption'} color='background.paper' >{replaceString(META_TAG.footerAbout)}</Typography>
                                <SocialsButton  />
                            </Box>
                        </Grid>
                        <Grid item md={0.5} />
                        <Grid item xs={12} md={2.66}>
                            <Box display={'flex'} flexDirection="column" color='background.paper'>
                                <Box display={'flex'} alignItems="center" justifyContent={'space-between'} onClick={() => !isDesktop && setAboutExpand(!aboutExpand)}>
                                    <Typography variant={isDesktop ? 'subtitle1' : 'body2'} fontWeight="medium" textTransform={'uppercase'}>
                                        {t('about_us')}
                                    </Typography>
                                    {!isDesktop && (
                                        <IconButton> <KeyboardArrowDownOutlined sx={{ transform: aboutExpand && 'rotate(180deg)' }} /></IconButton>
                                    )}
                                </Box>
                                <Collapse
                                    in={aboutExpand}
                                    timeout="auto"
                                    mountOnEnter
                                    sx={{ mt: aboutExpand ? 2 : 0 }}
                                >
                                    <Box display={'flex'} flexDirection="column" gap={1}>
                                        <Typography variant="body1">
                                            <Link prefetch={false} href={`/about-us`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {t('about_us')}
                                            </Link>
                                        </Typography>

                                        <Typography variant="body1">
                                            <Link prefetch={false} href={`/blog`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {t('blog')}
                                            </Link>
                                        </Typography>

                                        <Typography variant="body1">
                                            <Link prefetch={false} href={`/faqs`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {t('faqs')}
                                            </Link>
                                        </Typography>
                                       
                                        <Typography variant="body1">
                                            <Link prefetch={false} href={`/news-media`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {t('news_media')}
                                            </Link>
                                        </Typography>

                                        <Typography variant="body1">
                                            <Link prefetch={false} href={`/terms-conditions`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {t('terms_conditions')}
                                            </Link>
                                        </Typography>

                                        <Typography variant="body1">
                                            <Link prefetch={false} href={`/privacy-policy`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {t('privacy_policy')}
                                            </Link>
                                        </Typography>

                                        <Typography variant="body1">
                                            <Link prefetch={false} href={`/cancellation-policy`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {t('cancellation_policy')}
                                            </Link>
                                        </Typography>

                                        <Typography variant="body1" onClick={() => setCorporateModal(true)} sx={{ cursor: 'pointer' }}>
                                            {t('appname_partners').replace('%1$s', APP_NAME)}
                                        </Typography>

                                        <Typography variant="body1">
                                            <Link prefetch={false} href={`/contact-us`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {t('contact_us')}
                                            </Link>
                                        </Typography>
                                    </Box>
                                </Collapse>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={2.66}>
                            <Box display={'flex'} flexDirection="column" color='background.paper'>
                                <Box display={'flex'} alignItems="center" justifyContent={'space-between'} onClick={() => !isDesktop && setServiceExpand(!serviceExpand)}>
                                    <Typography variant={isDesktop ? 'subtitle1' : 'body2'} fontWeight="medium" textTransform={'uppercase'}>
                                        {t('our_services')}
                                    </Typography>
                                    {!isDesktop && <IconButton><KeyboardArrowDownOutlined sx={{ transform: serviceExpand && 'rotate(180deg)' }} /></IconButton>}
                                </Box>
                                <Collapse in={serviceExpand} timeout="auto" mountOnEnter sx={{ mt: serviceExpand ? 2 : 0 }}>
                                    <Box display={'flex'} flexDirection="column" gap={1}>
                                        {serviceList.length > 0 &&
                                            serviceList.map((row, _i) => {
                                                const generatedPath = `/${currentCity?.slug}/${row.package_category_slug}/${model ? model?.vehicle_model_slug : (make && make?.vehicle_make_slug)}`;
                                                return (
                                                    <Typography variant="body1" key={_i}>
                                                        <Link
                                                            prefetch={false}
                                                            href={{ pathname: generatedPath, query: { packageCategory: true } }}
                                                            as={`${generatedPath}`}
                                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                                        >
                                                            {row.package_category_name}
                                                        </Link>
                                                    </Typography>
                                                );
                                            })}
                                    </Box>
                                </Collapse>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={2.66}>
                            <Box display={'flex'} flexDirection="column" gap={3} color='background.paper'>
                                <Box display={'flex'} alignItems="center" gap={2}>
                                    <PlaceOutlined />
                                    <Box display={'flex'} flexDirection="column">
                                        <Typography variant={isDesktop ? 'body2' : 'caption'} fontWeight={'medium'} color="text.secondary" lineHeight={'1'}>
                                            {t('address')}
                                        </Typography>
                                        <Typography variant={isDesktop ? 'subtitle2' : 'body2'} fontWeight="medium" component={'p'}>
                                            {Address || '---'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <MaterialLink href={`mailto:${EMAIL}`} color="inherit">
                                    <Box display={'flex'} alignItems="center" gap={2}>
                                        <EmailOutlined />
                                        <Box display={'flex'} flexDirection="column">
                                            <Typography variant={isDesktop ? 'body2' : 'caption'} fontWeight={'medium'} color="text.secondary" lineHeight={'1'}>
                                                {t('email')}
                                            </Typography>
                                            <Typography variant={isDesktop ? 'subtitle2' : 'body2'} fontWeight="medium" component={'p'}>
                                                {EMAIL || '---'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MaterialLink>
                                <MaterialLink href={`tel:${PhoneNumber}`} color="inherit">
                                    <Box display={'flex'} alignItems="center" gap={2}>
                                        <PhoneOutlined />
                                        <Box display={'flex'} flexDirection="column">
                                            <Typography variant={isDesktop ? 'body2' : 'caption'} fontWeight={'medium'} color="text.secondary" lineHeight={'1'}>
                                                {t('call_us')}
                                            </Typography>
                                            <Typography variant={isDesktop ? 'subtitle2' : 'body2'} fontWeight="medium" component={'p'}>
                                                {PhoneNumber || '---'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MaterialLink>
                                <Box display={'flex'} flexDirection="row" gap={2} flexWrap='wrap'>
                                    {PLAY_STORE && <Link href={PLAY_STORE} target={'_blank'} rel="noopener">
                                        <Image src={GooglePlayIcon.src} sx={{ height: 'auto', width: 140 }} />
                                    </Link>}
                                    {APP_STORE && <Link href={APP_STORE} target={'_blank'} rel="noopener">
                                        <Image src={AppStoreIcon.src} sx={{ height: 'auto', width: 140 }} />
                                    </Link>}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <CorporateCustomerModal open={corporateModal} onClose={corporateModalClose} />
        </>
    );
}