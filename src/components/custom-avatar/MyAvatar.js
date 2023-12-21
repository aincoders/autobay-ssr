import { Person } from '@mui/icons-material';
import { useAuthContext } from 'src/auth/useAuthContext';
import Avatar from './Avatar';

const getCharAtName = (name) => name && name.charAt(0).toUpperCase();

export default function MyAvatar({ ...other }) {
    const { customer } = useAuthContext();

    return (
        <Avatar
            src={customer?.media_url}
            alt={customer?.first_name}
            color={customer?.media_url ? 'default' : 'primary'}
            {...other}
        >
            {customer.customer_type == 'business'  ? getCharAtName(customer.company) : customer?.first_name ? getCharAtName(customer.first_name) :  <Person />}
        </Avatar>
    );
}
