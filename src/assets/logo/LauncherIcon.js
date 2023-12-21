import { Box } from '@mui/material';
import AutobayLogo from './AutobayLogo';

export default function LauncherIcon({ ...other }) {
    return (<Box {...other} display="flex"><AutobayLogo /></Box>);
}
