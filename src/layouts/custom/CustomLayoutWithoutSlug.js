import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useState } from 'react';
import CityGuard from 'src/auth/CityGuard';
import Main from './Main';
import NavbarVertical from './navbar/NavbarVertical';


const DashboardHeader = dynamic(() => import('./header'), { ssr: false })
const Footer = dynamic(() => import('./footer'), { ssr: false })


CustomLayoutWithoutSlug.propTypes = {
    children: PropTypes.node,
};

export default function CustomLayoutWithoutSlug({ children }) {
    const renderContent = () => {
    const [open, setOpen] = useState(false);

        return (
            <>
                <DashboardHeader onOpenSidebar={() => setOpen(true)} />
                <Main>{children}</Main>
                <Footer />
                <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

            </>
        );
    };

    return <CityGuard>{renderContent()}</CityGuard>;
}

