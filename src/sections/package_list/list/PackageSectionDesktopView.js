import { Add, BuildOutlined, Check, FactCheckOutlined, Star, WorkOutline } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { alpha, Box, Button, Card, Typography } from '@mui/material';
import { t } from 'i18next';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { TowingIcon } from 'src/assets/icons';
import { useAuthContext } from 'src/auth/useAuthContext';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import { CustomerVehicleModal, MakeMasterModal, RecommendedPartModal } from 'src/master';
import ModelMasterModal from 'src/master/ModelMasterModal';
import { addToCart, deleteCart } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'src/redux/store';
import { slugify } from 'src/utils/arraytoTree';
import { CART_API } from 'src/utils/constant';
import createAvatar from 'src/utils/createAvatar';
import TabbyPromoComponent from '../tabby/TabbyPromoComponent';



export default function PackageSectionDesktopView({ packageItem }) {
	const { currentVehicle, currentCity } = useSettingsContext();
	const { make, model } = currentVehicle

	const { customer } = useAuthContext();
	const { postApiData } = useApi();
	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();
	const { checkout } = useSelector((state) => state.product);
	const { cart } = checkout;

	const [loadingID, setLoadingID] = useState('');


	// useEffect(() => {
	// 	if (!loading && query.data && isReady) {
	// 		const data = JSON.parse(query.data)
	// 		// const elem = document.getElementById(location.state.data.navigation_to_section ? location.state.data.navigation_to_section : '')
	// 		// if (elem) {
	// 		// 	var headerOffset = 170;
	// 		// 	var elementPosition = elem.getBoundingClientRect().top - headerOffset;
	// 		// 	window.scrollTo({ top: elementPosition, });
	// 		// }
	// 	}
	// }, [query,isReady])

	// item add in cart online & offline manage
	const handleAddCart = useCallback(async (service) => {
		setLoadingID(service.service_group_id);
		if (!service.spare_part_group_data.length) {
			const item = { service_group_id: service.service_group_id, name: service.service_group_name, price: service.price, spare_part_id: 0, };
			if (customer) {
				await addToCartCustomer(item);
			} else {
				dispatch(addToCart(item));
			}
		} else {
			SetRecommendedModal({ status: true, data: service, referencePackage: service });
		}
		enqueueSnackbar(t('item_added_successfully'), { variant: 'success' });
		setLoadingID('');
	},
		[customer, dispatch]
	);

	// item remove in cart only offline
	const handleDeleteCart = useCallback((serviceGroupID) => {
		dispatch(deleteCart(serviceGroupID));
		enqueueSnackbar(t('remove_item_successfully'), { variant: 'success' });
	}, [dispatch]);

	//sparepartgroup exist in service group
	const [recommendedModal, SetRecommendedModal] = useState({ status: false, data: [], referencePackage: '', });
	async function recommendedModalClose(value) {
		if (value.data) {
			const { service_group_id, service_group_name, totalAmount, spare_part_id } = recommendedModal.data;
			const item = { service_group_id, name: service_group_name, price: totalAmount, spare_part_id };
			if (customer) {
				await addToCartCustomer(item);
			} else {
				enqueueSnackbar(t('item_added_successfully'), { variant: 'success' });
				dispatch(addToCart(item));
			}
		}
		SetRecommendedModal({ status: value.status, data: [], referencePackage: '' });
		setLoadingID('');
	}

	// item add in cart online
	const addToCartCustomer = useCallback(async (item) => {
		if (item) {
			const data = { vehicle_model_master_id: model?.vehicle_model_master_id, ...item };
			const response = await postApiData(CART_API.addToCart, data);
			response && dispatch(addToCart(item));
		}
	}, [model, dispatch]);

	// vehicle not select
	const [makeModal, setMakeModal] = useState(false);
	const makeModalClose = useCallback((value) => {
		setMakeModal(false);
	}, []);



	return (
		<>
			<Box display="flex" gap={3} flexDirection="column" id={slugify(packageItem.title)}>
				<>
					<Box display={'flex'} flexDirection="column" gap={1}>
						{packageItem.media_url && (
							<Image alt={packageItem.media_url_alt} src={packageItem.media_url} sx={{ mb: 2, borderRadius: 2, height: 400, }} />
						)}
						<Typography variant="h4" >{packageItem.title}</Typography>
					</Box>
					{packageItem.service_group_data.length > 0 && (
						<Box display="flex" flexDirection="column" gap={1}>
							{packageItem.service_group_data.map((service, _j) => {
								const generatedPath = `/${currentCity.slug}/${service.slug_url}/${model ? model.vehicle_model_slug : (make && make.vehicle_make_slug)}`;
								const ItemExist = cart.some((item) => item.service_group_id === service.service_group_id)


								return (
									<Card key={_j} sx={{ p: 2 }} variant="elevation">
										<Box display={'flex'} flexDirection="row" gap={2} alignItems="stretch">
											<Link href={{ pathname: generatedPath, query: { packageDetailSlug: true } }} as={generatedPath} style={{ display: "flex" }}>
												<Image src={service.media_url} alt={service.media_url_alt} sx={{ height: 'auto', width: 280, borderRadius: 1 }} />
											</Link>
											<Box display={'flex'} flexDirection="column" flex={1} justifyContent="space-between" gap={3}>
												<Link href={{ pathname: generatedPath, query: { packageDetailSlug: true } }} as={generatedPath} style={{ textDecoration: 'inherit', color: "inherit", cursor: "pointer" }}>
													<Box display={'flex'} flexDirection="column" gap={2} alignItems="flex-start">
														<Box display={'flex'} alignItems="center" justifyContent={'space-between'} sx={{ width: '100%' }}>
															<Box>
																<Box display={'flex'} gap={1} alignItems='center'>
																	<Typography variant="h5">{service.service_group_name}</Typography>
																	{service.booking_type_list.length > 0 && <GetBookingType Item={service.booking_type_list} />}
																</Box>
																{service.timeline_list && (
																	<Box display={'flex'} flexDirection="row" gap={1} flexWrap="wrap">
																		{service.timeline_list.map((serviceItem, k) => (
																			<Box key={k} display="flex" alignItems='center' gap={1} sx={{ color: 'text.secondary' }}>
																				<Typography variant="button">{serviceItem.title}</Typography>
																				{service.timeline_list.length != k + 1 ? '•' : ''}
																			</Box>
																		))}
																	</Box>
																)}
															</Box>
															{service.total_review > 0 && (
																<Box display={'flex'} flexDirection="column" alignItems="center" gap={0.5}>
																	<Box display="flex" gap={0.5} alignItems="center" sx={{ bgcolor: 'success.main', color: '#fff', p: 0.5, px: 1, borderRadius: 1 }}>
																		<Typography variant="body1" fontWeight='bold'>{service.rating_star}</Typography>
																		<Star fontSize="inherit" />
																	</Box>
																	<Box display={'flex'} flexDirection="column" alignItems='flex-start'>
																		<Typography variant="button" color={'text.secondary'}>{`${service.total_review} ${t('reviews')}`}</Typography>
																	</Box>
																</Box>
															)}
														</Box>
														<Box display={'flex'} flexDirection="column" gap={1} sx={{ width: '100%' }}>
															{service.service_list.length > 1 && <GetServiceList Item={service.service_list} />}

															{service.service_list.length == 1 && service.service_group_benefit.length > 0 && <GetBenifit Item={service.service_group_benefit} />}

															{service.spare_parts_list.length > 0 && <GetSparePart Item={service.spare_parts_list} />}

															{service.inspection_list.length > 0 && <GetInspection Item={service.inspection_list} />}
														</Box>
														{service.service_group_tag.length > 0 && <GetTag Item={service.service_group_tag} />}

														{service.service_group_specification && <GetSpecification Item={service.service_group_specification} />}
													</Box>
												</Link>
												<Box display={'flex'} justifyContent={'space-between'}>
													<Box display={'flex'} flexDirection='column'>
														{model ? <GetPrice currentCity={currentCity} service={service} /> : <Box />}
														<TabbyPromoComponent referenceID={service.service_group_id} Price={service.price} />
													</Box>

													<Box display={'flex'} justifyContent='space-between' alignItems="flex-end" gap={1}>
														<Link href={{ pathname: generatedPath, query: { packageDetailSlug: true } }} as={generatedPath} style={{ textDecoration: 'none' }}>
															<Button variant="outlined" sx={{ textTransform: 'uppercase' }}>{t('view_details')}</Button>
														</Link>
														{model ?
															ItemExist ?
																customer
																	? <Button variant="contained" color="error" component={Link} href={'/cart'}>{t('checkout')}</Button>
																	: <Button variant="contained" color="error" onClick={() => handleDeleteCart(service.service_group_id)}>{t('remove')}</Button>
																:
																<LoadingButton loading={loadingID == service.service_group_id} variant="contained" onClick={() => handleAddCart(service)} sx={{ textTransform: 'uppercase' }}>{t('add_to_cart')}</LoadingButton>
															:
															<Button variant="contained" onClick={() => setMakeModal(true)}>{t('select_vehicle')}</Button>
														}
													</Box>
												</Box>
											</Box>
										</Box>
									</Card>
								);
							})}
						</Box>
					)}
				</>
			</Box>

			{recommendedModal.status && (
				<RecommendedPartModal open={recommendedModal.status} onClose={recommendedModalClose} ItemList={recommendedModal.data} ReferenceData={recommendedModal.referencePackage} />
			)}

			{customer ?
				<CustomerVehicleModal open={makeModal} onClose={makeModalClose} />
				:
				make
					? <ModelMasterModal open={makeModal} onClose={makeModalClose} referenceData={make} directOpen />
					: <MakeMasterModal open={makeModal} onClose={makeModalClose} />
			}
		</>
	);
}



