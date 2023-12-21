import { IconButton } from '@mui/material';
import Iconify from '../iconify';
import MenuPopover from '../menu-popover';

export default function TableMoreMenu({ actions, open, onClose, onOpen }) {
    return (
        <>
            <IconButton onClick={onOpen}>
                <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
            </IconButton>

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={onClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                arrow="right-top"
                sx={{
                    mt: -1,
                    width: 210,
                    '& .MuiMenuItem-root': {
                        px: 1,
                        typography: 'body2',
                        borderRadius: 0.75,
                        '& svg': { mr: 1, width: 20, height: 20 },
                    },
                }}
            >
                {actions}
            </MenuPopover>
        </>
    );
}
