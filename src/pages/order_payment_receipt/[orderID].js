/* eslint-disable import/no-unresolved */
import { Backdrop, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import useApi from 'src/hooks/useApi';
import { CUSTOMER_API } from 'src/utils/constant';



export default function OrderDetail() {
    const { query,push } = useRouter();
    const { downloadApiData } = useApi()

    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();


    useEffect(() => {
        async function ViewPaymentReceipt() {
            try {
                const params = { customer_order_id: query.orderID }
                const response = await downloadApiData(CUSTOMER_API.downloadOrderPaymentReceipt, params);
                const file = new Blob([response.data], { type: "application/pdf", });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                push('/')
            } catch (error) {
                push('/')
                enqueueSnackbar(error.msg, { variant: 'error' });
            }
        }
        if (query.orderID) {
            ViewPaymentReceipt()
        }

    }, [query.orderID])

    return (
        loading ? <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color="inherit" />
        </Backdrop> : ''

    );
}
