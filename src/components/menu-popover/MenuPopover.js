import PropTypes from 'prop-types';
// @mui
import { Popover } from '@mui/material';
//
import getPosition from './getPosition';
import { StyledArrow } from './styles';

// ----------------------------------------------------------------------

MenuPopover.propTypes = {
    sx: PropTypes.object,
    children: PropTypes.node,
    disabledArrow: PropTypes.bool,
    arrow: PropTypes.oneOf([
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
        'left-top',
        'left-center',
        'left-bottom',
        'right-top',
        'right-center',
        'right-bottom',
    ]),
};

export default function MenuPopover({
    open,
    children,
    arrow = 'top-right',
    disabledArrow,
    sx,
    ...other
}) {
    const { style, anchorOrigin, transformOrigin } = getPosition(arrow);

    return (
        <Popover
            open={Boolean(open)}
            anchorEl={open}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            PaperProps={{
                sx: {
                    p: 1,
                    width: 200,
                    overflow: 'inherit',
                    ...sx,
                },
            }}
            {...other}
        >
            {!disabledArrow && <StyledArrow arrow={arrow} />}

            {children}
        </Popover>
    );
}
