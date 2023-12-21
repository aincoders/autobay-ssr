import { Add } from '@mui/icons-material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {
    Box,
    Button,
    Card,
    CardActionArea,
    Checkbox,
    Dialog,
    Grid,
    IconButton,
    Slide,
    Typography,
} from '@mui/material/';
import { lighten, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { MEDIUM_MODAL } from 'src/utils/constant';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function RecommendedPartModal({ onClose, open, ItemList, ReferenceData }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [itemList, setItemList] = useState([]);
    const [selected, setSelected] = useState('');
    const [checkedItem, setCheckedItem] = useState(ItemList.min_spare_part_id);

    useMemo(() => {
        if (ItemList.spare_part_group) {
            setItemList(ItemList.spare_part_group);
            setSelected(
                ItemList.spare_part_group.find(
                    (item) => item.spare_part_id == ItemList.min_spare_part_id
                )
            );
        } else {
            setItemList(ItemList.spare_part_group_data);
            setSelected(
                ItemList.spare_part_group_data.find(
                    (item) => item.spare_part_id == ItemList.min_spare_part_id
                )
            );
        }
    }, [ItemList]);

    const [totalAmount, setTotalAmount] = useState(ReferenceData.price);

    function changePart(item) {
        setTotalAmount(totalAmount - Number(selected.price) + Number(item.price));
        setCheckedItem(item.spare_part_id);
        setSelected(item);
    }

    const { currentCity } = useSettingsContext();

    return (
        <Dialog
            TransitionComponent={Transition}
            fullWidth
            fullScreen={fullScreen}
            scroll={'body'}
            maxWidth={MEDIUM_MODAL}
            open={open}
            onClose={() => onClose({ status: false, data: '' })}
        >
            <Box display={'flex'} flexDirection={'column'}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        px: 2,
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.neutral',
                    }}
                >
                    <Box display={'flex'} flexDirection="column">
                        <Typography variant={'h6'}>{ReferenceData.service_group_name} </Typography>
                        <Typography variant={'body2'} fontWeight="500" color="text.secondary">
                            {ItemList.spare_part_group_name}{' '}
                        </Typography>
                    </Box>
                    <IconButton
                        aria-label="close modal"
                        onClick={() => onClose({ status: false, data: '' })}
                    >
                        <CloseOutlinedIcon />
                    </IconButton>
                </Box>

                <Box>
                    <Scrollbar
                        sx={{
                            height: {
                                xs: 'calc(100vh - 143px)',
                                md: 'calc(100vh - 322px)',
                            },
                            position: 'relative',
                        }}
                    >
                        <Grid container spacing={2} sx={{ p: 2 }}>
                            {itemList.map((item, index) => {
                                return (
                                    <Grid key={index} item xs={12} md={4}>
                                        <Card
                                            component={CardActionArea}
                                            onClick={() => changePart(item)}
                                            sx={{
                                                bgcolor: (theme) =>
                                                    checkedItem == item.spare_part_id &&
                                                    lighten(theme.palette.primary.main, 0.95),
                                            }}
                                        >
                                            <Box display={'flex'} flexDirection="column" gap={0.5}>
                                                <Box
                                                    display={'flex'}
                                                    flexDirection="column"
                                                    gap={0.5}
                                                    sx={{
                                                        minHeight: {
                                                            xs: 'auto',
                                                            md: 150,
                                                        },
                                                        p: 2,
                                                    }}
                                                >
                                                    <Typography variant={'subtitle1'}>
                                                        {item.spare_part_name}
                                                    </Typography>
                                                    <Typography
                                                        variant={'subtitle2'}
                                                        fontWeight="500"
                                                        color="primary"
                                                    >
                                                        {item.spare_part_code}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color={'text.secondary'}
                                                    >
                                                        {item.spare_part_description}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    display={'flex'}
                                                    alignItems="center"
                                                    justifyContent={'space-between'}
                                                    sx={{
                                                        borderTop: '1px solid',
                                                        borderColor: 'divider',
                                                        px: 2,
                                                        py: 1,
                                                    }}
                                                >
                                                    <Box
                                                        display={'flex'}
                                                        gap={1}
                                                        alignItems="baseline"
                                                    >
                                                        {item.main_price != item.price && (
                                                            <Typography
                                                                variant={'body2'}
                                                                color="text.secondary"
                                                                sx={{
                                                                    textDecoration: 'line-through',
                                                                }}
                                                            >{`${currentCity.currency_symbol} ${item.main_price}`}</Typography>
                                                        )}
                                                        <Typography
                                                            variant={'body1'}
                                                            fontWeight="bold"
                                                            color="primary"
                                                        >{`${currentCity.currency_symbol} ${item.price}`}</Typography>
                                                        {item.discount > 0 && (
                                                            <Typography
                                                                variant={'body2'}
                                                                fontWeight="bold"
                                                                color="success.main"
                                                            >{`${item.discount}% Off`}</Typography>
                                                        )}
                                                    </Box>
                                                    <Checkbox
                                                        disableRipple
                                                        checked={checkedItem == item.spare_part_id}
                                                    />
                                                </Box>
                                            </Box>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Scrollbar>
                    <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                            <Typography variant={'h6'} color={'primary'}>{`${
                                currentCity.currency_symbol
                            } ${Number(totalAmount).toFixed(
                                currentCity.decimal_value
                            )}`}</Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() =>
                                    onClose({
                                        status: false,
                                        data: { ...selected, totalAmount },
                                    })
                                }
                            >
                                {t('add')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
}
