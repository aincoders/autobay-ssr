/* eslint-disable eqeqeq */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable import/no-unresolved */
import { Box, Card, Typography } from '@mui/material';
import { t } from 'i18next';
import { useContext } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { MilesContext } from 'src/mycontext/MilesContext';
import Image from '../../components/image';
import {
    SkeletonEmptyOrder,
    SkeletonPackageItemDesk,
    SkeletonPackageItemMobile,
} from '../../components/skeleton';
import useResponsive from '../../hooks/useResponsive';

export default function MilesInclude() {
    const { loading, milesDetails } = useContext(MilesContext);
    const { package_section_data } = milesDetails;
    const isDesktop = useResponsive('up', 'lg');
    const { currentVehicle, currentCity } = useSettingsContext();

    function PackageSectionDesktopView() {
        return (
            <>
                {!loading && package_section_data.length > 0
                    ? package_section_data.map(
                        (packageItem, index) =>
                            packageItem.service_group_data.length > 0 && (
                                <Box key={index} display="flex" gap={3} flexDirection="column">
                                    <>
                                        {packageItem.service_group_data.length > 0 && (
                                            <Box display="flex" flexDirection="column" gap={1}>
                                                <Typography variant="h4" px={1}>
                                                    {packageItem.title}
                                                </Typography>
                                            </Box>
                                        )}

                                        {packageItem.service_group_data.length > 0 && (
                                            <Box
                                                display="grid"
                                                gap={2}
                                                gridTemplateColumns={{
                                                    xs: 'repeat(1, 1fr)',
                                                    sm: 'repeat(2, 1fr)',
                                                }}
                                            >
                                                {packageItem.service_group_data.map(
                                                    (service, _j) => (
                                                        <Card
                                                            variant="elevation"
                                                            key={_j}
                                                            sx={{ p: 2 }}
                                                        >
                                                            <Box
                                                                display="flex"
                                                                flexDirection="row"
                                                                gap={2}
                                                                alignItems="start"
                                                            >
                                                                <Image
                                                                    src={service.media_url}
                                                                    alt={service.media_url_alt}
                                                                    sx={{
                                                                        height: 100,
                                                                        width: 100,
                                                                        borderRadius: 1,
                                                                    }}
                                                                />
                                                                <Box
                                                                    display="flex"
                                                                    flexDirection="column"
                                                                    flex={1}
                                                                    justifyContent="space-between"
                                                                    gap={1}
                                                                >
                                                                    <Box
                                                                        display="flex"
                                                                        flexDirection="column"
                                                                        gap={3}
                                                                    >
                                                                        <Box>
                                                                            <Typography variant="h6">
                                                                                {
                                                                                    service.service_group_name
                                                                                }
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                    {currentVehicle.model && (
                                                                        <Box
                                                                            display="flex"
                                                                            flexDirection="column"
                                                                            gap={0.5}
                                                                        >
                                                                            {service.main_total !=
                                                                                service.price && (
                                                                                    <Box
                                                                                        display="flex"
                                                                                        sx={{
                                                                                            bgcolor:
                                                                                                'primary.main',
                                                                                            color: '#fff',
                                                                                            p: 0.5,
                                                                                            px: 1,
                                                                                            borderRadius: 1,
                                                                                            width: 'max-content',
                                                                                        }}
                                                                                    >
                                                                                        <Typography
                                                                                            variant="body2"
                                                                                            fontWeight={
                                                                                                'bold'
                                                                                            }
                                                                                            textTransform="uppercase"
                                                                                        >
                                                                                            {`${t(
                                                                                                'save'
                                                                                            ).toUpperCase()} ${currentCity.currency_symbol
                                                                                                } ${Number(
                                                                                                    service.main_total -
                                                                                                    service.price
                                                                                                ).toFixed(
                                                                                                    currentCity.decimal_value
                                                                                                )}`}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                )}
                                                                            <Box
                                                                                display="flex"
                                                                                alignItems="baseline"
                                                                                gap={1.5}
                                                                            >
                                                                                <Typography
                                                                                    variant="h6"
                                                                                    color="primary"
                                                                                >
                                                                                    {`${currentCity.currency_symbol
                                                                                        } ${Number(
                                                                                            service.price
                                                                                        ).toFixed(
                                                                                            currentCity.decimal_value
                                                                                        )}`}
                                                                                </Typography>

                                                                                <Typography
                                                                                    variant="body2"
                                                                                    fontWeight="bold"
                                                                                    sx={{
                                                                                        textDecoration:
                                                                                            'line-through',
                                                                                    }}
                                                                                    color="text.disabled"
                                                                                >
                                                                                    {`  ${currentCity.currency_symbol
                                                                                        }${Number(
                                                                                            service.main_total
                                                                                        ).toFixed(
                                                                                            currentCity.decimal_value
                                                                                        )}`}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        </Card>
                                                    )
                                                )}
                                            </Box>
                                        )}
                                    </>
                                </Box>
                            )
                    )
                    : !loading && <SkeletonEmptyOrder isNotFound={!package_section_data.length} />}

                {loading && <SkeletonPackageItemDesk />}
            </>
        );
    }

    function PackageSectionMobileView() {
        return (
            <>
                {!loading && package_section_data.length > 0
                    ? package_section_data.map(
                        (packageItem, index) =>
                            packageItem.service_group_data.length > 0 && (
                                <Box
                                    key={index}
                                    display="flex"
                                    gap={1.5}
                                    flexDirection="column"
                                    id={packageItem.package_section_id}
                                >
                                    <>
                                        {packageItem.service_group_data.length > 0 && (
                                            <Box display="flex" flexDirection="column" gap={1.5}>
                                                {/* {packageItem.media_url && (
                                                    <Image
                                                        alt={packageItem.media_url_alt}
                                                        src={packageItem.media_url}
                                                        sx={{
                                                            height: 180,
                                                        }}
                                                    />
                                                )} */}
                                                <Typography variant="h6" px={1.5}>
                                                    {packageItem.title}
                                                </Typography>
                                            </Box>
                                        )}
                                        {packageItem.service_group_data.length > 0 && (
                                            <Box
                                                display="flex"
                                                flexDirection="column"
                                                gap={1.5}
                                                px={1.5}
                                            >
                                                {packageItem.service_group_data.map(
                                                    (service, _j) => (
                                                        <Card
                                                            variant="elevation"
                                                            key={_j}
                                                            sx={{ p: 1.5 }}
                                                        >
                                                            <Box
                                                                display="flex"
                                                                flexDirection="row"
                                                                gap={2}
                                                                alignItems="stretch"
                                                            >
                                                                <Box>
                                                                    <Image
                                                                        src={service.media_url}
                                                                        alt={
                                                                            service.media_url_alt
                                                                        }
                                                                        sx={{
                                                                            height: 72,
                                                                            width: 72,
                                                                            borderRadius: 1,
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Box
                                                                    display="flex"
                                                                    flexDirection="column"
                                                                    flex={1}
                                                                    gap={0.8}
                                                                    justifyContent="space-between"
                                                                >
                                                                    <Box
                                                                        display="flex"
                                                                        flexDirection="column"
                                                                        gap={0.8}
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            fontWeight="bold"
                                                                        >
                                                                            {
                                                                                service.service_group_name
                                                                            }
                                                                        </Typography>
                                                                    </Box>
                                                                    {service.main_total !=
                                                                        service.price && (
                                                                            <Box
                                                                                display="flex"
                                                                                sx={{
                                                                                    bgcolor:
                                                                                        'primary.main',
                                                                                    color: '#fff',
                                                                                    p: 0.5,
                                                                                    px: 1,
                                                                                    borderRadius: 1,
                                                                                    width: 'max-content',
                                                                                }}
                                                                            >
                                                                                <Typography
                                                                                    variant="caption"
                                                                                    fontWeight={
                                                                                        'bold'
                                                                                    }
                                                                                    textTransform="uppercase"
                                                                                >
                                                                                    {`${t(
                                                                                        'save'
                                                                                    ).toUpperCase()} ${currentCity.currency_symbol
                                                                                        } ${Number(
                                                                                            service.main_total -
                                                                                            service.price
                                                                                        ).toFixed(
                                                                                            currentCity.decimal_value
                                                                                        )}`}
                                                                                </Typography>
                                                                            </Box>
                                                                        )}

                                                                    {currentVehicle.model && (
                                                                        <Box
                                                                            display="flex"
                                                                            alignItems="center"
                                                                            gap={1}
                                                                        >
                                                                            <Typography
                                                                                variant="body1"
                                                                                color="primary"
                                                                                fontWeight="bold"
                                                                            >
                                                                                {`${currentCity.currency_symbol
                                                                                    }${Number(
                                                                                        service.price
                                                                                    ).toFixed(
                                                                                        currentCity.decimal_value
                                                                                    )}`}
                                                                            </Typography>
                                                                            <Typography
                                                                                variant="caption"
                                                                                sx={{
                                                                                    textDecoration:
                                                                                        'line-through',
                                                                                }}
                                                                                color="text.secondary"
                                                                            >
                                                                                {`${currentCity.currency_symbol
                                                                                    }${Number(
                                                                                        service.main_total
                                                                                    ).toFixed(
                                                                                        currentCity.decimal_value
                                                                                    )}`}
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        </Card>
                                                    )
                                                )}
                                            </Box>
                                        )}
                                    </>
                                </Box>
                            )
                    )
                    : !loading && <SkeletonEmptyOrder isNotFound={!package_section_data.length} />}

                {loading && <SkeletonPackageItemMobile />}
            </>
        );
    }

    return (
        <Box display="flex" flexDirection="column" gap={2} mb={{ xs: 0, md: 8 }}>
            {isDesktop ? <PackageSectionDesktopView /> : <PackageSectionMobileView />}
        </Box>
    );
}
