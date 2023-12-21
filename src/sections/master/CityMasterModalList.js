import { LocationCity } from '@mui/icons-material';
import { Box, CardActionArea, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import BadgeStatus from 'src/components/badge-status';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';


CityMasterModalList.propTypes = {
    row: PropTypes.object.isRequired,
    onView: PropTypes.func,
};

export default function CityMasterModalList({ row, onView, }) {
    const { city_photo, city_image_alt, city_master_id, city_name,region_name } = row;
    const { currentCity } = useSettingsContext();
    return (
        <>
            <Grid item xs={4} md={1.5}>
                <Box display={'flex'} alignItems="center" flexDirection={'column'} onClick={() => onView()} component={CardActionArea} sx={{ borderRadius: 1, p: 1, gap: 1 }}>
                    <Box position={'relative'}>
                        {city_photo ? (
                            <Image src={city_photo} alt={city_image_alt} sx={{ width: 56, height: 56, borderRadius: 2, }} />
                        ) : (
                            <Box sx={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                                <LocationCity sx={{ color: 'text.secondary' }} />
                            </Box>
                        )}
                        {currentCity.city_master_id == city_master_id && (
                            <BadgeStatus status={'online'} sx={{ position: 'absolute', right: 2, bottom: 2 }} />
                        )}
                    </Box>

                    <Box display={'flex'} flexDirection="column" alignItems={'center'} textAlign="center">
                        <Typography variant="subtitle2" textAlign="center" sx={{ color: currentCity.city_master_id == city_master_id ? 'primary.main' : 'inherit' }}>{city_name}</Typography>
                        <Typography variant="caption" color={'text.secondary'}>{region_name}</Typography>
                    </Box>
                </Box>
            </Grid>
        </>
    );
}
