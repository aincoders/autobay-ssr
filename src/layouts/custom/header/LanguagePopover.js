import { ArrowDropDown, Translate } from '@mui/icons-material';
import { Button, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import Image from 'src/components/image';
import MenuPopover from 'src/components/menu-popover/';
import useLocales from 'src/locales/useLocales';



export default function LanguagePopover() {
  const { allLangs, currentLang, onChangeLang } = useLocales();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>

      <Button onClick={handleOpen} startIcon={<Translate />} endIcon={<ArrowDropDown />} variant='text' >
        {currentLang.label}
      </Button>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <Stack spacing={0.75}>
          {allLangs.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang.value}
              onClick={() => {
                onChangeLang(option.value);
                handleClose();
              }}
            >
              {option.icon &&
                <Image disabledEffect alt={option.label} src={option.icon} sx={{ width: 24,height:17, mr: 2 }} />}

              {option.label}
            </MenuItem>
          ))}
        </Stack>
      </MenuPopover>
    </>
  );
}
