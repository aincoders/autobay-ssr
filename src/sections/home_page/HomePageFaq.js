import { ExpandMore } from '@mui/icons-material';
import { AccordionDetails, Box, Card, Collapse, Skeleton, Typography } from '@mui/material';
import { t } from 'i18next';
import { useContext, useState } from 'react';
import { SPACING } from '../../config-global';
import useResponsive from '../../hooks/useResponsive';
import { HomePageContext } from '../../mycontext/HomePageContext';

export default function HomePageFaq() {
    const { loading, faqList, currentCity, currentVehicle } = useContext(HomePageContext);
    const isDesktop = useResponsive('up', 'lg');

    function replaceString(value = '') {
        const replaceMap = {
            $CITY_NAME: currentCity.city_name,
            $VEHICLE_MODEL_NAME: currentVehicle.model
                ? currentVehicle.model.vehicle_model_name
                : '',
        };
        return value.replace(/\$CITY_NAME|\$VEHICLE_MODEL_NAME/g, (matched) => replaceMap[matched]);
    }

    const [open, setOpen] = useState('');

    if (!loading && faqList.length == 0) {
        return null;
    }

    return (
        <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md }, }}>
            <Box display={'flex'} flexDirection="column" gap={3}>
                <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'left' }}>
                    <Typography variant={isDesktop ? 'h3' : 'h6'}>{t('frequently_asked_question')}</Typography>
                </Box>
                <Box display={'flex'} flexDirection="column" gap={isDesktop ? 2 : 1}>
                    {!loading ? (
                        faqList.map((faq, index) => (
                            <Card key={index} onClick={() => faq.faq_id != open ? setOpen(faq.faq_id) : setOpen(false)}>
                            <Box sx={{ px: 2, py: 1.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
                                <Typography variant={!isDesktop ? 'body2' : 'subtitle1'} fontWeight="medium">
                                    {replaceString(faq.question)}
                                </Typography>
                                <ExpandMore sx={{ color: 'primary.main', transform: open == faq.faq_id && 'rotate(180deg)', transition: '0.4s', }} />
                            </Box>
                            <Collapse in={open == faq.faq_id}>
                                <AccordionDetails sx={{ pt: 0 }}>
                                    <Typography variant={!isDesktop ? 'caption' : 'subtitle2'} fontWeight="400" color={'text.secondary'}>
                                        {replaceString(faq.answer)}
                                    </Typography>
                                </AccordionDetails>
                            </Collapse>
                        </Card>
                        ))
                    ) : (
                        <Skeleton variant="rectangular" sx={{ py: 3, borderRadius: 1 }} />
                    )}
                </Box>
            </Box>
        </Box>
    );
}
