import { Box, CardActionArea, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import BadgeStatus from 'src/components/badge-status';
import { useSettingsContext } from 'src/components/settings';
import { VEHICLE_TYPE_ICON } from 'src/config-global';
import Image from 'src/components/image';


MakeMasterModalList.propTypes = {
    row: PropTypes.object.isRequired,
    onView: PropTypes.func,
};

export default function MakeMasterModalList({ row, onView, }) {
    const { vehicle_make_photo, make_image_alt, vehicle_make_master_id, vehicle_make_name } = row;
    const { currentVehicle } = useSettingsContext();
    return (
        <>
            <Grid item xs={4} md={4}>
                <Box display={'flex'} alignItems="center" flexDirection={'column'} onClick={() => onView()} component={CardActionArea} sx={{ borderRadius: 1, p: 1, gap: 1 }}>
                    <Box sx={{ position: 'relative' }}>
                        {vehicle_make_photo
                            ? <Image src={vehicle_make_photo} alt={make_image_alt}  sx={{ width: 56, height: 56, borderRadius: 2, }} />
                            :
                            <Box sx={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                                <Box component={VEHICLE_TYPE_ICON} sx={{ color: 'text.secondary' }} />
                            </Box>
                        }

                        {currentVehicle.make.vehicle_make_master_id == vehicle_make_master_id && (
                            <BadgeStatus status={'online'} sx={{ position: 'absolute', right: 2, bottom: 2 }} />
                        )}
                    </Box>
                    <Box display={'flex'} flexDirection="column" alignItems={'center'}>
                        <Typography variant="body2" fontWeight={'medium'} textAlign="center" noWrap sx={{ color: currentVehicle.make.vehicle_make_master_id == vehicle_make_master_id ? 'primary.main' : 'inherit' }}>
                            {vehicle_make_name}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </>
    );
}
