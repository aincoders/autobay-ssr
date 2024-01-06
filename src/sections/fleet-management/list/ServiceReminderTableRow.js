import { CircleOutlined, CircleRounded, DeleteRounded, EditRounded } from '@mui/icons-material';
import { Avatar, Box, MenuItem, Typography } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from 'src/master';
export default function ServiceReminderTableRow({ row, selected, onViewRow, onEditRow, onUpdateStatus,onDeleteRow }) {
    const { service_info, time_interval_info, status, due_on_info, created_on, expiry_date, service_group_info,next_service_mileage,current_mileage} = row;
    const { t } = useTranslation();
    // const popover = usePopover();
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
                        {service_info?.service_master_photo && <Avatar alt={service_info?.service_name} src={service_info?.service_master_photo} />}
                        <Box alignItems='center' gap={1} >
                            <Typography variant='body1' color={'text.primary'}>{service_info?.service_name}</Typography>
                            <Typography variant='body2' color='text.secondary'>{time_interval_info}</Typography>
                           {current_mileage && current_mileage!="0" && <Typography variant="body2" color={'text.secondary'}>{`${t('current_mileage')} : ${current_mileage}`}</Typography>} 

                        </Box>
                    </Box>
                </TableCell>

                <TableCell>
                    <Box alignItems='center' gap={1}>
                        <Typography variant='body1' color={'text.primary'}>{service_group_info?.service_group_name || "---"}</Typography>
                    </Box>
                </TableCell>
                <TableCell sx={{ cursor: "pointer" }} onClick={onViewRow} >
                    <Box display={'flex'} alignItems='center' gap={2}>
                        <Typography variant='body2' noWrap textTransform={'capitalize'} >{created_on}</Typography>
                    </Box>
                </TableCell>

                <TableCell>
                    <Box alignItems='center' gap={1}>
                    <Typography variant='body1' color={'primary'}>{expiry_date}</Typography>
                      {next_service_mileage && next_service_mileage!="0" && <Typography variant="body2" color={'text.secondary'}>{`${t('next_service_mileage')} : ${next_service_mileage}`}</Typography>}

                        {/* <Typography variant='body1' color={'text.primary'}>{due_on_info}</Typography>
                        <Typography variant='body2' color={'primary'} sx={{ fontWeight: 'medium' }}> {`${t('due_on')} ${expiry_date}`}</Typography> */}
                    </Box>
                </TableCell>

                <TableCell>
                    <Box display={'flex'} alignItems='center' gap={1}>
                        <Typography variant='body1' color={status == 1 ? 'success.main' : 'error.main'}  sx={{ display: 'flex', alignItems: 'center'}}>
                            {/* {status == 1 && <CircleRounded sx={{ fontSize: 'small', marginRight: 0.5 }} />} */}
                            {status == 1 ? t('upcoming') : t('over_due')}
                        </Typography>
                    </Box>
                </TableCell>

             
                <TableCell align="right" sx={{ px: 1}}>
                    <Box display='flex' alignItems={'center'} gap={0.5} justifyContent='flex-end'>
                    <MenuItem onClick={() => { onEditRow(); }}><EditRounded fontSize='small' /></MenuItem>
                    <MenuItem onClick={() => { setConfirmation(true);  }}><DeleteRounded fontSize='small' /></MenuItem>
                    </Box>
                </TableCell>
            </TableRow>
           
            {confirmation &&
				<ConfirmDialog
					title={`${t('delete')}`}
					description={t('msg_remove_from_order').replace('%1$s', service_info?.service_name).replace("%2$s", t('service_reminder'))}
					open={confirmation}
					onClose={confirmationClose} />
			}
        </>
    );
}
ServiceReminderTableRow.propTypes = {
    onDeleteRow: PropTypes.func,
    onViewRow: PropTypes.func,
    row: PropTypes.object,
    selected: PropTypes.bool,
};