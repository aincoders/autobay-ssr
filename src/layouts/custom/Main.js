import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useSettingsContext } from '../../components/settings';
import { HEADER } from '../../config-global';
import useResponsive from '../../hooks/useResponsive';

Main.propTypes = {
    sx: PropTypes.object,
    children: PropTypes.node,
};

export default function Main({ children, sx, ...other }) {
    const { themeLayout } = useSettingsContext();

    const isNavMini = themeLayout === 'mini';
    const isDesktop = useResponsive('up', 'lg');

    return (
        <Box
            className='app_root'
            component="main"
            sx={{
                flexGrow: 1,
                pt: `${HEADER.H_MOBILE * 2}px`,
                ...(isDesktop && { pt: `125px` }),
                ...sx,
            }}
            {...other}
        >
            {children}
        </Box>
    );
}
