import PropTypes from 'prop-types';
import SlugGuard from 'src/auth/SlugGuard';
import Main from './Main';

CustomerLayout.propTypes = {
    children: PropTypes.node,
};

export default function CustomerLayout({ children }) {
    // return <Main>{children}</Main>
    return <SlugGuard><Main>{children}</Main></SlugGuard>
}
