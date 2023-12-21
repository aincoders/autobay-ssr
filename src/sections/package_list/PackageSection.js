import { Box, Container } from '@mui/material';
import { useContext } from 'react';
import { SkeletonEmptyOrder, SkeletonPackageItemDesk } from '../../components/skeleton';
import useResponsive from '../../hooks/useResponsive';
import { PackageListContext } from '../../mycontext/PackageListContext';
import PackageSectionDesktopView from './list/PackageSectionDesktopView';
import PackageSectionMobileView from './list/PackageSectionMobileView';

export default function PackageSection() {
	const { loading, packageList } = useContext(PackageListContext);
	const isDesktop = useResponsive('up', 'lg');
	return (
		<>
			<Box sx={{ bgcolor: 'background.neutral', py: { xs: '0', md: 5 } }}>
				<Container maxWidth="lg" disableGutters={!isDesktop}>
					<Box display="flex" flexDirection="column" gap={2}>
						{!loading && packageList.length > 0
							? packageList.map((packageItem, index) => (
								isDesktop ? <PackageSectionDesktopView key={index} packageItem={packageItem} /> : <PackageSectionMobileView key={index} packageItem={packageItem} />
							))
							: !loading && <SkeletonEmptyOrder isNotFound={!packageList.length} />}

						{loading && <SkeletonPackageItemDesk />}
					</Box>
				</Container>
			</Box>
		</>
	);
}