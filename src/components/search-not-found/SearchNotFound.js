import PropTypes from 'prop-types';
// @mui
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
    query: PropTypes.string,
    sx: PropTypes.object,
};

export default function SearchNotFound({ query, loading, sx, ...other }) {
    if (loading && query) {
        return (
            <Typography variant="body2" sx={sx}>
                Data will be load..
            </Typography>
        );
    }

    return query ? (
        <Paper sx={{ textAlign: 'center', ...sx }} {...other}>
            <Typography variant="h6" paragraph>
                Not found
            </Typography>

            <Typography variant="body2">
                No results found for &nbsp;
                <strong>&quot;{query}&quot;</strong>.
                <br /> Try checking for typos or using complete words.
            </Typography>
        </Paper>
    ) : (
        <Typography variant="body2" sx={sx}>
            Please enter keywords
        </Typography>
    );
}
