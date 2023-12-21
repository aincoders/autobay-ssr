import { useState } from 'react';
// @mui
import { Button, MenuItem, Stack } from '@mui/material';
// components
import { ArrowDropDown } from '@mui/icons-material';
import Image from '../../../components/image';
import MenuPopover from '../../../components/menu-popover';
import useSettingsContext from '../../../components/settings';

export default function CountryPopover() {
    const { countryList, currentCountry, onChangeCountry } = useSettingsContext();

    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                sx={{ ...(open && { bgcolor: 'action.selected' }) }}
                endIcon={<ArrowDropDown />}
                // startIcon={<Avatar src={currentCountry.media_url} sx={{ width: 35, height: 35 }} />}
                variant="outlined"
            >
                {currentCountry.country_name}
            </Button>

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{
                    mt: 1.5,
                    ml: 0.75,
                    width: 180,
                    '& .MuiMenuItem-root': {
                        px: 1,
                        typography: 'body2',
                        borderRadius: 0.75,
                    },
                }}
            >
                <Stack spacing={0.75}>
                    {countryList.length > 0 &&
                        countryList.map((option, i) => (
                            <MenuItem
                                key={i}
                                selected={
                                    option.country_master_id === currentCountry.country_master_id
                                }
                                onClick={() => {
                                    onChangeCountry(option);
                                    handleClose();
                                }}
                            >
                                {option.media_url && (
                                    <Image
                                        disabledEffect
                                        alt={option.media_url_alt}
                                        src={option.media_url}
                                        sx={{ width: 28, mr: 2 }}
                                    />
                                )}

                                {option.country_name}
                            </MenuItem>
                        ))}
                </Stack>
            </MenuPopover>
        </>
    );
}
