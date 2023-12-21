import { Star } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Typography } from '@mui/material';
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
import { CART_API } from 'src/utils/constant';
import createAvatar from 'src/utils/createAvatar';
import TabbyPromoComponent from '../tabby/TabbyPromoComponent';


export default function PackageSectionMobileView({ packageItem }) {
	const { currentVehicle, currentCity } = useSettingsContext();
	const { make, model } = currentVehicle

	const { customer } = useAuthContext();
	const { postApiData } = useApi();
	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();
	const { checkout } = useSelector((state) => state.product);
	const { cart } = checkout;

	const [loadingID, setLoadingID] = useState('');

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
	}, []);

	//sparepartgroup exist in service group
	const [recommendedModal, SetRecommendedModal] = useState({ status: false, data: [], referencePackage: '', });
	async function recommendedModalClose(value) {
		if (value.data) {
			const item = {
				service_group_id: recommendedModal.data.service_group_id,
				name: recommendedModal.data.service_group_name,
				price: value.data.totalAmount,
				spare_part_id: value.data.spare_part_id,
			};
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
	function makeModalClose(value) {
		setMakeModal(value.status);
	}

	return (
		<>
			<Box display="flex" gap={1.5} flexDirection="column" id={packageItem.package_section_id}>
				<>
					{packageItem.service_group_data.length > 0 && (
						<Box display={'flex'} flexDirection="column" gap={1.5}>
							{packageItem.media_url && (<Image alt={packageItem.media_url_alt} src={packageItem.media_url} sx={{ height: 180 }} />)}
							<Typography variant="h6" px={1.5}>{packageItem.title}</Typography>
						</Box>
					)}
					{packageItem.service_group_data.length > 0 && (
						<Box display={'flex'} flexDirection="column" gap={1.5} px={1.5}>
							{packageItem.service_group_data.map((service, _j) => {
								const generatedPath = `/${currentCity.slug}/${service.slug_url}/${model ? model.vehicle_model_slug : (make && make.vehicle_make_slug)}`;
								return (
									<Card variant="elevation" key={_j} sx={{ p: 1.5 }}>
										<Link href={{ pathname: generatedPath, query: { packageDetailSlug: true, }, }} as={generatedPath} style={{ textDecoration: "inherit", color: "inherit" }}>
											<Box display={'flex'} flexDirection="row" gap={1} alignItems="stretch">
												<Box>
													<Image src={service.media_url} alt={service.media_url_alt} sx={{ height: 84, width: 84, borderRadius: 1 }} />
												</Box>
												<Box display={'flex'} flexDirection="column" flex={1} gap={0.8} justifyContent="space-between">
													<Box display={'flex'} flexDirection="column" gap={0.8}>
														<Box display={'flex'} justifyContent="space-between" alignItems="center" gap={1}>
															<Typography variant="body1" fontWeight={'bold'}>{service.service_group_name}</Typography>
															{service.expert_rating >
																0 && (
																	<Box display="flex" gap={0.5} alignItems="center" sx={{ bgcolor: 'success.main', color: '#fff', p: 0.3, px: 0.8, borderRadius: 1, }}>
																		<Star fontSize="inherit" />
																		<Typography variant="caption" fontWeight='bold'>{service.expert_rating}</Typography>
																	</Box>
																)}
														</Box>
														<Box display={'flex'} flexDirection="row" flexWrap={'wrap'} gap={1} alignItems="center">
															{service.booking_type_list.map((tag, k) => (
																<Box key={k} display="flex" sx={{ color: `${createAvatar(tag.booking_type).color}.main`, pr: 1, borderRadius: 1 }}>
																	<Typography variant="overline" fontWeight={'medium'} textTransform="uppercase">
																		{tag.booking_type}
																	</Typography>
																</Box>
															))}
														</Box>
														{service.timeline_list && (
															<Box display={'grid'} gridTemplateColumns={'repeat(1,1fr)'} gap={0.3}>
																{service.timeline_list.map(
																	(serviceItem, k) => (
																		<Box key={k} display="flex" alignItems={'center'} gap={0.5} sx={{ color: 'text.secondary', }}>
																			<Typography variant="caption" fontWeight={'medium'}>{`•`}</Typography>
																			<Typography variant="caption" fontWeight={'medium'}>{`${serviceItem.title}`}</Typography>
																		</Box>
																	)
																)}
															</Box>
														)}
													</Box>
												</Box>
											</Box>
										</Link>
										<Box display={'flex'} flexDirection='column' gap={1}>
											<Box display={'flex'} alignItems="center" justifyContent={'space-between'} sx={{ borderTop: '1px solid', pt: 1.5, borderColor: 'divider', mt: 1.5 }}>
												<Box display="flex" flexDirection={'column'}>
													{model && (
														<Box display="flex" alignItems={'center'} gap={1}>
															<Typography variant="body2" color={'primary'} fontWeight={'bold'}>
																{`${currentCity.currency_symbol} ${Number(service.price).toFixed(currentCity.decimal_value)}`}
															</Typography>
															<Typography variant="caption" sx={{ textDecoration: 'line-through' }} color="text.secondary">
																{`${currentCity.currency_symbol} ${Number(service.main_total).toFixed(currentCity.decimal_value)}`}
															</Typography>
														</Box>
													)}
													<Box display="flex" alignItems={'center'} gap={1}>
														{service.main_total != service.price && (
															<Typography variant="overline" fontWeight={'bold'} sx={{ color: 'success.main' }}>
																{`${t('save').toUpperCase()} ${currentCity.currency_symbol} ${Number(service.main_total - service.price).toFixed(currentCity.decimal_value)}`}
															</Typography>
														)}
														{(service.towing_enabled_disabled == '1' && service.towing_title != '') &&
															<Box display={'flex'} alignItems='center' gap={0.5}>
																<TowingIcon sx={{ width: 24 }} />
																<Typography variant="overline" fontWeight={'bold'} textTransform="uppercase" color={'primary'}>
																	{service.towing_title}
																</Typography>
															</Box>
														}
													</Box>
												</Box>

												{model ?
													cart.some((item) => item.service_group_id === service.service_group_id) ?
														customer
															? <Button size="small" color="error" variant="contained" component={Link} href={'/cart'}>{t('checkout')}</Button>
															: <Button size="small" color="error" variant="contained" onClick={() => handleDeleteCart(service.service_group_id)}>{t('remove')}</Button>
														:
														<LoadingButton loading={loadingID == service.service_group_id} size="small" variant="contained"  onClick={() => handleAddCart(service)}>
															{t('add')}
														</LoadingButton>
													:
													<Button size="small" variant="contained" color='secondary' onClick={() => setMakeModal(true)}>
														{t('select_vehicle')}
													</Button>
												}
											</Box>
											<TabbyPromoComponent referenceID={service.service_group_id} Price={service.price} />
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