import { Done } from '@mui/icons-material';
import {
    Box,
    Stack,
    Step,
    StepConnector as MUIStepConnector,
    StepLabel,
    Stepper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Iconify from 'src/components/Iconify';

const StepConnector = styled(MUIStepConnector)(({ theme }) => ({
    top: 10,
    left: 'calc(-50% + 20px)',
    right: 'calc(50% + 20px)',
    '& .MuiStepConnector-line': {
        borderTopWidth: 2,
        borderColor: theme.palette.divider,
    },
    '&.Mui-active, &.Mui-completed': {
        '& .MuiStepConnector-line': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

CartStep.propTypes = {
    sx: PropTypes.object,
    activeStep: PropTypes.number,
};

const STEPS = ['Cart', 'Address', 'Date & Time', 'Order Place'];

export default function CartStep({ activeStep, sx, ...other }) {
    return (
        <Stepper
            alternativeLabel
            activeStep={activeStep}
            connector={<StepConnector />}
            sx={{ mb: 5, ...sx }}
            {...other}
        >
            {STEPS.map((label) => (
                <Step key={label}>
                    <StepLabel
                        StepIconComponent={StepIcon}
                        sx={{
                            '& .MuiStepLabel-label': {
                                typography: 'subtitle2',
                            },
                        }}
                    >
                        {label}
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}

// ----------------------------------------------------------------------

StepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
};

function StepIcon({ active, completed }) {
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                width: 24,
                height: 24,
                color: 'text.disabled',
                ...(active && {
                    color: 'primary.main',
                }),
            }}
        >
            {completed ? (
                <Done sx={{ color: 'primary.main' }} />
            ) : (
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'currentColor',
                    }}
                />
            )}
        </Stack>
    );
}
