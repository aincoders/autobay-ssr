export default function Backdrop(theme) {
    return {
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                invisible: {
                    background: 'transparent',
                },
            },
        },
    };
}
