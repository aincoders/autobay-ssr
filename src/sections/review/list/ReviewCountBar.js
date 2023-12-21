import { Box, LinearProgress, Rating, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { fShortenNumber } from 'src/utils/formatNumber';


export default function ReviewCountBar({ ratingCount }) {
    const { t } = useTranslation()
    const { total, rating_5, rating_4, rating_3, rating_2, rating_1 } = ratingCount;
    var totalAverageRating = ((rating_5 * 5) + (rating_4 * 4) + (rating_3 * 3) + (rating_2 * 2) + (rating_1 * 1))

    var averageRating = totalAverageRating / total

  return (

    <Box display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)',md: 'repeat(2, 1fr)'}}>
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={0.5}
          sx={{ pt: { xs: 5, md: 0 }, pb: { xs: 3, md: 0 }}}
        >
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>{t('average_rating')}</Typography>
          <Typography variant="h2" gutterBottom >{averageRating ? `${Number(averageRating).toFixed(1)}` : Number(0).toFixed(1)}</Typography>

          <Rating sx={{ color: "primary.main" }} readOnly value={averageRating} precision={0.1}/>

          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>  {`${fShortenNumber(total)} ${t('reviews')}`}</Typography>
        </Stack>

        <Stack
          spacing={1.5}
          sx={{
            p: 3,
            py: { md: 5 },
            borderLeft: (theme) => ({ md: `dashed 1px ${theme.palette.divider}` }),
          }}
        >
         <ProgressItem star={rating_5} name={'5 Star'} total={total} />
          <ProgressItem star={rating_4} name={'4 Star'} total={total} />
          <ProgressItem star={rating_3} name={'3 Star'} total={total} />
          <ProgressItem star={rating_2} name={'2 Star'} total={total} />
          <ProgressItem star={rating_1} name={'1 Star'} total={total} />
        </Stack>
      </Box>
  );
}


ProgressItem.propTypes = {
  star: PropTypes.string,
  total: PropTypes.string,
  name: PropTypes.string,
};

function ProgressItem({ star, total, name }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Typography variant="subtitle2">{name}</Typography>
      <LinearProgress
        variant="determinate"
        value={(star / total) * 100}
        sx={{
          mx: 2,
          flexGrow: 1,
          bgcolor: 'divider',
          '&.MuiLinearProgress-root': {
            height: 7
          }
        }}
      />
      <Typography variant="subtitle2" color='text.secondary'>{fShortenNumber(star)}</Typography>
    </Stack>
  );
}