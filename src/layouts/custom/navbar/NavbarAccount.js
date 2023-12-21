import PropTypes from 'prop-types';
// @mui
import { Box, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/system';
// hooks
import useAuth from 'src/hooks/useAuth';
// components
import MyAvatar from 'src/components/MyAvatar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    backgroundColor: theme.palette.grey[500_12],
    transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.shorter,
    }),
}));

// ----------------------------------------------------------------------

NavbarAccount.propTypes = {
    isCollapse: PropTypes.bool,
};

export default function NavbarAccount({ isCollapse }) {
    const { customer } = useAuth();

    return (
        // <Link underline="none" color="inherit" component={RouterLink} to={}>
        <RootStyle
            sx={{
                ...(isCollapse && {
                    bgcolor: 'transparent',
                }),
            }}
        >
            <MyAvatar />

            <Box
                sx={{
                    overflow: 'auto',
                    ml: 2,
                    transition: (theme) =>
                        theme.transitions.create('width', {
                            duration: theme.transitions.duration.shorter,
                        }),
                    ...(isCollapse && {
                        ml: 0,
                        width: 0,
                    }),
                }}
            >
                <Typography variant="subtitle2" noWrap>
                    {customer?.employee_name}
                </Typography>
                <Tooltip title={customer?.employee_email}>
                    <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                        {customer?.employee_email}
                    </Typography>
                </Tooltip>
            </Box>
        </RootStyle>
        // </Link>
    );
}
