import { Add } from '@mui/icons-material';
import { Box, Button, Container, Grid, Skeleton } from '@mui/material';
import { t } from 'i18next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { APP_NAME, SPACING } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { AddAddressModal } from 'src/master';
import { CUSTOMER_API } from 'src/utils/constant';
import CustomerTabMenu from './CustomerTabMenu';
import { CustomerAddressList } from './list';

export default function CustomerAddress() {
    const { getApiData, postApiData } = useApi();
    const isDesktop = useResponsive('up', 'md');

    const controller = new AbortController();
    const { signal } = controller;

    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    async function GetList() {
        setLoading(true);
        const response = await getApiData(CUSTOMER_API.getAddress, signal);
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

    const [openModal, setOpenModal] = useState({ status: false, data: '' });
    function openModalClose(value) {
        if (value.update) {
            GetList();
        }
        setOpenModal({ status: false, data: '' });
    }

    async function CustomerDeleteAddress(address) {
        const response = await postApiData(CUSTOMER_API.deleteAddress, {
            customer_address_id: address.customer_address_id,
        });
        if (response) {
            setResponseList(
                responseList.filter(
                    (response) => response.customer_address_id != address.customer_address_id
                )
            );
        }
    }

    async function AddressUpdateStatus(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.updateAddress, {
                ...data,
                customer_address_default: '1',
            });
            if (response) {
                const updatedArr = responseList.map((res) =>
                    res.customer_address_id === data.customer_address_id
                        ? { ...res, customer_address_default: '1' }
                        : { ...res, customer_address_default: '0' }
                );
                setResponseList(updatedArr);
            }
        }
    }

    return (
        <>
            <Head>
                <title> {`${t('my_address')} | ${APP_NAME}`}</title>
                <meta property="description" content={`${t('my_address')} | ${APP_NAME}`} />
                <meta property="og:title" content={`${t('my_address')} | ${APP_NAME}`} />
                <meta property="og:description" content={`${t('my_address')} | ${APP_NAME}`} />

            </Head>

            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Grid container spacing={2.5} rowSpacing={3}>
                        <Grid item xs={12}>
                            <Box display={'flex'} alignItems="flex-start" justifyContent={'space-between'}>
                                {isDesktop && <CustomerTabMenu current={'address'} />}
                                <Button variant="soft" startIcon={<Add />} onClick={() => setOpenModal({ status: true, data: '' })}>
                                    {t('add_address')}
                                </Button>
                            </Box>
                        </Grid>

                        {!loading && responseList.length > 0
                            ? responseList.map((response, index) => {
                                  return (
                                      <CustomerAddressList
                                          key={index}
                                          Row={response}
                                          onEdit={() =>
                                              setOpenModal({
                                                  status: true,
                                                  data: response,
                                              })
                                          }
                                          onDelete={() => CustomerDeleteAddress(response)}
                                          updateStatus={() => AddressUpdateStatus(response)}
                                      />
                                  );
                              })
                            : !loading && <SkeletonEmptyOrder isNotFound={!responseList.length} />}
                        {loading && SkeletonItem()}
                    </Grid>
                </Box>
            </Container>
            <AddAddressModal
                open={openModal.status}
                onClose={openModalClose}
                referenceData={openModal.data}
            />
        </>
    );
}

function SkeletonItem() {
    return (
        <>
            {[...Array(6)].map((_, index) => (
                <Grid item xs={12} md={4} key={index}>
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', margin: 'auto', height: 100 }}
                    />
                </Grid>
            ))}
        </>
    );
}
