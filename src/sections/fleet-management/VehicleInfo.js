import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import Image from 'src/components/image';
import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';

export default function VehicleInfo({ responseList }) {
    const { currentCity } = useSettingsContext();

    return (
        <>
            <Box display={'flex'} flexDirection="column" gap={3}>
                <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>

                    <Box display={'flex'} alignItems="center" gap={2}>
                        {responseList?.vehicle_model_photo && (
                            <Image src={responseList?.vehicle_model_photo} alt={responseList?.vehicle_name} sx={{ width: 100, height: 100, borderRadius: 1 }} />
                        )}

                        <Box>
                            {responseList?.request_to_sell_vehicle == "1" && <Label
                                variant="soft"
                                color={'error'}>
                              {`${t('on_sell')} (${currentCity?.currency_symbol} ${responseList?.sell_price}  ${responseList?.sell_price_type==1 ? t('non_negotiable'):t('negotiable')})`}
                            </Label>
                            }
                            <Typography variant="h6">{responseList?.vehicle_name}</Typography>
                            <Typography  variant="body2" color={'text.secondary'}>{`Car ${responseList?.vehicle_make_name} ${responseList?.vehicle_model_name}`}</Typography>
                        </Box>

                    </Box>
                </Box>

            </Box>
        </>
    );
}
