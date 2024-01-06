import { DeleteRounded } from '@mui/icons-material';
import { Box, MenuItem, Typography } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from 'src/master';
export default function FleetDriverTableRow({ row, selected, onViewRow, onDeleteRow }) {
    const { vehicle_driver_id, name,phone_number, driver_status,created_on } = row;
    const { t } = useTranslation();
	const [confirmation, setConfirmation] = useState(false)
    async function confirmationClose(value) {
		if (value.confirmation) {
			await onDeleteRow()
		}
		setConfirmation(value.status)
	}

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell sx={{ cursor: "pointer" }} onClick={onViewRow} >
                    <Box display={'flex'} alignItems='center' gap={2}>
                        {/* {service_info?.service_master_photo && <Avatar alt={service_info?.service_name} src={service_info?.service_master_photo} />} */}
                        <Box alignItems='center' gap={1} >
                            <Typography variant='body1' color={'text.primary'}>{name}</Typography>
                        </Box>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box alignItems='center' gap={1}>
                        <Typography variant='body1' color={'text.primary'}>{phone_number}</Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box display={'flex'} alignItems='center' gap={1}>
                        <Typography variant='body1' color={driver_status == 1 ? 'success.main' : 'text.secondary'}  sx={{ display: 'flex', alignItems: 'center'}}>
                            {driver_status == "1" ? t('active') :t('inactive')}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell sx={{ cursor: "pointer" }} onClick={onViewRow} >
                    <Box display={'flex'} alignItems='center' gap={2}>
                        <Typography variant='body2' noWrap textTransform={'capitalize'} >{created_on}</Typography>
                    </Box>
                </TableCell>
                <TableCell align="right" sx={{ px: 1}}>
                    <Box display='flex' alignItems={'center'} gap={0.5} justifyContent='flex-end'>
                    <MenuItem onClick={() => { setConfirmation(true);  }}><DeleteRounded fontSize='small' /></MenuItem>
                    </Box>
                </TableCell>
            </TableRow>
           
            {confirmation &&
				<ConfirmDialog
					title={`${t('delete')}`}
					description={t('msg_remove_from_order').replace('%1$s', name).replace("%2$s", t('driver'))}
					open={confirmation}
					onClose={confirmationClose} />
			}
        </>
    );
}
FleetDriverTableRow.propTypes = {
    onDeleteRow: PropTypes.func,
    onViewRow: PropTypes.func,
    row: PropTypes.object,
    selected: PropTypes.bool,
};