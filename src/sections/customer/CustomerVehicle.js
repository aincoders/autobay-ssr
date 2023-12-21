import { Add, SearchOutlined } from '@mui/icons-material';
import { Box, Button, Container, Grid, InputAdornment, Skeleton, TextField } from '@mui/material';
import { t } from 'i18next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { APP_NAME, SPACING } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { EditVehicleModal, MakeMasterModal } from 'src/master';
import { getCartItemOnline, resetCart } from 'src/redux/slices/product';
import { useDispatch } from 'src/redux/store';
import { CUSTOMER_API } from 'src/utils/constant';
import CustomerTabMenu from './CustomerTabMenu';
import { CustomerVehicleList } from './list';

export default function CustomerVehicle() {
    const { getApiData, postApiData } = useApi();
    const { onChangeVehicle } = useSettingsContext();

    const isDesktop = useResponsive('up', 'md');

    const controller = new AbortController();
    const { signal } = controller;
    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);

    async function GetList() {
        setLoading(true);
        const response = await getApiData(CUSTOMER_API.getVehicle, signal);
        if (response) {
            const data = response.data.result;
            setLoading(false);
            setResponseList(data);
        }
    }
    useEffect(() => {
        GetList();
        return () => {
            controller.abort();
        };
    }, []);

    const dispatch = useDispatch();

    async function selectVehicle(data) {
        onChangeVehicle(data, data);
        dispatch(resetCart());
        CustomerUpdateDefaultVehicle(data);
    }
    // when customer login default vehicle set
    async function CustomerUpdateDefaultVehicle(model) {
        const response = await postApiData(CUSTOMER_API.updateDefaultVehicle, {
            vehicle_model_master_id: model.vehicle_model_master_id,
        });
        if (response.status == 200) {
            const params = {
                vehicle_model_master_id: model.vehicle_model_master_id,
                promo_code_id: '',
            };
            dispatch(getCartItemOnline(params));
        }
    }

    // delete customer vehicle
    async function CustomerDeleteVehicle(address) {
        const response = await postApiData(CUSTOMER_API.deleteVehicle, {
            customer_vehicle_id: address.customer_vehicle_id,
        });
        if (response) {
            setResponseList(
                responseList.filter(
                    (response) => response.customer_vehicle_id != address.customer_vehicle_id
                )
            );
        }
    }

    const [makeModal, setMakeModal] = useState(false);
    function makeModalClose(value) {
        setMakeModal(value.status);
        GetList();
    }

    const [editVehicleModal, setEditVehicleModal] = useState({ status: false, data: '' });
    function editVehicleModalClose(value) {
        if (value.update) {
            GetList();
        }
        setEditVehicleModal({ status: value.status, data: '' });
    }

    const [search, setSearch] = useState('');

    return (
        <>
            <Head>
                <title> {`${t('my_vehicle')} | ${APP_NAME}`}</title>
                <meta property="description" content={`${t('my_vehicle')} | ${APP_NAME}`} />
                <meta property="og:title" content={`${t('my_vehicle')} | ${APP_NAME}`} />
                <meta property="og:description" content={`${t('my_vehicle')} | ${APP_NAME}`} />
            </Head>

            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Grid container spacing={2.5} rowSpacing={3}>
                        <Grid item xs={12}>
                            <Box display={'flex'} alignItems="flex-start" justifyContent={'space-between'}>
                                {isDesktop && <CustomerTabMenu current={'vehicle'} />}
                                <Button variant="soft" startIcon={<Add />} onClick={() => setMakeModal(true)}>
                                    {t('add_vehicle')}
                                </Button>
                            </Box>
                        </Grid>
                        {responseList.length > 0 && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    placeholder={t('search')}
                                    variant="outlined"
                                    onChange={(e) => setSearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {' '}
                                                <SearchOutlined fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        )}
                        {!loading && responseList.length > 0
                            ? responseList
                                .filter(
                                    (response) =>
                                        response.vehicle_model_name
                                            .toLowerCase()
                                            .includes(search.toLowerCase()) ||
                                        response.vehicle_reg_no
                                            .toLowerCase()
                                            .includes(search.toLowerCase())
                                )
                                .map((response, index) => {
                                    return (
                                        <CustomerVehicleList
                                            key={index}
                                            Row={response}
                                            onEdit={() =>
                                                setEditVehicleModal({
                                                    status: true,
                                                    data: response,
                                                })
                                            }
                                            onDelete={() => CustomerDeleteVehicle(response)}
                                            changeVehicle={() => selectVehicle(response)}
                                        />
                                    );
                                })
                            : !loading && <SkeletonEmptyOrder isNotFound={!responseList.length} />}

                        {loading &&
                            [...Array(9)].map((_, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Skeleton variant="rounded" sx={{ width: '100%', margin: 'auto', height: 100, }}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                </Box>
            </Container>

            <MakeMasterModal open={makeModal} onClose={makeModalClose} />
            <EditVehicleModal
                open={editVehicleModal.status}
                referenceData={editVehicleModal.data}
                onClose={editVehicleModalClose}
            />
        </>
    );
}