function GetBenifit({ Item }) {
	return (
		<Box display={'grid'} gridTemplateColumns={'repeat(4,1fr)'} gap={1} sx={{ width: '100%' }}>
			{Item.slice(0, 7).map((benefit, k) => {
				return (
					<Box key={k} display="flex" alignItems={'center'} gap={1} sx={{ width: '100%' }}>
						<Typography display={'flex'} variant="body1"><Check fontSize="inherit" /></Typography>
						<Typography variant="body1" fontWeight={'500'}>{benefit.title}</Typography>
					</Box>
				);
			})}
			{Item.length > 7 && (
				<Box display="flex" alignItems={'center'} gap={1} sx={{ width: '100%', color: 'primary.main' }}>
					<Typography display={'flex'} variant="body1"><Add fontSize="inherit" /></Typography>
					<Typography variant="body1" fontWeight={'500'}>{`${Item.length - 7} ${t('more')}`}</Typography>
				</Box>
			)}
		</Box>
	);
}
function GetServiceList({ Item }) {
	return (
		<Box display={'grid'} gridTemplateColumns={'repeat(4,1fr)'} gap={1} sx={{ width: '100%' }}>
			{Item.map((serviceItem, k) => (
				<Box key={k} display="flex" alignItems={'center'} gap={1}>
					<Typography display={'flex'} variant="body1">
						<WorkOutline fontSize="inherit" />
					</Typography>
					<Typography variant="body1" fontWeight={'500'}>
						{serviceItem.title}
					</Typography>
				</Box>
			))}
		</Box>
	);
}

