import { Add, Clear, EditOutlined, Warehouse } from '@mui/icons-material';
import { Box, Card, CardActionArea, IconButton, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { APP_NAME } from 'src/config-global';
import useResponsive from 'src/hooks/useResponsive';
import { GarageMaster } from 'src/master';
import { setPreferWorkshop } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'src/redux/store';

export default function PreferWorkshop() {
    const { basicInfo } = useSettingsContext();

    const { checkout } = useSelector((state) => state.product);
    const { preferWorkshop } = checkout;
    const dispatch = useDispatch();

    const [garageModal, setGarageModal] = useState(false);
    async function garageModalClose(value) {
        if (value.data) {
            dispatch(setPreferWorkshop(value.data));
        }
        setGarageModal(value.status);
    }
    const isDesktop = useResponsive('up', 'lg');

    const SHOW_WORKSHOP =basicInfo.length > 0 && basicInfo.filter((basic) => basic.setting_type == 'CART_WORKSHOP_LIST_STATUS')


    if (SHOW_WORKSHOP.length > 0 && SHOW_WORKSHOP[0].show_status == '0') return null

    return (
        <>
            {preferWorkshop ? (
                <Card
                    sx={{ px: 2, py: 1 }}
                    component={CardActionArea}
                    onClick={() => setGarageModal(true)}
                >
                    <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                        <Box display={'flex'} alignItems="center" gap={2}>
                            <Warehouse color="primary" fontSize={isDesktop ? 'medium' : 'small'} />
                            <Box>
                                <Box>
                                    <Typography
                                        variant={isDesktop ? 'subtitle2' : 'body2'}
                                        fontWeight="medium"
                                    >
                                        {t('workshop')}
                                    </Typography>
                                    <Typography variant="caption" color={'text.secondary'}>
                                        {preferWorkshop.garage_name}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <IconButton>
                                <EditOutlined
                                    fontSize={isDesktop ? 'medium' : 'small'}
                                    sx={{ color: 'text.secondary' }}
                                />
                            </IconButton>

                            <IconButton
                                onClick={() => {
                                    dispatch(setPreferWorkshop(''));
                                }}
                            >
                                <Clear
                                    sx={{ color: 'text.secondary' }}
                                    fontSize={isDesktop ? 'medium' : 'small'}
                                />
                            </IconButton>
                        </Box>
                    </Box>
                </Card>
            ) : (
                <Card
                    sx={{ px: 2, py: 1 }}
                    component={CardActionArea}
                    onClick={() => setGarageModal(true)}
                >
                    <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                        <Box display={'flex'} alignItems="center" gap={2}>
                            <Warehouse color="primary" fontSize={isDesktop ? 'medium' : 'small'} />
                            <Box>
                                <Typography
                                    variant={isDesktop ? 'subtitle2' : 'body2'}
                                    fontWeight="medium"
                                >
                                    {t('workshop')}
                                </Typography>
                                <Typography variant="caption" color={'text.secondary'}>
                                    {t(
                                        'at_appname_choose_best_garage_for_my_vehicle_service'
                                    ).replace('%1$s', APP_NAME)}
                                </Typography>
                            </Box>
                        </Box>
                        <Add
                            sx={{ color: 'text.secondary' }}
                            fontSize={isDesktop ? 'medium' : 'small'}
                        />
                    </Box>
                </Card>
            )}

            <GarageMaster
                open={garageModal}
                onClose={garageModalClose}
                NeedSelect
                selectedGarage={preferWorkshop}
            />
        </>
    );
}
