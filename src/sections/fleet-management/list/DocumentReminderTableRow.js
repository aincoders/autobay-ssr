import { DeleteRounded, EditRounded } from '@mui/icons-material';
import { Box, Button, MenuItem, Typography } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from 'src/master';

export default function DocumentReminderTableRow({ row, selected, onViewRow, onEditRow, onDocumentView,onUpdateStatus, onDeleteRow }) {
    const { fleet_vehicle_document_id, document_type_info, document, document_name, expiry_date, created_on, reminder_date, status } = row;
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
                        <Box alignItems='center' gap={1} >
                            <Typography variant='body1' color={'text.primary'}>{document_type_info?.document_type}</Typography>
                        </Box>
                    </Box>
                </TableCell>

                <TableCell>
                    <Box alignItems='center' gap={1}>
                        {/* <Link
                            key={fleet_vehicle_document_id}
                            component={NextLink}
                            href={document}
                            noWrap
                            underline="none"
                            target="_blank"  // Add this line to open the link in a new tab
                            sx={{
                                typography: 'body2',
                                color: 'text.primary',
                                fontSize: 13,
                                transition: (theme) =>
                                    theme.transitions.create('all'),
                                '&:hover': {
                                    color: 'primary.main',
                                },
                            }}
                        >
                            <Typography variant='body1' color={'primary'}>{document_name}</Typography>


                        </Link> */}
                        <Button variant="soft" onClick={onDocumentView}>
                            {t('view_document')}
                        </Button>

                    </Box>
                </TableCell>
                <TableCell sx={{ cursor: "pointer" }}  >
                    <Box display={'flex'} alignItems='center' gap={2}>
                        <Typography variant='body2' noWrap textTransform={'capitalize'} >{created_on}</Typography>
                    </Box>
                </TableCell>

                <TableCell sx={{ cursor: "pointer" }}  >
                    <Box display={'flex'} alignItems='center' gap={2}>
                        <Typography variant='body2' color={'primary'} noWrap textTransform={'capitalize'} >{expiry_date}</Typography>
                    </Box>
                </TableCell>
                <TableCell sx={{ cursor: "pointer" }}  >
                    <Box display={'flex'} alignItems='center' gap={2}>
                        <Typography variant='body2' noWrap textTransform={'capitalize'} >{reminder_date}</Typography>
                    </Box>
                </TableCell>

                <TableCell>
                    <Box display={'flex'} alignItems='center' gap={1}>
                        <Typography variant='body1' color={status == 1 ? 'success.main' : 'error.main'} sx={{ display: 'flex', alignItems: 'center' }}>
                            {/* {status == 1 && <CircleRounded sx={{ fontSize: 'small', marginRight: 0.5 }} />} */}
                            {status == 1 ? t('upcoming') : t('over_due')}
                        </Typography>
                    </Box>
                </TableCell>


                <TableCell align="right" sx={{ px: 1 }}>
                    <Box display='flex' alignItems={'center'} gap={0.5} justifyContent='flex-end'>
                        <MenuItem onClick={() => { onEditRow(); }}><EditRounded fontSize='small' /></MenuItem>
                        <MenuItem onClick={() => { setConfirmation(true); }}><DeleteRounded fontSize='small' /></MenuItem>
                    </Box>
                </TableCell>
            </TableRow>

            {confirmation &&
                <ConfirmDialog
                    title={`${t('delete')}`}
                    description={t('msg_remove_from_order').replace('%1$s', document_name).replace("%2$s", t('document_reminder'))}
                    open={confirmation}
                    onClose={confirmationClose} />
            }
        </>
    );
}
DocumentReminderTableRow.propTypes = {
    onDeleteRow: PropTypes.func,
    onViewRow: PropTypes.func,
    onDocumentView:PropTypes.func,
    row: PropTypes.object,
    selected: PropTypes.bool,
};