function GetInspection({ Item }) {
	return (
		<Box display={'grid'} gridTemplateColumns={'repeat(4,1fr)'} gap={1} sx={{ width: '100%' }}>
			{Item.map((inspection, i) => (
				<Box key={i} display="flex" alignItems={'center'} gap={1}>
					<Typography display={'flex'} variant="body1">
						<FactCheckOutlined fontSize="inherit" />
					</Typography>
					<Typography variant="body1" fontWeight={'500'}>
						{inspection.title}
					</Typography>
				</Box>
			))}
		</Box>
	);
}

function GetSparePart({ Item }) {
	return (
		<Box display={'grid'} gridTemplateColumns={'repeat(4,1fr)'} gap={1} sx={{ width: '100%' }}>
			{Item.map((part, i) => (
				<Box key={i} display="flex" alignItems={'center'} gap={1}>
					<Typography display={'flex'} variant="body1"><BuildOutlined fontSize="inherit" /></Typography>
					<Typography variant="body1" fontWeight={'500'}>{part.title}</Typography>
				</Box>
			))}
		</Box>
	);
}

function GetSpecification({ Item }) {
	return (
		<Box display={'grid'} gridTemplateColumns={'repeat(4,1fr)'} gap={1} sx={{ width: '100%' }}>
			{Item.map((spec, k) => (
				<Box key={k} display="flex" alignItems={'center'} gap={1} sx={{ color: 'text.secondary' }}>
					{spec.media_url ? (<Image src={spec.media_url} alt={spec.media_url_alt} sx={{ width: 24, height: 24 }} />)
						: ('•')}
					<Typography variant="body1" fontWeight={'500'}>{spec.title}</Typography>
				</Box>
			))}
		</Box>
	);
}

