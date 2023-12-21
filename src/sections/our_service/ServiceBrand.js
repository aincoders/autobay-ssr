import { Box, Card, CardActionArea, Grid, Skeleton, Typography } from '@mui/material';
import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { varHover, varTranHover } from 'src/components/animate';
import { useSettingsContext } from 'src/components/settings';
import ModelMasterModal from 'src/master/ModelMasterModal';
import { OurServiceContext } from 'src/mycontext/OurServiceContext';
import { NEXT_IMAGE_QUALITY } from 'src/utils/constant';
import { SPACING } from '../../config-global';
import useResponsive from '../../hooks/useResponsive';

export default function ServiceBrand() {
    const { currentCity, onChangeVehicle } = useSettingsContext();
    const { loading, serviceBrandList, categoryList } = useContext(OurServiceContext);
    const isDesktop = useResponsive('up', 'lg');


    const router = useRouter();

    const [modelModal, setModelModal] = useState({ status: false, data: '' });
    function modelModalClose(value) {
        if (value.data) {
            const model = value.data;
            const packageCategorySlug = categoryList.package_category_slug;

            if (packageCategorySlug) {
                var getUrl = `/${currentCity.slug}/${packageCategorySlug}/${model.vehicle_model_slug}`;
                router.push(`/[city]/[...category]?packageCategory=true`, getUrl);
            } else {
                var getUrl = `/${currentCity.slug}/${model.vehicle_model_slug}`;
                router.push(`/[city]/[...category]?vehicleSlug=true`, getUrl);
            }
        }
        setModelModal(false);
    }

    
    
    return (
        <>
            <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                <Box display={'flex'} flexDirection="column" gap={3}>
                    <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'left' }}>
                        <Typography variant={isDesktop ? 'h3' : 'h6'}>
                            {'We Look After All Brands'}
                        </Typography>
                    </Box>
                    <Grid container spacing={{ xs: 2, md: 4 }}>
                        {(loading ? Array.from(new Array(12)) : serviceBrandList).map(
                            (response, index) => {
                                const generatedPath = `/${currentCity.slug}/${response ? response.vehicle_make_slug : ''
                                    }`;
                                return (
                                    <Grid item xs={3} sm={4} md={1.71} key={index}>
                                        {response ? (
                                            <Box display={'flex'} flexDirection="column" gap={1} alignItems="center" component={m.div} whileHover="hover">
                                                <Link
                                                    onClick={()=>{
                                                        onChangeVehicle(response, ''); 
                                                    }}
                                                    href={{ pathname: generatedPath, query: { vehicleSlug: true } }}
                                                    as={`${generatedPath}`}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <Card component={CardActionArea} sx={{ p: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', }}>
                                                        <m.div variants={varHover(1.1)} transition={varTranHover()}>
                                                            <Image
                                                                quality={NEXT_IMAGE_QUALITY}
                                                                height={500}
                                                                width={500}
                                                                alt={response.make_image_alt}
                                                                src={response.vehicle_make_photo}
                                                                style={{ width: '70%', height: 'auto', margin: 'auto' }}
                                                            />
                                                        </m.div>
                                                    </Card>
                                                </Link>
                                            </Box>
                                        ) : (
                                            <Skeleton variant="rectangular" sx={{ height: { xs: 84, md: 132 }, width: { xs: 84, md: 132 }, margin: 'auto' }} />
                                        )}
                                    </Grid>
                                );
                            }
                        )}
                    </Grid>
                </Box>
            </Box>

            <ModelMasterModal
                open={modelModal.status}
                onClose={modelModalClose}
                referenceData={modelModal.data}
                NeedSelect
            />
        </>
    );
}
