import { CssBaseline } from '@mui/material';
import {
    createTheme,
    StyledEngineProvider,
    ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useSettingsContext } from '../components/settings';
import breakpoints from './breakpoints';
import GlobalStyles from './globalStyles';
import componentsOverride from './overrides';
import palette from './palette';
import shadows, { customShadows } from './shadows';
import typography from './typography';

ThemeProvider.propTypes = {
    children: PropTypes.node,
};

export default function ThemeProvider({ children }) {
    const { themeMode, themeDirection } = useSettingsContext();
    const isLight = themeMode === 'light';

    const themeOptions = useMemo(
        () => ({
            palette: isLight ? palette.light : palette.dark,
            typography,
            breakpoints,
            shape: { borderRadius: 4 },
            direction: themeDirection,
            shadows: isLight ? shadows.light : shadows.dark,
            customShadows: isLight ? customShadows.light : customShadows.dark,
        }),
        [isLight, themeDirection]
    );

    const theme = createTheme(themeOptions);

    theme.components = componentsOverride(theme);

    return (
        <StyledEngineProvider injectFirst>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles />
                {children}
            </MUIThemeProvider>
        </StyledEngineProvider>
    );
}
