import { yupResolver } from '@hookform/resolvers/yup';
import { AlternateEmail, CallOutlined, CloudUpload, DeleteOutlineOutlined, DirectionsCarOutlined, TitleOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Backdrop, Box, Button, Card, CircularProgress, Container, Grid, InputAdornment, List, ListItemButton, ListItemText, MenuItem, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import imageCompression from 'browser-image-compression';
import { t } from 'i18next';
import encryptLocalStorage from 'localstorage-slim';
import moment from 'moment';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { FormProvider, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import { APP_NAME, SPACING } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import { ConfirmDialog } from 'src/master';
import { CUSTOMER_API, CUSTOMER_KEY, S3_BUCKET_API } from 'src/utils/constant';
import * as yup from 'yup';
import CustomerTabMenu from './CustomerTabMenu';

const libraries = ['places'];

export default function CustomerProfile() {
    const [loadingButton, setLoadingButton] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const { customer, initialize } = useAuthContext();
    const { currentCity } = useSettingsContext();
    const { postApiData, getApiData } = useApi();
    const controller = new AbortController();
    const { signal } = controller;

    const [customerInfo, setCustomerInfo] = useState('')

    const defaultValues = {
        customer_type: '',
        phone_number: '',
        email: '',
        first_name: '',
        last_name: '',
        company_name: '',
        number_of_vehicles: '',
        company_telephone: '',
        industry: { industry_id: "", industry_name: "" },
        cr_number: '',
        cr_expiry_date: '',
        vat_number: '',
        authorized_contact: '',
        billing_contact: '',
        billing_email: '',
        company_address: '',
        media_url: "",
        cr_media: '',
        vat_certificate_media: '',
        location_map: '',
        location_map_lat: '',
        location_map_long: '',
        search_location: ''
    };
    const UpdateUserSchema = yup.object({
        phone_number: yup.string().required(`${t('phone_number_')} ${t('is_required')}`),
        first_name: yup.string().required(`${t('first_name_')} ${t('is_required')}`),
        last_name: yup.string().required(`${t('last_name_')} ${t('is_required')}`),
        email: yup.string().email(`${t('email_')} ${t('is_invalid_format')}`).required(`${t('email_')} ${t('is_required')}`),

        company_name: customer.customer_type == 'business' && yup.string().required(`${t('last_name_')} ${t('is_required')}`),
        number_of_vehicles: customer.customer_type == 'business' && yup.string().required(`${t('number_of_vehicles_')} ${t('is_required')}`),
        cr_number: customer.customer_type == 'business' && yup.string().required(`${t('cr_number_')} ${t('is_required')}`),
        cr_expiry_date: customer.customer_type == 'business' && yup.string().required(`${t('cr_expiry_date_')} ${t('is_required')}`),
        cr_media: customer.customer_type == 'business' && yup.string().required(`${t('cr_media')} ${t('is_required')}`),
    });

    const [industryList, setIndustryList] = useState([]);

    async function GetList() {
        const response = await getApiData(CUSTOMER_API.industry, signal);
        if (response) {
            const data = response.data.result;
            setIndustryList(data);
        }
    }

    async function GetCustomerDetails() {
        setLoading(true);
        const response = await getApiData(CUSTOMER_API.profile, signal);
        if (response) {
            const data = response.data.result;
            setCustomerInfo(data)
            setValue('phone_number', data.phone)
            setValue('customer_type', data.customer_type)
            setValue('first_name', data.first_name)
            setValue('last_name', data.last_name)
            setValue('email', data.email)
            setValue('company_name', data.company_name)
            setValue('number_of_vehicles', data.number_of_vehicles)
            setValue('company_telephone', data.company_telephone)
            setValue('industry.industry_id', data.industry_id)
            setValue('cr_expiry_date', data.cr_expiry_date ? moment(data.cr_expiry_date, 'DD-MM-YYYY').format('MM-DD-YYYY') : '')
            setValue('cr_number', data.cr_number)
            setValue('vat_number', data.vat_number)
            setValue('authorized_contact', data.authorized_contact)
            setValue('billing_contact', data.billing_contact)
            setValue('billing_email', data.billing_email)

            setValue('company_address', data.company_address)
            setValue('media_url', data.media_url)
            setValue('cr_media', data.cr_media)
            setValue('vat_certificate_media', data.vat_certificate_media)

            if(data.customer_type=='business'){
                GetList();
            }

            setLoading(false)
        }
    }

    useEffect(() => {
        if (currentCity.country_master_id) {
            GetCustomerDetails()
        }
        return () => {
            controller.abort();
        };
    }, [currentCity, customer]);



    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    });

    const { control, watch, setValue, handleSubmit, } = methods;

    const onSubmit = async (values) => {
        setLoadingButton(true);
        const data = {
            phone: values.phone_number.trim(),
            customer_id: customer.customer_id,
            customer_type: values.customer_type,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            company_name: values.company_name,
            number_of_vehicles: values.number_of_vehicles,
            company_telephone: values.company_telephone,
            industry_id: values.industry.industry_id,
            cr_number: values.cr_number,

            cr_expiry_date: values.cr_expiry_date ? moment(values.cr_expiry_date).format('DD-MM-YYYY') : "",
            vat_number: values.vat_number,
            authorized_contact: values.authorized_contact,
            billing_contact: values.billing_contact,
            billing_email: values.billing_email,
            company_address: values.company_address,
            media_url: values.media_url,

            location_map: values.location_map,
            location_map_lat: values.location_map_lat,
            location_map_long: values.location_map_long
        };


        await updateCustomerProfile(data);
        setLoadingButton(false);
    };



    async function updateCustomerProfile(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.profileUpdate, data);
            if (response) {
                encryptLocalStorage.set(CUSTOMER_KEY, data, { encrypt: true, secret: 1272 });
                initialize()
            }
        }
    }

    async function handleDrop(acceptedFiles, TYPE) {
        if (acceptedFiles) {
            const getFile = acceptedFiles[0];
            const options = { maxSizeMB: 5, };
            const compressedFile = await imageCompression(getFile, options);
            const createdFile = new File([compressedFile], compressedFile.name, { type: compressedFile.type, path: compressedFile.name, });
            if (createdFile) {
                await uploadBucketImage(createdFile, TYPE);
            }
        }
    }

    const [loadImage, setLoadImage] = useState(false)
    async function updateProfilePhoto(link) {
        const data = { file: link };
        const response = await postApiData(CUSTOMER_API.updateProfilePhoto, data);
        if (response) {
            encryptLocalStorage.set(CUSTOMER_KEY, { ...customer, media_url: link }, { encrypt: true, secret: 1272 });
            initialize()
            setValue('media_url', link);
        }
    }
    async function updateCrMedia(link) {
        const data = { file: link };
        const response = await postApiData(CUSTOMER_API.updateCrMedia, data);
        if (response) {
            setValue('cr_media', link);
        }
    }
    async function updateVatMedia(link) {
        const data = { file: link };
        const response = await postApiData(CUSTOMER_API.updateVatMedia, data);
        if (response) {
            setValue('vat_certificate_media', link);
        }
    }

    async function uploadBucketImage(value, TYPE) {
        setLoadImage(true)
        const data = { file: value, folder_name: 'customer' };
        const response = await postApiData(S3_BUCKET_API.uploadImage, data);
        if (response.status == 200) {
            const Link = response.data.result.link
            if (TYPE == 'PROFILE') {
                await updateProfilePhoto(Link)
            }
            else if (TYPE == 'CR_MEDIA') {
                updateCrMedia(Link)
            }
            else if (TYPE == 'VAT_MEDIA') {
                updateVatMedia(Link)
            }
        }
        setLoadImage(false)
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

                                const countryComponent = results[0].address_components.find((component) => component.types.includes('country'));
                                const country = countryComponent ? countryComponent.short_name : '';
                                setCurrentLocationCountry(country)

                                setValue('search_location', results[0].formatted_address);
                                setValue('location_map', results[0].formatted_address);
                                setValue('location_map_lat', latitude)
                                setValue('location_map_long', longitude)
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
    }, [open, map]);

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place && place.geometry && place.geometry.location) {
                setSelectedPlace({ location: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() } });
                if (map) {
                    map.panTo(place.geometry.location);
                    map.setCenter(place.geometry.location);
                    setValue('location_map_lat', place.geometry.location.lat())
                    setValue('location_map_long', place.geometry.location.lng())
                    setValue('location_map', place.formatted_address)
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
                const pincodeComponent = result.address_components.find((component) => component.types.includes('postal_code'));
                const pincode = pincodeComponent ? pincodeComponent.long_name : '';

                setValue('location_map_lat', result.geometry.location.lat())
                setValue('location_map_long', result.geometry.location.lng())
                setValue('pin_code', pincode)
                setValue('location_map', result.formatted_address)
                setValue('search_location', result.formatted_address)
                const resultLocation = result.geometry.location;
                const newCenter = { lat: resultLocation.lat(), lng: resultLocation.lng() };
                map.panTo(newCenter);
            }
        }
        );
    };


    const [confirmation, setConfirmation] = useState(false);
    async function confirmationClose(value) {
        if (value.confirmation) {
            await deleteCustomerAccount()
        }
        setConfirmation(value.status);
    }

    async function deleteCustomerAccount() {
        const response = await postApiData(CUSTOMER_API.deleteAccountRequest);
        if (response) {
            // pending
        }
    }

    return (
        <>
            <Head>
                <title> {`${t('my_profile')} | ${APP_NAME}`}</title>
                <meta property="description" content={`${t('my_profile')} | ${APP_NAME}`} />
                <meta property="og:title" content={`${t('my_profile')} | ${APP_NAME}`} />
                <meta property="og:description" content={`${t('my_profile')} | ${APP_NAME}`} />
            </Head>

            <Backdrop
                sx={{ color: 'primary.main', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadImage}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2.5} rowSpacing={3}>
                            <Grid item xs={12}>
                                <Box>
                                    <CustomerTabMenu currentTab="profile" />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Grid container spacing={2} rowSpacing={3}>
                                    <Grid item xs={12}>
                                        <Card sx={{ py: 2, px: 3, textAlign: 'center' }}>
                                            <Box display={'flex'} flexDirection='column' alignItems={'center'} gap={1}>
                                                <RHFUploadAvatar
                                                    sx={{ width: 100, height: 100 }}
                                                    name="media_url"
                                                    maxSize={3145728}
                                                    onDrop={(e) => handleDrop(e, 'PROFILE')}
                                                    helperText={<Typography variant="caption" sx={{ mx: 'auto', display: 'block', textAlign: 'center', color: 'text.secondary', }}></Typography>}
                                                />
                                                <Typography variant='body2' color={'text.secondary'}>{t('profile_photo')}</Typography>
                                            </Box>
                                        </Card>
                                    </Grid>

                                    {customerInfo.customer_type == 'business' &&
                                        <>
                                            <Grid item xs={12}>
                                                {watch('cr_media') == '' ?
                                                    <RHFUploadBox
                                                        name="cr_media"
                                                        maxSize={3145728}
                                                        onDrop={(e) => handleDrop(e, 'CR_MEDIA')}
                                                        placeholder={<Box sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}><CloudUpload /> <Typography>{t('upload_cr_media')}</Typography></Box>}
                                                        sx={{ width: '100%', height: 120 }}
                                                    /> :
                                                    <Box display={'flex'} flexDirection='column' alignItems={'center'}>
                                                        <RHFUpload
                                                            name="cr_media"
                                                            maxSize={3145728}
                                                            onDrop={(e) => handleDrop(e, 'CR_MEDIA')}
                                                            helperText={<Typography variant="caption" sx={{ mx: 'auto', display: 'block', textAlign: 'center', color: 'text.secondary', }}></Typography>}
                                                        />
                                                        <Typography variant='body2' color={'text.secondary'}>{t('cr_media')}</Typography>
                                                    </Box>
                                                }
                                            </Grid>

                                            <Grid item xs={12}>
                                                {watch('vat_certificate_media') == '' ?
                                                    <RHFUploadBox
                                                        name="vat_certificate_media"
                                                        maxSize={3145728}
                                                        onDrop={(e) => handleDrop(e, 'VAT_MEDIA')}
                                                        placeholder={<Box sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}><CloudUpload /> <Typography>{t('upload_vat_certificate_media')}</Typography></Box>}
                                                        sx={{ width: '100%', height: 120 }}
                                                    /> :
                                                    <Box display={'flex'} flexDirection='column' alignItems={'center'}>
                                                        <RHFUpload
                                                            name="vat_certificate_media"
                                                            maxSize={3145728}
                                                            onDrop={(e) => handleDrop(e, 'VAT_MEDIA')}
                                                            helperText={<Typography variant="caption" sx={{ mx: 'auto', display: 'block', textAlign: 'center', color: 'text.secondary', }}></Typography>}
                                                        />
                                                        <Typography variant='body2' color={'text.secondary'}>{t('vat_certificate_media')}</Typography>
                                                    </Box>
                                                }
                                            </Grid>
                                        </>
                                    }

                                    <Grid item xs={12}>
                                        <Button
                                            variant='soft'
                                            fullWidth 
                                            color='error'
                                            startIcon={<DeleteOutlineOutlined />}
                                            onClick={() => setConfirmation(true)}
                                        >{t('delete_account')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} md={9}>
                                <Card sx={{ p: 3 }}>
                                    <Grid container spacing={2} rowSpacing={3}>
                                        <Grid item xs={12}>
                                            <Typography variant='subtitle1'>{t('personal_information')}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            {!loading ?
                                                <RHFTextField
                                                    name="phone_number"
                                                    label={t('phone_number_')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start">+{currentCity?.country_code}</InputAdornment>) }}
                                                    disabled={true}
                                                /> : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />}
                                        </Grid>

                                        <Grid item xs={12} md={3}>
                                            {!loading ?
                                                <RHFTextField
                                                    name="first_name"
                                                    label={t('first_name_')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>), }}
                                                /> : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />}
                                        </Grid>

                                        <Grid item xs={12} md={3}>
                                            {!loading ?
                                                <RHFTextField
                                                    name="last_name"
                                                    label={t('last_name_')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>) }}
                                                /> : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />}
                                        </Grid>

                                        <Grid item xs={12} md={3}>
                                            {!loading ?
                                                <RHFTextField
                                                    name="email"
                                                    label={t('email_')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><AlternateEmail /></InputAdornment>), }}
                                                /> : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />}
                                        </Grid>

                                        {customer.customer_type == 'business' &&
                                            <>
                                                <Grid item xs={12}>
                                                    <Typography variant='subtitle1'>{t('other_information')}</Typography>
                                                </Grid>

                                                <Grid item xs={12} md={4}>
                                                    {!loading ?
                                                        <RHFTextField
                                                            name="company_name"
                                                            label={t('company_name_')}
                                                            InputProps={{ startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>) }} />
                                                        : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />}
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    {!loading ?
                                                        <RHFTextField
                                                            type='number'
                                                            name="number_of_vehicles"
                                                            label={t('number_of_vehicles_')}
                                                            InputProps={{ startAdornment: (<InputAdornment position="start"><DirectionsCarOutlined /></InputAdornment>) }} />
                                                        : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />}
                                                </Grid>

                                                <Grid item xs={12} md={4}>
                                                    {!loading ?
                                                        <RHFTextField
                                                            type='number'
                                                            name="company_telephone"
                                                            label={t('company_telephone')}
                                                            InputProps={{ startAdornment: (<InputAdornment position="start"><CallOutlined /></InputAdornment>) }} />
                                                        : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />}
                                                </Grid>

                                                <Grid item xs={12} md={4}>
                                                    {!loading ?
                                                        <RHFSelect
                                                            fullWidth
                                                            name="industry.industry_id"
                                                            label={t('type_of_industry')}
                                                            InputLabelProps={{ shrink: true }}
                                                            SelectProps={{ native: false }}
                                                        >
                                                            {industryList.map((option) => (
                                                                <MenuItem
                                                                    key={option.industry_id}
                                                                    value={option.industry_id}
                                                                    sx={{ mx: 1, my: 0.5, borderRadius: 0.75, typography: 'body2', textTransform: 'capitalize', }}>
                                                                    {option.industry_name}
                                                                </MenuItem>
                                                            ))}
                                                        </RHFSelect>
                                                        : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />}
                                                </Grid>


                                                <Grid item xs={12} md={4}>
                                                    {!loading
                                                        ? <RHFTextField name="cr_number" label={t('cr_number_')} />
                                                        : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />
                                                    }

                                                </Grid>

                                                <Grid item xs={12} md={4}>
                                                    {!loading ?
                                                        <Controller
                                                            name="cr_expiry_date"
                                                            control={control}
                                                            render={({ field, fieldState: { error } }) => (
                                                                <DatePicker
                                                                    disablePast
                                                                    inputFormat='dd/MM/yyyy'
                                                                    label={t('cr_expiry_date_')}
                                                                    value={field.value}
                                                                    onChange={(newValue) => {
                                                                        field.onChange(newValue);
                                                                    }}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                                                                    )}
                                                                />
                                                            )}
                                                        />
                                                        : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />}
                                                </Grid>

                                                <Grid item xs={12} md={4}>
                                                    {!loading
                                                        ? <RHFTextField name="vat_number" label={t('vat_number')} />
                                                        : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />
                                                    }
                                                </Grid>

                                                <Grid item xs={12} md={4}>
                                                    {!loading
                                                        ? <RHFTextField name="authorized_contact" label={t('authorized_contact')} />
                                                        : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />
                                                    }
                                                </Grid>

                                                <Grid item xs={12} md={4}>
                                                    {!loading
                                                        ? <RHFTextField name="billing_contact" label={t('billing_contact')} />
                                                        : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />
                                                    }
                                                </Grid>

                                                <Grid item xs={12} md={4}>
                                                    {!loading
                                                        ? <RHFTextField name="billing_email" label={t('billing_email')} />
                                                        : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />
                                                    }
                                                </Grid>

                                                <Grid item xs={12}>
                                                    {isLoaded ?
                                                        <>
                                                            <GoogleMap
                                                                id="google-map-profile"
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
                                                                    name="search_location"
                                                                    label={t('search_location')}
                                                                    placeholder={t('search_location')}
                                                                    onChange={(e) => {
                                                                        setValue('search_location', e.target.value)
                                                                        onInputChange(e.target.value)
                                                                    }}
                                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>) }}
                                                                />
                                                            </Autocomplete>

                                                            <Box sx={{ position: "relative" }}>
                                                                {suggestions.length > 0 && (
                                                                    <List sx={{ position: 'absolute', bgcolor: "background.paper", zIndex: 99999, left: 0, right: 0, border: "1px solid", borderColor: "divider" }}>
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

                                                <Grid item xs={12}>
                                                    <RHFTextField name="location_map" label={t('location')} InputProps={{ disabled: true }} />
                                                </Grid>

                                                <Grid item xs={12} md={12}>
                                                    {!loading
                                                        ? <RHFTextField multiline rows={3} name="company_address" label={t('address')} />
                                                        : <Skeleton variant="text" sx={{ width: "100%", transform: "scale(1,1)" }} height={56} />
                                                    }
                                                </Grid>
                                            </>
                                        }
                                    </Grid>

                                    <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                                        <LoadingButton
                                            sx={{ minWidth: 200 }}
                                            type="submit"
                                            variant="contained"
                                            loading={loadingButton}
                                        >
                                            {t('save').toUpperCase()}
                                        </LoadingButton>
                                    </Stack>
                                </Card>
                            </Grid>
                        </Grid>
                    </FormProvider>
                </Box>
            </Container>

            {confirmation &&
                <ConfirmDialog
                    title={t('delete_account')}
                    description={t('msg_delete_account')}
                    open={confirmation}
                    onClose={confirmationClose}
                />}
        </>
    );
}
