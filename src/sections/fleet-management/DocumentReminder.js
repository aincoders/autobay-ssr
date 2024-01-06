import { Add, ArrowDropDown } from '@mui/icons-material';
import { Avatar, Box, Button, Container, Grid, Skeleton, Table, TableBody, TableContainer, TablePagination, Typography } from '@mui/material';
import { t } from 'i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { TableHeadCustom, TableNoData, TableSkeleton, useTable } from 'src/components/table';
import { APP_NAME, SPACING } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { AddDocumentReminderModal, DocumentModal, FleetVehicleModal, SellVehicleModal, VehicleSellConfirmationDialog } from 'src/master';
import { getCartItemOnline, resetCart } from 'src/redux/slices/product';
import { useDispatch } from 'src/redux/store';
import { API_PAGE_LIMIT, CUSTOMER_API } from 'src/utils/constant';
import VehicleInfo from './VehicleInfo';
import VehicleTabMenu from './VehicleTabMenu';
import DocumentReminderTableRow from './list/DocumentReminderTableRow';

export default function DocumentReminder() {
    const { getApiData, postApiData } = useApi();
    const { onChangeVehicle } = useSettingsContext();
    const router = useRouter()
    const isDesktop = useResponsive('up', 'md');
    const controller = new AbortController();
    const { signal } = controller;
    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const table = useTable();
    const [curentPage, setCurentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0)
    const [page, setPage] = useState(0);


    const customer_vehicle_id = router.query.vehicle
    async function GetList() {
        setLoading(true);
        const params = { customer_vehicle_id: customer_vehicle_id, start_page: curentPage, limit: API_PAGE_LIMIT }
        const response = await getApiData(CUSTOMER_API.fleet_management_document_reminder, params, signal);
        if (response) {
            const data = response.data.result;
            setLoading(false);
            setResponseList(data);
            setTotalPage(~~data.total)
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(~~newPage)
        setCurentPage(~~newPage * ~~API_PAGE_LIMIT)
    };



    useEffect(() => {
        if (customer_vehicle_id) {
            GetList();
        }
        return () => {
            controller.abort();
        };
    }, [router, curentPage]);

    const dispatch = useDispatch();


    const handleDelete = async (row) => {
        await DeleteItem(row.fleet_vehicle_document_id)
    };

    async function DeleteItem(fleet_vehicle_document_id) {
        try {
            const data = {
                fleet_vehicle_document_id: fleet_vehicle_document_id,
                customer_vehicle_id: customer_vehicle_id,
            };
            const response = await postApiData(CUSTOMER_API.fleet_management_document_reminder_delete, data);
            GetList()
        } catch (err) {
            console.log(err)
        }
    }



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

    const [makeModal, setMakeModal] = useState({ status: false, customer_vehicle_id: "" });
    function makeModalClose(value) {
        setMakeModal({ status: false, customer_vehicle_id: "" });
        
    }


    const [documentModal, setDocumentModal] = useState({ status: false, data: '' });
    function editDocumentModalClose(value) {
        // if (value.update) {
        //     GetList();
        // }
        setDocumentModal({ status: value.status, data: '' });
    }



    const [documentReminderModal, setDocumentReminderModal] = useState({ status: false, data: '' });
    function editDocumentReminderModalClose(value) {
        if (value.update) {
            GetList();
        }
        setDocumentReminderModal({ status: value.status, data: '' });
    }

    const [sellconfirmation, setSellConfirmation] = useState({ status: false, data: '' });
    async function sellconfirmationClose(value) {
        setSellConfirmation(value.status);

    }

    const [sellVehicleModal, setSellVehicleModal] = useState({ status: false, data: '' });
    async function sellVehicleModalClose(value) {
        setSellVehicleModal({ status: value.status, data: '' });
        if (value.update) {
            GetList();
            setSellConfirmation({ status: true, data: value.data })
        }

    }

    const TABLE_HEAD = [
        { id: 'document_type', label: t('document_type'), isSorting: false },
        { id: 'document', label: t('document'), isSorting: false },
        { id: 'date', label: t('created_date'), isSorting: false },
        { id: 'expiry_date_', label: t('expiry_date_'), isSorting: false },
        { id: 'reminder_date', label: t('reminder_date'), isSorting: false },
        { id: 'status', label: t('status'), isSorting: false },
        { id: '', width: 88 },
    ];


    return (
        <>
            <Head>
                <title> {`${t('my_vehicle')} | ${APP_NAME}`}</title>
                <meta property="description" content={`${t('my_vehicle')} | ${APP_NAME}`} />
                <meta property="og:title" content={`${t('my_vehicle')} | ${APP_NAME}`} />
                <meta property="og:description" content={`${t('my_vehicle')} | ${APP_NAME}`} />
            </Head>

            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md, } }}>
                    <Grid container rowSpacing={3}>
                        <Grid item xs={12}>
                            {responseList?.vehicle_info && !loading ?
                                <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                                    {isDesktop && <VehicleInfo responseList={responseList?.vehicle_info} />}
                                    <Box display={'flex'} gap={2}>

                                        <Button color="inherit" onClick={() => setMakeModal({ status: true, customer_vehicle_id: router.query.vehicle })} variant="outlined" endIcon={<ArrowDropDown />}>
                                            <Box display={'flex'} gap={1} alignItems="center">
                                                {responseList?.vehicle_info?.vehicle_model_photo && <Avatar src={responseList?.vehicle_info?.vehicle_model_photo} sx={{ width: 30, height: 30 }} alt={responseList?.vehicle_info?.vehicle_make_name} />}
                                                <Box display={'flex'} flexDirection="column" alignItems={'flex-start'}>
                                                    <Box display={'flex'} gap={1} alignItems="center">
                                                        <Typography variant="body2" fontWeight={'medium'}>
                                                            {responseList?.vehicle_info?.vehicle_model_name ? responseList?.vehicle_info?.vehicle_model_name : responseList?.vehicle_info?.vehicle_make_name}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" color={'text.secondary'}>
                                                        {responseList?.vehicle_info?.vehicle_reg_no ? responseList?.vehicle_info?.vehicle_reg_no: '---'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Button>
                                        {responseList?.vehicle_info?.request_to_sell_vehicle == "0" &&
                                            <Button variant='contained' sx={{ textTransform: 'none' }}
                                                onClick={() => { setSellVehicleModal({ status: true, data: responseList?.vehicle_info, customer_vehicle_id: router.query.vehicle }) }} >
                                                {t('request_to_sell_vehicle')}
                                            </Button>}
                                    </Box>
                                </Box>
                                : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />
                            }
                        </Grid>


                        <Grid item xs={12} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, py: 1, }}>

                            {isDesktop && <VehicleTabMenu current={'document_reminder'} responseList={responseList} />}
                            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                                <Box p={1.5} px={3} display="flex" alignItems={'center'} justifyContent="space-between" gap={2}>
                                    <Typography variant="h6" sx={{ width: 200 }}>{t('document_reminder')}</Typography>
                                    <Box display={'flex'} alignItems='center' gap={1} flex={1} justifyContent='flex-end'>
                                        <Button variant="soft" startIcon={<Add />} onClick={() => setDocumentReminderModal({ status: true, data: "", customer_vehicle_id: router.query.vehicle })}>
                                            {t('add_document_reminder')}
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ borderRadius: 0, bgcolor: 'background.paper', height: 'calc(100vh - 192px)' }}>
                                <Scrollbar>
                                    <TableContainer sx={{ position: 'relative', overflow: 'unset', width: "100%" }}>
                                        <Table stickyHeader >
                                            <TableHeadCustom
                                                order={table.order}
                                                orderBy={table.orderBy}
                                                headLabel={TABLE_HEAD}
                                                rowCount={responseList?.list?.length}
                                                numSelected={table.selected.length}
                                                onSort={table.onSort}
                                            // onRequestSort={handleRequestSort}
                                            />
                                            <TableBody>
                                                {loading ?
                                                    [...Array(10)].map((_, index) => <TableSkeleton key={index} />)
                                                    :
                                                    responseList?.list?.length > 0
                                                        ?
                                                        responseList?.list?.map((row, i) => (

                                                            <DocumentReminderTableRow
                                                                key={i}
                                                                row={row}
                                                                onViewRow={() => console.log("")}
                                                                onEditRow={() => setDocumentReminderModal({ status: true, customer_vehicle_id: router.query.vehicle, data: row })}
                                                                onUpdateStatus={() => console.log(row)}
                                                                onDeleteRow={() => handleDelete(row)}
                                                                onDocumentView={() => setDocumentModal({ status: true, customer_vehicle_id: router.query.vehicle, data: row })}
                                                            />
                                                        ))
                                                        : <TableNoData notFound={!responseList?.list?.length} />
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Scrollbar>


                            </Box>


                            <TablePagination
                                rowsPerPageOptions={[~~API_PAGE_LIMIT]}
                                component="div"
                                count={totalPage}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={~~API_PAGE_LIMIT}
                                showFirstButton
                                showLastButton
                            />
                        </Grid>
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
            {documentReminderModal.status && <AddDocumentReminderModal
                open={documentReminderModal.status}
                referenceData={documentReminderModal.data}
                customer_vehicle_id={documentReminderModal.customer_vehicle_id}
                onClose={editDocumentReminderModalClose}
            />
            }

              {documentModal.status && <DocumentModal
                open={documentModal.status}
                referenceData={documentModal.data}
                customer_vehicle_id={documentModal.customer_vehicle_id}
                onClose={editDocumentModalClose}
            />
            }
            {sellVehicleModal.status && <SellVehicleModal
                open={sellVehicleModal.status}
                referenceData={sellVehicleModal.data}
                customer_vehicle_id={sellVehicleModal.customer_vehicle_id}
                onClose={sellVehicleModalClose}
            />
            }
            {sellconfirmation.data && <VehicleSellConfirmationDialog
                description={sellconfirmation.data}
                open={sellconfirmation.status}
                onClose={sellconfirmationClose}
            />}
            <FleetVehicleModal open={makeModal.status} onClose={makeModalClose} referenceData={makeModal.customer_vehicle_id} />
        </>
    );
}