function GetTag({ Item }) {
	return (
		<Box display={'flex'} flexDirection="row" flexWrap={'wrap'} gap={1} alignItems="center">
			{Item.map((tag, k) => (
				<Box key={k} display="flex" sx={{ bgcolor: alpha(tag.color, 0.12), color: tag.color, p: 0.5, px: 1, borderRadius: 1, }}>
					<Typography variant="caption" fontWeight={'bold'} textTransform="uppercase">
						{tag.title}
					</Typography>
				</Box>
			))}
		</Box>
	);
}
function GetBookingType({ Item }) {
	return (
		<Box display={'flex'} flexDirection="row" flexWrap={'wrap'} gap={1} alignItems="center">
			{Item.map((tag, k) => (
				<Box key={k} display="flex" sx={{ color: `${createAvatar(tag.booking_type).color}.main`, p: 0.5, px: 1, borderRadius: 1 }}>
					<Typography variant="caption" fontWeight={'bold'} textTransform="uppercase">
						{tag.booking_type}
					</Typography>
				</Box>
			))}
		</Box>
	);
}

function GetPrice({ currentCity, service }) {
	return (
		<Box display="flex" alignItems={'center'} gap={1.5}>
			<Typography variant="h4" color={'primary'}>{`${currentCity.currency_symbol} ${Number(service.price).toFixed(currentCity.decimal_value)}`}</Typography>

			{service.main_total != service.price && (
				<Typography variant="subtitle1" fontWeight={'bold'} sx={{ textDecoration: 'line-through' }} color="text.disabled">
					{`${currentCity.currency_symbol} ${Number(service.main_total).toFixed(currentCity.decimal_value)}`}
				</Typography>
			)}
			{service.main_total != service.price && (
				<Typography variant="subtitle2" fontWeight={'bold'} sx={{ color: 'success.main' }}>
					{`${t('save').toUpperCase()} ${currentCity.currency_symbol} ${Number(service.main_total - service.price).toFixed(currentCity.decimal_value)}`}
				</Typography>
			)}


			{(service.towing_enabled_disabled == '1' && service.towing_title != '') &&
				<Box display={'flex'} alignItems='center' gap={1}>
					<TowingIcon sx={{ width: 36 }} />
					<Typography variant="subtitle2" fontWeight={'bold'} textTransform="uppercase" color={'primary'}>
						{service.towing_title}
					</Typography>
				</Box>
			}
		</Box>
	);
}