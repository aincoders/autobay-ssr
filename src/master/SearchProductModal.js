import { ArrowBackOutlined, SearchOutlined } from '@mui/icons-material';
import { Box, Drawer, InputAdornment, Link, List, MenuItem, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IconButtonAnimate } from 'src/components/animate';
import Image from 'src/components/image';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { SkeletonEmptyOrder, SkeletonGridRowItem } from 'src/components/skeleton';
import { DRAWER, HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { SEARCH_PACKAGE } from 'src/utils/constant';

export default function SearchProductModal() {
    const [openModal, setOpenModal] = useState(false);
    const isDesktop = useResponsive('up', 'lg');

    const router = useRouter();
    const { getApiData } = useApi();
    const { currentCity, currentVehicle } = useSettingsContext();

    const controller = new AbortController();
    const { signal } = controller;

    const [searchProducts, setSearchProducts] = useState('');
    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);

    async function GetList() {
        try{
            setLoading(true);
            const params = { search_keyword: searchProducts };
            const response = await getApiData(SEARCH_PACKAGE, params, signal);
            if (response) {
                const data = response.data.result;
                setLoading(false);
                setResponseList(data);
            }
        }catch(error){
        }
    }
    useEffect(() => {
        if (searchProducts) {
            GetList();
        }
        return () => {
            controller.abort();
        };
    }, [searchProducts]);

    const handleGotoProduct = (option) => {
        const getUrl = `/${currentCity?.slug}/${option.slug_url}/${currentVehicle?.model ? currentVehicle?.model?.vehicle_model_slug : (currentVehicle?.make && currentVehicle?.make?.vehicle_make_slug)}`;
        setResponseList([]);
        setSearchProducts('');
        setOpenModal(false);
        router.push(`/[city]/[...category]?packageDetailSlug=true`, getUrl);
    };

    return (
        <>
            <IconButtonAnimate onClick={() => setOpenModal(true)}>
                <SearchOutlined />
            </IconButtonAnimate>

            <Drawer
                variant="temporary"
                anchor={isDesktop ? 'top' : 'bottom'}
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                }}
                PaperProps={{
                    sx: { minHeight: { xs: '100%', lg: DRAWER.MAIN_DESKTOP_HEIGHT } },
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, }}>
                        <TextField
                            value={searchProducts}
                            onChange={(e) => setSearchProducts(e.target.value)}
                            variant="standard"
                            fullWidth
                            name="phoneNumber"
                            autoFocus
                            autoComplete="off"
                            type="search"
                            placeholder={t('search')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" onClick={() => { setOpenModal(false); setResponseList([]) }}>
                                        <ArrowBackOutlined />
                                    </InputAdornment>
                                ),
                                disableUnderline: true,
                            }}
                        />
                    </Box>

                    <Scrollbar>
                        <List disablePadding>
                            {!loading && responseList.length > 0
                                ? responseList
                                    .filter((response) => response.service_group_name != '')
                                    .map((response, _i) => {
                                        return (
                                            <MenuItem key={_i} sx={{ py: 1 }} onClick={() => handleGotoProduct(response)}>
                                                <Image alt={response.media_url_alt} src={response.media_url} sx={{ width: 42, height: 42, borderRadius: 1, flexShrink: 0, mr: 2 }} />
                                                <Link underline="none">
                                                    <Typography variant="subtitle2" color={'text.primary'}>{response.service_group_name}</Typography>
                                                </Link>
                                            </MenuItem>
                                        );
                                    })
                                : !loading &&
                                searchProducts != '' && (<SkeletonEmptyOrder isNotFound={!responseList.length} />)}

                            {loading && <SkeletonGridRowItem />}
                        </List>
                    </Scrollbar>
                </Box>
            </Drawer>
        </>
    );
}