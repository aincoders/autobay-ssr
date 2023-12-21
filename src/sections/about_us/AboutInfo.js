import { Box, Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import useResponsive from 'src/hooks/useResponsive';

export default function AboutInfo() {
    const { basicInfo, currentCity } = useSettingsContext();

    const [data, setData] = useState('');

    useEffect(() => {
        basicInfo.length > 0 &&
            setData(basicInfo.find((basic) => basic.setting_type == 'ABOUT_US'));
    }, [basicInfo]);
    const isDesktop = useResponsive('up', 'lg');

    return (
        <>
            <Grid container spacing={2.5} rowSpacing={3}>
                <Container maxWidth={'lg'} disableGutters={isDesktop}>
                    <Grid item xs={12}>
                        <Box dangerouslySetInnerHTML={{ __html: data.description }}></Box>
                    </Grid>
                </Container>
                {data.media_url && (
                    <Grid item xs={12}>
                        <Image src={data.media_url} alt={data.media_url_alt} />
                    </Grid>
                )}
            </Grid>
        </>
    );
}
