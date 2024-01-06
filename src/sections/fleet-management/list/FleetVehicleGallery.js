import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import { alpha, useTheme } from '@mui/material/styles';
import Image from 'src/components/image';
import { IconButton } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from 'src/master';


export default function FleetVehicleGallery({ row, onDeleteRow }) {
    const { fleet_vehicle_photo_id, media_url, created_on } = row;
    const theme = useTheme();
    const [confirmation, setConfirmation] = useState(false)
    const { t } = useTranslation();

    async function confirmationClose(value) {
        if (value.confirmation) {
            await onDeleteRow()
        }
        setConfirmation(value.status)
    }

    return (
        <>
            <Card key={fleet_vehicle_photo_id} sx={{ cursor: 'pointer', color: 'common.white', borderRadius: 4 }}>
                <IconButton
                    color="inherit"
                    sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        zIndex: 9,
                        borderRadius: '50%', // Add rounded border to the delete icon
                        backgroundColor: 'text.primary', // Set background color for the delete icon
                        '&:hover': {
                            backgroundColor: 'primary.main', // Change background color on hover if needed
                        },
                    }}
                    onClick={() => { setConfirmation(true); }}
                >

                    <DeleteOutline fontSize='small' />
                </IconButton>
                <Image
                    alt="gallery"
                    ratio="1/1"
                    src={media_url}
                    overlay={`linear-gradient(to bottom, ${alpha(theme.palette.grey[900], 0)} 0%, ${theme.palette.grey[900]
                        } 75%)`}
                />
            </Card>

            {confirmation &&
                <ConfirmDialog
                    title={`${t('delete')}`}
                    description={t('msg_remove_from_media').replace("%2$s", t('fleet_vehicle_media'))}
                    open={confirmation}
                    onClose={confirmationClose} />
            }
        </>
    );
}

FleetVehicleGallery.propTypes = {
    onDeleteRow: PropTypes.func,
    row: PropTypes.object,
};
