// theme
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export const colorPresets = [
    // DEFAULT
    {
        name: 'default',
        ...palette.light.primary,
    },
    // YELLOW
    {
        name: 'yellow',
        lighter: '#FDE180',
        light: '#FCD461',
        main: '#FBC02D',
        dark: '#D79E20',
        darker: '#B47E16',
        contrastText: '#000',
    },
    // GREEN
    {
        name: 'green',
        lighter: '#97DD8C',
        light: '#69BB66',
        main: '#388E3C',
        dark: '#287A33',
        darker: '#1C662C',
        contrastText: '#fff',
    },
    // RED
    {
        name: 'red',
        lighter: '#F19481',
        light: '#E46A5F',
        main: '#D32F2F',
        dark: '#B5222F',
        darker: '#97172D',
        contrastText: '#fff',
    },
    // PURPLE
    {
        name: 'purple',
        lighter: '#F77477',
        light: '#F05164',
        main: '#E61B47',
        dark: '#C5134B',
        darker: '#A50D4B',
        contrastText: '#fff',
    },
];

export const defaultPreset = colorPresets[0];
export const yellowPreset = colorPresets[1];
export const greenPreset = colorPresets[2];
export const redPreset = colorPresets[3];
export const purplePreset = colorPresets[4];

export const presetsOption = colorPresets.map((color) => ({
    name: color.name,
    value: color.main,
}));

export default function getColorPresets(presetsKey) {
    return {
        default: defaultPreset,
        yellow: yellowPreset,
        green: greenPreset,
        red: redPreset,
        purple: purplePreset,
    }[presetsKey];
}
