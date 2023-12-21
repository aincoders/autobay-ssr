import { AccountBalanceWalletOutlined, ContentCopy, WhatsApp } from '@mui/icons-material';
import { Box, Button, Card, CardActionArea, Container, Divider, Grid, IconButton, InputAdornment, lighten, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import { APP_NAME, SPACING } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useCopyToClipboard from 'src/hooks/useCopyToClipboard';
import useResponsive from 'src/hooks/useResponsive';
import { WalletTransactionModal } from 'src/master';
import { CUSTOMER_API } from 'src/utils/constant';
import CustomerTabMenu from './CustomerTabMenu';


export default function CustomerWallet() {
    const [loading, setLoading] = useState(false);

    const { customer } = useAuthContext();
    const { currentCity ,basicInfo} = useSettingsContext();
    const { postApiData, getApiData } = useApi();

    const controller = new AbortController();
    const { signal } = controller;
    const [referEarnData, setRefernEarnData] = useState('');
    const [walletCode, setWalletCode] = useState('');

    async function GetList() {
        setLoading(true);
        const response = await getApiData(CUSTOMER_API.referEarn, signal);
        if (response) {
            const data = response.data.result;
            setLoading(false);
            setRefernEarnData(data);
            setWalletCode(data.friend_refer_code);
        }
    }
    useEffect(() => {
        GetList();
        return () => {
            controller.abort();
        };
    }, []);

    const { enqueueSnackbar } = useSnackbar();

    const { copy } = useCopyToClipboard();

    const PLAY_STORE = basicInfo.length > 0 ? basicInfo.find((basic) => basic.setting_type == 'PLAY_STORE').description : '';

    const shareLink = referEarnData && referEarnData.share_description.replace('#APP_NAME#', APP_NAME).replace('#APP_LINK#', PLAY_STORE)
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareLink)}`;

    const handleCopy = () => {
        enqueueSnackbar('Copied!');
        copy(shareLink);
    };


    async function applyReferralCode(referCode = '') {
        const data = { refer_code: referCode };
        const response = await postApiData(CUSTOMER_API.referEarnApply, data);
        if (response) {
            GetList()
        }
    }

    const [walletModal, setWalletModal] = useState(false)

    function walletModalClose() {
        setWalletModal(false)
    }

    const isDesktop = useResponsive('up', 'md');


    return (
        <>
            <Head>
                <title> {`${t('my_wallet')} | ${APP_NAME}`}</title>
                <meta property="description" content={`${t('my_wallet')} | ${APP_NAME}`} />
                <meta property="og:title" content={`${t('my_wallet')} | ${APP_NAME}`} />
                <meta property="og:description" content={`${t('my_wallet')} | ${APP_NAME}`} />
            </Head>

            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Grid container spacing={2.5} rowSpacing={3}>
                        <Grid item xs={12}>
                                <CustomerTabMenu current={'wallet'} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2.5} rowSpacing={3} mt={2} direction={isDesktop ? 'row' : 'column-reverse'}>
                        <Grid item xs={12} md={6}>
                            <Box display={'flex'} flexDirection='column' gap={2}>
                                <Box
                                    onClick={() => setWalletModal(true)}
                                    component={CardActionArea}
                                    display={'flex'}
                                    alignItems='center'
                                    justifyContent={'space-between'}
                                    sx={{ borderRadius: 1, p: 2, border: "1px solid", borderColor: 'divider' }}
                                >
                                    <Box display={'flex'} alignItems='center' gap={2}>
                                    <AccountBalanceWalletOutlined sx={{ color: "primary.main" }} />
                                        <Box display={'flex'} flexDirection='column'>
                                            <Typography variant='subtitle2'>{`${APP_NAME} Wallet Money`}</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant='subtitle2' fontWeight={'bold'} color={'primary'}>{`${currentCity.currency_symbol} ${Number(referEarnData.wallet_balance).toFixed(currentCity.decimal_value)}`}</Typography>
                                </Box>
                                <Box display={'flex'} flexDirection='column' gap={1} >
                                    <Typography variant='subtitle2'>{t('your_referral_code')}</Typography>
                                    <Box onClick={() => handleCopy()} display={'flex'} alignItems='center' justifyContent={'space-between'} sx={{ cursor: "pointer", borderRadius: 1, bgcolor: (theme) => lighten(theme.palette.primary.main, 0.95), color: 'primary.main', p: 1, border: "1px dashed", borderColor: 'primary.main' }}>
                                        <Typography variant='subtitle2'>{referEarnData.refer_code}</Typography>
                                        <IconButton >
                                            <ContentCopy fontSize='small' sx={{ color: "primary.main" }} />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Button
                                    component={Link}
                                    href={shareUrl}
                                    target='_blank'
                                    variant='contained'
                                    color='success'
                                    sx={{ justifyContent: 'space-between', borderRadius: 1, py: 1.5, }} endIcon={<WhatsApp />}
                                >
                                    {t('share_via_whatsapp')}
                                </Button>
                                <Box display={'flex'} flexDirection='column' gap={1} py={2}>
                                    <Typography variant='subtitle2'>{t('avail_referral_discount')}</Typography>
                                    <TextField
                                        disabled={referEarnData.friend_refer_code != ''}
                                        fullWidth
                                        label={'Friend Referral Code'}
                                        variant="filled"
                                        onChange={(e) => setWalletCode(e.target.value)}
                                        value={walletCode}
                                        autoComplete="off"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {walletCode && !referEarnData.friend_refer_code && <Button size='small' variant="soft" onClick={() => applyReferralCode(walletCode)}>{t('apply')}</Button>}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>

                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box display={'flex'} flexDirection='column' gap={2}>
                                <Image src={referEarnData.media_url} alt={referEarnData.media_url_alt} />
                                <Box display={'flex'} flexDirection='column'>
                                    <Typography variant='subtitle2'>{referEarnData.title}</Typography>
                                    <Typography variant='caption' color={'text.secondary'}>{referEarnData.description}</Typography>
                                </Box>
                                <Card>
                                    <Typography variant='body1' fontWeight={'medium'} sx={{ p: 1.5 }}>{`${t('how_it_works')}?`}</Typography>
                                    <Divider sx={{ borderStyle: 'dashed', }} />
                                    <Box display={'flex'} flexDirection='column' gap={2} sx={{ p: 1.5 }}>
                                        {referEarnData && referEarnData.how_it_works.length > 0 && referEarnData.how_it_works.map((step, i) => {
                                            return (
                                                <Box display={'flex'} alignItems='center' gap={1} key={i}>
                                                    <Box sx={{
                                                        width: 32, height: 32,
                                                        bgcolor: (theme) => lighten(theme.palette.primary.main, 0.90),
                                                        color: 'primary.main',
                                                        borderRadius: 5,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center', position: 'relative',
                                                    }}
                                                    >
                                                        <Typography variant={'subtitle2'}>{i + 1}</Typography>
                                                        {referEarnData.how_it_works.length - 1 == i ? null :
                                                            <Box sx={{ height: '110%', top: '100%', width: '2px', position: 'absolute', bgcolor: 'primary.main', }} />
                                                        }
                                                    </Box>

                                                    <Box display={'flex'} alignItems="center" flex={1}>
                                                        <Box display="flex" gap={{ xs: 0, md: 0.8 }} flexDirection="column" flex={1}>
                                                            <Typography variant={'body2'} color='text.secondary' component="span">
                                                                {step.title}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>

                      
                    </Grid>
                </Box>
            </Container>

            <WalletTransactionModal open={walletModal} onClose={walletModalClose} />
        </>
    );
}
