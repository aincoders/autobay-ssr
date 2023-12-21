import { yupResolver } from '@hookform/resolvers/yup';
import { CallOutlined, CloseOutlined, TitleOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Drawer, FormGroup, Grid, IconButton, InputAdornment, List, ListItemButton, ListItemText, MenuItem, Skeleton, Typography } from '@mui/material';
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { FormProvider, RHFAutocomplete, RHFSelect, RHFSwitch, RHFTextField } from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import { ADDRESS_TYPE, AREA_API, CUSTOMER_API } from 'src/utils/constant';
import * as yup from 'yup';

const libraries = ['places'];


export default function AddAddressModal({ open, onClose, referenceData }) {
    const { currentCity } = useSettingsContext();
    const { postApiData, getApiData } = useApi();
    const { customer } = useAuthContext();

    const controller = new AbortController();
    const { signal } = controller;

    // const [regionList, setRegionList] = useState([]);
    // async function GetRegionList() {
    //     const response = await getApiData(REGION_API.list, signal);
    //     if (response) {
    //         setRegionList(response.data.result.list);
    //     }
    // }

    // const [cityList, setCityList] = useState([]);;
    // async function GetCityList() {
    //     try {
    //         const response = await getApiData(CITY_API.list, signal);
    //         const data = response.data.result;
    //         setCityList(data);

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }


    const [areaList, setAreaList] = useState([]);
    async function GetAreaList() {
        try {
            const response = await getApiData(AREA_API.list, signal);
            const data = response.data.result;
            setAreaList(data.sort((a, b) => a.city_area_name.localeCompare(b.city_area_name)));

        } catch (error) {
            console.log(error);
        }
    }

   

    useEffect(() => {
        if(open){
            GetAreaList()
        }
    }, [open]);

    const [loading, setLoading] = useState(false);



    const defaultValues = useMemo(
        () => ({
            full_name: referenceData?.full_name || `${customer.first_name} ${customer.last_name}`,
            address_line1: referenceData?.address_line1 || '',
            address_line2: referenceData?.address_line2 || '',
            phone: referenceData?.phone || customer?.phone,
            pin_code: '',
            address_type: referenceData?.address_type || ADDRESS_TYPE[0],
            region: {
                region_master_id: referenceData?.address_region_id || '',
                region_name: referenceData?.region_name || ''
            },
            city: {
                city_master_id: referenceData?.address_city_id || '',
                city_name: referenceData?.city_name || ''
            },
            customer_address_default: referenceData.customer_address_default == '1' ? true : false,
            latitude: referenceData?.latitude || '',
            longitude: referenceData?.longitude || '',

            apartment_villa_no: referenceData?.apartment_villa_no || "",
            floor: referenceData?.floor || '',
            building_no: referenceData?.building_no || "",
            street_road_no: referenceData?.street_road_no || '',
            block_no: referenceData?.block_no || '',
            area: {
                city_area_master_id: referenceData?.register_area_id || '',
                city_area_name: referenceData?.area_name || ''
            },
        }),
        [referenceData, open]
    );



    const validationSchema = yup.object({
        address_line1: yup.string().required(`${t('address_line1_')} ${t('is_required')}`),
        full_name: yup.string().required(`${t('full_name_')} ${t('is_required')}`),
        phone: yup.string()
            .required(`${t('mobile_number_')} ${t('is_required')}`)
            .min(currentCity.min_area_code_length, t('minium_characters').replace('%1$s', currentCity.min_area_code_length))
            .max(currentCity.max_area_code_length, t('maximum_characters').replace('%1$s', currentCity.max_area_code_length)),
        building_no: yup.string().required(`${t('building_no_')} ${t('is_required')}`),
        street_road_no: yup.string().required(`${t('street_road_no_')} ${t('is_required')}`),
        block_no: yup.string().required(`${t('block_no_')} ${t('is_required')}`),

        address_type: yup.string().required(`${t('address_type_')} ${t('is_required')}`),




    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { watch, setValue, handleSubmit, reset,getValues } = methods;

    useEffect(() => {
        if (referenceData) {
          reset(defaultValues);
        }
      }, [referenceData]);

    async function onSubmit(values) {
        setLoading(true);
        const data = {
            full_name: values.full_name,
            address_line1: values.address_line1,
            address_line2: values.address_line2,
            phone: values.phone.trim(),
            pin_code: values.pin_code,
            address_type: values.address_type,
            
            address_region_id: values.region.region_master_id,
            region_name: values.region.region_name,

            address_city_id: values.city.city_master_id,
            city_name: values.city.city_name,
            
            area_id:values.area.city_area_master_id,
            area_name:values.area.city_area_name,

            customer_address_default: values.customer_address_default == true ? '1' : '0',
            latitude: values.latitude,
            longitude: values.longitude,
            
            apartment_villa_no:values.apartment_villa_no,
            floor:values.floor,
            building_no:values.building_no,
            street_road_no:values.street_road_no,
            block_no:values.block_no,
        };
        referenceData.customer_address_id
            ? await CustomerUpdateAddress(data)
            : await CustomerAddAddress(data);
        setLoading(false);
    }
    async function CustomerAddAddress(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.addAddress, data);
            if (response) {
                onClose({ update: true, data: '' });
                reset()
            }
        }
    }

    async function CustomerUpdateAddress(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.updateAddress, {
                ...data,
                customer_address_id: referenceData.customer_address_id,
            });
            if (response) {
                onClose({ update: true, data: response.data.result });
                reset()
            }
        }
    }

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.GOOGLE_MAP_KEY,
        libraries: libraries,
    });

    const [map, setMap] = useState('');
    const [autocomplete, setAutocomplete] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [currentLocationCountry, setCurrentLocationCountry] = useState('');


    const onLoad = (mapInstance) => {
        setMap(mapInstance);
    };

    useEffect(() => {
        if (open && typeof window !== 'undefined' && typeof window.google !== 'undefined') {
            if (referenceData.latitude && referenceData.longitude) {
                const newCenter = { lat: Number(referenceData.latitude), lng: Number(referenceData.longitude) };
                if (map) {
                    map.panTo(newCenter);
                    map.setCenter(newCenter)
                    setSelectedPlace({ location: newCenter });
                }
            } else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        const { latitude, longitude } = position.coords;
                        setSelectedPlace({ location: { lat: latitude, lng: longitude } });
                        if (map) {
                            map.panTo({ lat: latitude, lng: longitude });
                            const geocoder = new google.maps.Geocoder();
                            const latLng = new google.maps.LatLng(latitude, longitude);
                            geocoder.geocode({ location: latLng }, (results, status) => {
                                if (status === 'OK' && results[0]) {
                                    setValue('address_line1', results[0].formatted_address);

                                    const countryComponent = results[0].address_components.find((component) => component.types.includes('country'));
                                    const country = countryComponent ? countryComponent.short_name : '';
                                    setCurrentLocationCountry(country)

                                    setValue('latitude', latitude)
                                    setValue('longitude', longitude)
                                } else {
                                    console.log('Geocoder failed:', status);
                                }
                            });
                        }
                    },
                        (error) => {
                            console.log('Error retrieving user location:', error);
                        }
                    );
                } else {
                    console.log('Geolocation is not supported by this browser.');
                }
            }
        }
    }, [open, map]);

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place && place.geometry && place.geometry.location) {
                setSelectedPlace({ location: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() } });
                if (map) {
                    map.panTo(place.geometry.location);
                    map.setCenter(place.geometry.location);
                    setValue('latitude', place.geometry.location.lat())
                    setValue('longitude', place.geometry.location.lng())
                    setValue('address_line1', place.formatted_address)
                    setSuggestions([]);
                }
            } else {
                console.log('Invalid place object:', place);
            }
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    };

    const onInputChange = (value) => {
        const input = value;
        if (autocomplete !== null) {
            autocomplete.setBounds(map.getBounds());
            setSuggestions([]);
            if (input !== '') {
                const service = new window.google.maps.places.AutocompleteService();
                service.getPlacePredictions({ input, componentRestrictions: { country: currentLocationCountry }, bounds: map.getBounds() }, (predictions, status) => {
                    if (status === 'OK' && predictions) {
                        setSuggestions(predictions);
                    }
                }
                );
            }
        }
    };

    const selectSuggestion = (prediction) => {
        const service = new window.google.maps.places.PlacesService(map);
        service.getDetails({ placeId: prediction.place_id }, (result, status) => {
            if (status === 'OK' && result) {
                setSuggestions([]);
                setSelectedPlace({ location: { lat: result.geometry.location.lat(), lng: result.geometry.location.lng() } });

                setValue('latitude', result.geometry.location.lat())
                setValue('longitude', result.geometry.location.lng())

                setValue('address_line1', result.formatted_address)
                const resultLocation = result.geometry.location;
                const newCenter = { lat: resultLocation.lat(), lng: resultLocation.lng() };
                map.panTo(newCenter);
            }
        }
        );
    };


    return (
        <>
            <Drawer
                variant="temporary"
                anchor={'right'}
                open={open}
                onClose={() => { onClose({ update: false, data: '' }); reset() }}
                PaperProps={{ sx: { width: { xs: '100%', md: '550px' } } }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2 }}>
                        <Typography variant="h6">
                            {referenceData ? t('edit_address') : t('add_address')}
                        </Typography>
                        <IconButton aria-label="close modal" onClick={() => { onClose({ update: false, data: '' }); reset() }}>
                            <CloseOutlined />
                        </IconButton>
                    </Box>

                    <Box sx={{ overflow: 'hidden' }} display="flex" flexDirection={'column'} gap={2} flex={1}>
                        <Scrollbar sx={{ flex: 1 }}>
                            <Box sx={{ py: 3, px: 2 }}>
                                <FormProvider methods={methods} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                                    <FormGroup>
                                        <Grid container spacing={2} rowSpacing={3}>
                                            <Grid item xs={12}>
                                                {isLoaded ?
                                                    <>
                                                        <GoogleMap
                                                            id="google-map-address"
                                                            mapContainerStyle={{ width: '100%', height: '300px', marginBottom: 20, borderRadius: 8 }}
                                                            center={selectedPlace ? selectedPlace.location : null}
                                                            zoom={9}
                                                            onLoad={onLoad}
                                                        >
                                                            {selectedPlace && (
                                                                <Marker position={selectedPlace.location} />
                                                            )}
                                                        </GoogleMap>
                                                        <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
                                                            <RHFTextField
                                                                placeholder={t('search_location')}
                                                                name="address_line1"
                                                                label={t('address_line1_')}
                                                                onChange={(e) => {
                                                                    setValue('address_line1', e.target.value)
                                                                    onInputChange(e.target.value)
                                                                }}
                                                                InputProps={{ startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>) }}
                                                            />
                                                        </Autocomplete>

                                                        <Box sx={{ position: "relative" }}>
                                                            {suggestions.length > 0 && (
                                                                <List sx={{ position: 'absolute', bgcolor: "background.paper", zIndex: 99, left: 0, right: 0, border: "1px solid", borderColor: "divider" }}>
                                                                    {suggestions.map((prediction) => (
                                                                        <ListItemButton key={prediction.place_id} onClick={() => selectSuggestion(prediction)}>
                                                                            <ListItemText primary={prediction.description} />
                                                                        </ListItemButton>
                                                                    ))}
                                                                </List>
                                                            )}
                                                        </Box>
                                                    </> : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />}
                                            </Grid>



                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    name="full_name"
                                                    label={t('full_name_')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>) }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type="number"
                                                    name="phone"
                                                    label={t('mobile_number_')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><CallOutlined /></InputAdornment>) }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RHFSelect
                                                    fullWidth
                                                    name="address_type"
                                                    label={t('address_type')}
                                                    InputLabelProps={{ shrink: true }}
                                                    SelectProps={{ native: false }}
                                                >
                                                    {ADDRESS_TYPE.map((option) => (
                                                        <MenuItem key={option} value={option} sx={{ mx: 1, my: 0.5, borderRadius: 0.75, typography: 'body2', textTransform: 'capitalize' }}>
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </RHFSelect>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField type='number' name="apartment_villa_no" label={t('apartment_villa_no')} />
                                            </Grid>

                                            <Grid item xs={4}>
                                                <RHFTextField name="floor" label={t('floor')} />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <RHFTextField type='number' name="building_no" label={t('building_no_')} />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <RHFTextField type='number' name="street_road_no" label={t('street_road_no_')} />
                                            </Grid>

                                            <Grid item xs={4}>
                                                <RHFTextField type='number' name="block_no" label={t('block_no_')} />
                                            </Grid>


                                            <Grid item xs={8}>
                                                {areaList.length > 0 &&
                                                    <RHFAutocomplete
                                                        disableClearable
                                                        name="area"
                                                        label={t('area_name_')}
                                                        options={areaList}
                                                        getOptionLabel={(option) => option.city_area_name}
                                                        isOptionEqualToValue={(option, value) => option.city_area_master_id === value.city_area_master_id && option.city_area_name === value.city_area_name}
                                                        onChange={(e, value) => {
                                                            setValue('area', { city_area_master_id: value.city_area_master_id, city_area_name: value.city_area_name });
                                                            setValue('city', { city_master_id: value.city_master_id, city_name: value.city_name });
                                                            setValue('region', { region_master_id: value.region_master_id, region_name: value.region_name });
                                                        }}
                                                    />}
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField name="region.region_name" label={t('region_name')} disabled/>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField name="city.city_name" label={t('city_name')} disabled/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <RHFTextField name="address_line2" label={t('additional_directions')} />
                                            </Grid>



                                            <Grid item xs={12}>
                                                <RHFSwitch
                                                    name="customer_address_default"
                                                    label={t('address_default')}
                                                    labelPlacement="start"
                                                    sx={{ mx: 0, justifyContent: 'start' }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <LoadingButton loading={loading} fullWidth variant="contained" onClick={handleSubmit(onSubmit)}>
                                                    {t('save')}
                                                </LoadingButton>
                                            </Grid>
                                        </Grid>
                                    </FormGroup>
                                </FormProvider>
                            </Box>
                        </Scrollbar>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}