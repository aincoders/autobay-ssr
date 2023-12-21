import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import ReviewList from 'src/sections/review/list';

Review.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;
export default function Review() {
    return (
        <ReviewList />
    );
}



