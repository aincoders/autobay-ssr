import { Box, Container } from '@mui/material';
import { useContext } from 'react';
import { SPACING } from '../../config-global';
import useResponsive from '../../hooks/useResponsive';
import { PackageListContext } from '../../mycontext/PackageListContext';

export default function PackageWhyChooseUs() {
    const { loading, whyChoose, currentPackageCategoryInfo, currentCity, currentVehicle } = useContext(PackageListContext);

    const isDesktop = useResponsive('up', 'lg');

    function replaceString(value = '') {
        const replaceMap = {
            $CATEGORY_NAME: currentPackageCategoryInfo?.package_category_name || '',
            $CITY_NAME: currentCity?.city_name||"",
            $MODEL_NAME: currentVehicle?.model ? currentVehicle.model.vehicle_model_name : '',
            $MAKE_NAME: currentVehicle?.make ? currentVehicle.make.vehicle_make_name : '',
        };
        return value.replace(/\$CITY_NAME|\$CATEGORY_NAME|\$MAKE_NAME|\$MODEL_NAME/g, (matched) => replaceMap[matched]);
    }

    if (!loading && !whyChoose) {
        return null;
    }

    return (
        <Box sx={{ bgcolor: 'background.neutral', py: { xs: SPACING.xs, md: SPACING.md }, }}>
            <Container maxWidth="lg" >
                <Box display="flex" flexDirection="column" gap={3}>
                    {/* <Box display="flex" flexDirection="column" sx={{ textAlign: 'center', gap: 0.5 }}>
                        <Typography variant={isDesktop ? 'h4' : 'subtitle2'}>{
                            replaceString(`Why Choose ${APP_NAME} For $MAKE_NAME $MODEL_NAME  $CATEGORY_NAME In  $CITY_NAME`)
                        }</Typography>
                    </Box> */}
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Box dangerouslySetInnerHTML={{ __html: replaceString(whyChoose), }}></Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
