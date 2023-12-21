import { Box, Typography } from '@mui/material';
import { useContext } from 'react';
import Image from 'src/components/image';
import { VEHICLE_TYPE_ICON } from 'src/config-global';
import { EstimateContext } from 'src/mycontext/EstimateContext';

export default function VehicleInfo() {
    const { loading, estimateDetails } = useContext(EstimateContext);
    const {
        vehicle_model_photo,
        vehicle_model_name,
        vehicle_reg_no,
        additional_notes,
        vehicle_make_name,
    } = estimateDetails;

    return (
        <>
            <Box
                display={'flex'}
                alignItems={'center'}
                gap={1}
                justifyContent={'space-between'}
                px={2}
            >
                <Box
                    display={'flex'}
                    flex={1}
                    justifyContent="space-between"
                    variant="elevation"
                    sx={{ height: '100%' }}
                >
                    <Box display={'flex'} gap={2} alignItems={'center'} justifyContent="start">
                        {vehicle_model_photo ? (
                            <Image
                                src={vehicle_model_photo}
                                alt={vehicle_model_name}
                                sx={{ width: 56, height: 56 }}
                            />
                        ) : (
                            <Box
                                display={'flex'}
                                alignItems="center"
                                justifyContent="center"
                                sx={{ width: 56, height: 56 }}
                            >
                                <Box
                                    component={VEHICLE_TYPE_ICON}
                                    sx={{ color: 'text.secondary' }}
                                />
                            </Box>
                        )}
                        <Box display={'flex'} flexDirection="column" alignItems={'start'}>
                            <Typography variant="body2" color={'text.secondary'}>
                                {vehicle_reg_no}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                fontWeight={'bold'}
                            >{`${vehicle_make_name} - ${vehicle_model_name}`}</Typography>
                            <Typography variant="caption" color={'text.secondary'}>
                                {additional_notes}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
