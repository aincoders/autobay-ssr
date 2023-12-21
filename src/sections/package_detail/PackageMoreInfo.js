import { Box, Container } from '@mui/material';
import { useContext } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { PackageDetailContext } from 'src/mycontext/PackageDetailContext';
import { SPACING } from '../../config-global';

export default function PackageMoreInfo() {
    const { loading, packageDetails, } = useContext(PackageDetailContext);
    const { currentVehicle, currentCity } = useSettingsContext();

    function replaceString(value = '') {
        const replaceMap = {
            $CITY_NAME: currentCity.city_name,
            $MODEL_NAME: currentVehicle.model ? currentVehicle.model.vehicle_model_name : '',
            $MAKE_NAME: currentVehicle.make ? currentVehicle.make.vehicle_make_name : '',
        };
        return value.replace(/\$CITY_NAME|\$CATEGORY_NAME|\$MAKE_NAME|\$MODEL_NAME/g, (matched) => replaceMap[matched]);
    }

    if (!loading && !packageDetails.more_info) {
        return null;
    }

    return (
        <Box sx={{  py: { xs: SPACING.xs, md: SPACING.md }, }}>
                <Box display="flex" flexDirection="column" gap={3}>
                    {/* <Box display="flex" flexDirection="column" sx={{ textAlign: 'center', gap: 0.5 }}>
                        <Typography variant={isDesktop ? 'h4' : 'subtitle2'}>{
                            replaceString(`Why Choose ${APP_NAME} For $MAKE_NAME $MODEL_NAME  $CATEGORY_NAME In  $CITY_NAME`)
                        }</Typography>
                    </Box> */}
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Box dangerouslySetInnerHTML={{ __html: replaceString(packageDetails.more_info), }}></Box>
                    </Box>
                </Box>
        </Box>
    );
}
