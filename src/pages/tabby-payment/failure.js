import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import LoadingScreen from 'src/components/loading-screen';


export default function Success() {
    const { enqueueSnackbar } = useSnackbar()
    const router = useRouter()


    useEffect(() => {
        if(router.isReady && router.query!=''){
            enqueueSnackbar(t('fail_tabby_msg'), { variant: 'error', autoHideDuration: 15000 })
            router.push(`/cart`);
        }
    }, [router.isReady])


    return (
        <>
            <LoadingScreen/>
        </>
    );
}
