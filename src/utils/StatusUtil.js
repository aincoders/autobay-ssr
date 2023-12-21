/* eslint-disable default-case */
import { ApartmentOutlined, BusinessOutlined, CheckCircle, CircleOutlined, Close, DoneAll, FolderOpenOutlined, Home, HourglassTop, OfflinePin, Payment, Payments, PlaceOutlined, SendOutlined, ThumbDownOutlined, ThumbUpAltOutlined, WorkOutlineOutlined } from '@mui/icons-material';
import { blue, green, grey, red, yellow } from '@mui/material/colors';
import { t } from 'i18next';
import {
    ESTIMATE_STATUS_APPROVED,
    ESTIMATE_STATUS_CONVERTED,
    ESTIMATE_STATUS_CREATED,
    ESTIMATE_STATUS_REJECTED,
    ESTIMATE_STATUS_SENT
} from './constant';

export function getAddressIcon(status) {
    switch (status) {
        case 'HOUSE':
            return Home;
        case 'OFFICE':
            return BusinessOutlined;
        case 'APARTMENT':
            return ApartmentOutlined;
        case 'OTHERS':
            return WorkOutlineOutlined;
        default:
            return PlaceOutlined;
    }
}

export function orderStatus(status) {
    var  orderStatusText;
    switch (status) {
        case '1':
            orderStatusText = t('order_placed');
            break;
        case '2':
            orderStatusText = t('order_confirmed');
            break;
        case '3':
            orderStatusText = t('assign_workshop');
            break;
        case '4':
            orderStatusText = t('accept_workshop');
            break;
        case '5':
            orderStatusText = t('start_working');
            break;
        case '6':
            orderStatusText = t('order_cancelled');
            break;
        case '7':
            orderStatusText = t('vehicle_ready');
            break;
        case '8':
            orderStatusText = t('vehicle_delivered');
            break;
        case '9':
            orderStatusText = t('on_hold');
            break;
        case '10':
            orderStatusText = t('vehicle_received');
            break;
        default:
            orderStatusText = '';
            break;
    }
    return {  orderStatusText };
}

export function paymentStatusIcon(status) {
    switch (status) {
        case 'online':
            return Payments;
        case 'cash':
            return Payment;
        default:
            return null;
    }
}

export function estimateStatusHelper(status) {
    var statusIcon, statusText, iconColor;
    switch (status) {
        case ESTIMATE_STATUS_CREATED:
            statusIcon = FolderOpenOutlined;
            statusText = t('draft');
            iconColor = grey;
            break;
        case ESTIMATE_STATUS_REJECTED:
            statusIcon = ThumbDownOutlined;
            statusText = t('reject');
            iconColor = red;
            break;
        case ESTIMATE_STATUS_SENT:
            statusIcon = SendOutlined;
            statusText = t('awaiting_approval');
            iconColor = yellow;
            break;
        case ESTIMATE_STATUS_APPROVED:
            statusIcon = ThumbUpAltOutlined;
            statusText = t('approved');
            iconColor = green;
            break;
        case ESTIMATE_STATUS_CONVERTED:
            statusIcon = OfflinePin;
            statusText = t('converted');
            iconColor = blue;
            break;
        default:
            statusIcon = '';
            statusText = '';
            iconColor = grey;
            break;
    }
    return { statusIcon, statusText, iconColor };
}


export function schedulePickupDropStatus(status) {
    let statusText;
    let color;
    switch (status) {
        case '1':
            statusText = t('created');
            color = 'default';
            break;
        case '2':
            statusText = t('scheduled');
            color = 'warning';
            break;
        case '3':
            statusText = t('done');
            color = 'success';
            break;
        default:
            statusText = '';
            color = '';
            break;
    }
    return {  statusText, color };
}