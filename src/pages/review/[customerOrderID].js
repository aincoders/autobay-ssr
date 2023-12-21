import { useRouter } from 'next/router';
import { ReviewProvider } from 'src/mycontext/ReviewContext';
import Review from 'src/sections/review/details';

CustomerOrderReview.getLayout = (page) => page;
export default function CustomerOrderReview() {
    const { query } = useRouter();
    
    if (!query.customerOrderID) {
        return null;
    }
    return (
        <ReviewProvider customerOrderID={query.customerOrderID}>
            <Review/>
        </ReviewProvider>
    );
}
