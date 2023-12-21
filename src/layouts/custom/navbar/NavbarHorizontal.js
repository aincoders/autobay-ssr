import { memo } from 'react';
import { NavSectionHorizontal } from '../../../components/nav-section';
import navConfig from './NavConfig';

function NavbarHorizontal() {
    return <NavSectionHorizontal navConfig={navConfig} />;
}

export default memo(NavbarHorizontal);
