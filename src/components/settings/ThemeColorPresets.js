import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { useMemo } from 'react';
import { alpha, ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { useSettingsContext } from './SettingsContext';
import ComponentsOverrides from 'src/theme/overrides';

ThemeColorPresets.propTypes = {
    children: PropTypes.node,
};

export default function ThemeColorPresets({ children }) {
    const outerTheme = useTheme();

    const { presetsColor } = useSettingsContext();

    const themeOptions = useMemo(
        () => ({
            palette: { primary: presetsColor },
            customShadows: { primary: `0 8px 16px 0 ${alpha(presetsColor.main, 0.24)}` },
        }),
        [presetsColor]
    );

    const theme = createTheme(merge(outerTheme, themeOptions));
    theme.components = ComponentsOverrides(theme);

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
