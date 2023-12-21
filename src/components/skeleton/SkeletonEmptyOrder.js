import { Card, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import EmptyContent from '../empty-content';

SkeletonEmptyOrder.propTypes = {
    isNotFound: PropTypes.bool,
};

export default function SkeletonEmptyOrder({ isNotFound }) {
    const { t } = useTranslation();
    return (
        <>
            {isNotFound ? (
                <Grid item xs={12}>
                    <Card sx={{ boxShadow: 'none' }}>
                        <EmptyContent
                            title={t('no_data_found')}
                            sx={{ '& span.MuiBox-root': { height: 150 } }}
                            img={'/assets/illustrations/illustration_empty_content.svg'}
                        />
                    </Card>
                </Grid>
            ) : (
                ''
            )}
        </>
    );
}
