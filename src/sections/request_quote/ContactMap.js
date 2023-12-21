import { Box } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';

export default function ContactMap() {
    const { basicInfo } = useSettingsContext();
    const MAP_LINK =
        basicInfo.length > 0
            ? basicInfo.find((basic) => basic.setting_type == 'MAP_LINK').description
            : '';

    return (
        <Box>
            <iframe
                src={MAP_LINK}
                width="100%"
                height="530"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
            ></iframe>
        </Box>
    );
}
