import PropTypes from 'prop-types';
import CityGuard from 'src/auth/CityGuard';
import Main from './Main';

MilesLayout.propTypes = {
    children: PropTypes.node,
};

export default function MilesLayout({ children }) {
    const renderContent = () => {
        return (
            <>
                <Main sx={{ pt: { xs: 7, md: 8.2 } }}>{children}</Main>
            </>
        );
    };

    return <CityGuard>{renderContent()}</CityGuard>;
}
