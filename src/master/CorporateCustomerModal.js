import { yupResolver } from '@hookform/resolvers/yup';
import { AlternateEmail, CallOutlined, CloseOutlined, CloudUpload, CorporateFareOutlined, DirectionsCarOutlined, TitleOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Drawer, FormGroup, Grid, IconButton, InputAdornment, List, ListItemButton, ListItemText, MenuItem, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import imageCompression from 'browser-image-compression';
import { t } from 'i18next';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormProvider, RHFAutocomplete, RHFCheckbox, RHFSelect, RHFTextField, RHFUpload } from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { HEADER } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import { CUSTOMER_API, OTP_API, S3_BUCKET_API } from 'src/utils/constant';
import { fData } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';
import * as yup from 'yup';

const libraries = ['places'];


export default function CorporateCustomerModal({ open, onClose }) {
    const { currentCity,countryList } = useSettingsContext();
    const { postApiData, getApiData } = useApi();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [showOtherIndustry, setShowOtherIndustry] = useState(false);

    const defaultValues = {
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        company: '',
        register_country: {
            register_country_master_id: currentCity ? currentCity?.country_master_id : '',
            register_country_code: currentCity ? currentCity?.country_code : '',
        },
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
        cr_media: "",
        vat_certificate_media: "",
        location_map: '',
        location_map_lat: '',
        location_map_long: '',
        search_location:'',
        otp_send: false,
        verify_id:"",
        otp: '',
        isAgree:true,
        other_industry_name:""
    };

    const validationSchema = yup.object({

        phone: yup.string()
        .required(`${t('mobile_number_')} ${t('is_required')}`)
        .min(currentCity?.min_area_code_length, t('minium_characters').replace('%1$s', currentCity?.min_area_code_length))
        .max(currentCity?.max_area_code_length, t('maximum_characters').replace('%1$s', currentCity?.max_area_code_length)),

        company_telephone: yup.string()
            .test('min', t('minium_characters').replace('%1$s', currentCity?.min_area_code_length), value => !value || value.length >= currentCity?.min_area_code_length)
            .test('max', t('maximum_characters').replace('%1$s', currentCity?.max_area_code_length), value => !value || value.length <= currentCity?.max_area_code_length),

        first_name: yup.string().required(`${t('first_name_')} ${t('is_required')}`),
        last_name: yup.string().required(`${t('last_name_')} ${t('is_required')}`),
        company: yup.string().required(`${t('company_name_')} ${t('is_required')}`),

        number_of_vehicles: yup.string().required(`${t('number_of_vehicles_')} ${t('is_required')}`),
        cr_number: yup.string().required(`${t('cr_number_')} ${t('is_required')}`),
        cr_expiry_date: yup.string().required(`${t('cr_expiry_date_')} ${t('is_required')}`),
        cr_media: yup.string().required(`${t('cr_media')} ${t('is_required')}`),

        otp: yup.string().when('otp_send', {
            is: true,
            then: yup.string().required(`${t('one_time_password_')} ${t('is_required')}`),
            otherwise: yup.string(),
        }),
        
        other_industry_name: showOtherIndustry && yup.string().required(`${t('other_industry_name_')} ${t('is_required')}`),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });
    const { control, setValue, handleSubmit, reset,watch } = methods;

    async function onSubmit(values) {
        setLoading(true);
        const data = {
            first_name: values.first_name,
            last_name: values.last_name,
            phone: values.phone.trim(),
            email: values.email,
            company: values.company,
            register_country_master_id: values.register_country.register_country_master_id,
            register_country_code: values.register_country.register_country_code,
            device_id: 'web-login',

            number_of_vehicles: values.number_of_vehicles,
            company_telephone: values.company_telephone,
            industry_id: values.industry.industry_id,
            cr_number: values.cr_number,
            cr_expiry_date: values.cr_expiry_date ? fDate(values.cr_expiry_date, 'dd-MM-yyyy') : "",
            vat_number: values.vat_number,
            authorized_contact: values.authorized_contact,
            billing_contact: values.billing_contact,
            billing_email: values.billing_email,
            company_address: values.company_address,

            cr_media: values.cr_media,
            vat_certificate_media: values.vat_certificate_media,

            location_map: values.location_map,
            location_map_lat: values.location_map_lat,
            location_map_long: values.location_map_long,

            otp: values.otp,
            verify_id: values.verify_id,
            other_industry_name: values.other_industry_name,
        };
        watch('otp_send') ? await verifyOTP(data) : await sendOTP(data)
        setLoading(false);
    }

    // otp sent to customer
    async function sendOTP(values) {
        if (values) {
            const data = {phone_number: values.phone,selected_country_master_id: values.register_country_master_id,};
            const response = await postApiData(OTP_API.sendOtp, data);
            if (response) {
                setValue('otp_send', true);
                setValue('verify_id', response.data.result.verify_id);
            }
        }
        setLoading(false);
    }

     // otp verify
     async function verifyOTP(values) {
        if (values) {
            const data = {otp: values.otp,verify_id: values.verify_id,selected_country_master_id: values.register_country_master_id};
            const response = await postApiData(OTP_API.verifyOtp, data);
            if (response && response.status == 200) {
                createBusinessCustomer(values);
            }
        }
    }

    async function createBusinessCustomer(data) {
        if (data) {
            const response = await postApiData(CUSTOMER_API.createBusinessCustomer, data);
            if (response) {
                enqueueSnackbar(t('thank_corporate_customer_message'), {variant: 'success'});
                onClose({ update: false });
                reset();
            }
        }
    }

    const controller = new AbortController();
    const { signal } = controller;

    const [industryList, setIndustryList] = useState([]);

    async function GetList() {
        setLoading(true);
        const response = await getApiData(CUSTOMER_API.industry, signal);
        if (response) {
            const data = response.data.result;
            setLoading(false);
            setIndustryList([...data,{ industry_id: "-1", industry_name: t('others') }]);
            setValue('industry',data[0])
            setShowOtherIndustry(false)
        }
    }

    // async function getCountryList() {
    //     const response = await getApiData(COUNTRY_API, signal);
    //     if (response) {
    //         setCountryList(response.data.result);
    //     }
    // }
    useEffect(() => {
        if (open) {
            // getCountryList();
            GetList()
        }
        return () => {
            controller.abort();
        };
    }, [open]);

    async function handleDrop(acceptedFiles,TYPE){
        if(acceptedFiles){
            const getFile = acceptedFiles[0];
            if(getFile){
                const options = { maxSizeMB: 5, };
                const compressedFile = await imageCompression(getFile, options);
                const createdFile = new File([compressedFile], compressedFile.name, { type: compressedFile.type, path: compressedFile.name, });
                if (createdFile) {
                    await uploadBucketImage(createdFile,TYPE);
                }
            }
        }
    }

    async function uploadBucketImage(value,TYPE) {
        const data = { file: value, folder_name: 'customer' };
        const response = await postApiData(S3_BUCKET_API.uploadImage, data);
        if (response.status == 200) {
            const Link = response.data.result.link
            if (TYPE == 'CR_MEDIA') {
                setValue('cr_media', Link)
            }
            else if (TYPE == 'VAT_MEDIA') {
                setValue('vat_certificate_media', Link)
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
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        const { latitude, longitude } = position.coords;
                        setSelectedPlace({ location: { lat: latitude, lng: longitude } });
                       
                        if(map){
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
                if(map){
                    map.panTo(place.geometry.location);
                    map.setCenter(place.geometry.location);
                    const pincodeComponent = place.address_components.find((component) => component.types.includes('postal_code'));
                    const pincode = pincodeComponent ? pincodeComponent.long_name : '';
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

    return (
        <>
            <Drawer
                variant="temporary"
                anchor={'right'}
                open={open}
                onClose={() => {
                    onClose({ update: false });
                    reset();
                }}
                PaperProps={{ sx: { width: { xs: '100%', md: '550px' } } }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ minHeight: HEADER.DASHBOARD_DESKTOP_HEIGHT, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2, }}>
                        <Typography variant="h6">{t('corporate_business')}</Typography>
                        <IconButton aria-label="close modal" onClick={() => { onClose({ update: false }); reset(); }}>
                            <CloseOutlined />
                        </IconButton>
                    </Box>

                    <Box sx={{ overflow: 'hidden' }} display="flex" flexDirection={'column'} gap={2} flex={1}>
                        <Scrollbar sx={{ flex: 1 }}>
                            <Box sx={{ py: 3, px: 2 }}>
                                <FormProvider methods={methods} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                                    <FormGroup>
                                        <Grid container spacing={2} rowSpacing={3}>
                                            <Grid item xs={4}>
                                                {countryList?.length > 0 && (
                                                    <RHFSelect
                                                        name="register_country.register_country_master_id"
                                                        label={t('country_')}
                                                        SelectProps={{
                                                            native: false,
                                                        }}
                                                        onChange={(e) => {
                                                            setValue('register_country', { register_country_master_id: e.target.value, register_country_code: countryList.find((country) => country.country_master_id == e.target.value)['country_code'], });
                                                        }}
                                                    >
                                                        {countryList.map((option, i) => (
                                                            <MenuItem
                                                                key={i}
                                                                value={option.country_master_id}
                                                                sx={{ mx: 1, my: 0.5, borderRadius: 0.75, typography: 'body2', textTransform: 'capitalize', }}>

                                                                <Box display={'flex'} alignItems="center" gap={1}>
                                                                    <Avatar
                                                                        src={option.media_url}
                                                                        alt={option.media_url_alt}
                                                                        sx={{ width: 20, height: 20, borderRadius: 0.2 }}
                                                                    />
                                                                    <Typography variant="body2">
                                                                        {option.country_code}
                                                                    </Typography>
                                                                </Box>
                                                            </MenuItem>
                                                        ))}
                                                    </RHFSelect>
                                                )}
                                            </Grid>
                                            <Grid item xs={8}>
                                                <RHFTextField
                                                    type="number"
                                                    name="phone"
                                                    label={t('mobile_number_')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><CallOutlined /></InputAdornment>) }}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <RHFTextField
                                                    name="company"
                                                    label={t('company_name_')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><CorporateFareOutlined /></InputAdornment>) }}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    name="first_name"
                                                    label={t('first_name_')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>) }}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    name="last_name"
                                                    label={t('last_name_')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><TitleOutlined /></InputAdornment>) }}
                                                />
                                            </Grid>
                                            

                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    name="email"
                                                    label={t('email')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><AlternateEmail /></InputAdornment>) }}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type='number'
                                                    name="number_of_vehicles"
                                                    label={t('number_of_vehicles_')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><DirectionsCarOutlined /></InputAdornment>) }} />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField
                                                    type='number'
                                                    name="company_telephone"
                                                    label={t('company_telephone')}
                                                    InputProps={{ startAdornment: (<InputAdornment position="start"><CallOutlined /></InputAdornment>) }} />
                                            </Grid>

                                            <Grid item xs={6}>
                                                {industryList?.length > 0 &&
                                                    <RHFAutocomplete
                                                        disableClearable
                                                        name="industry"
                                                        label={t('type_of_industry')}
                                                        options={industryList}
                                                        getOptionLabel={(option) => option.industry_name}
                                                        isOptionEqualToValue={(option, value) => option.industry_id == value.industry_id}
                                                        onChange={(e, value) => {
                                                            setValue('industry', { industry_id: value.industry_id, industry_name: value.industry_name });
                                                              setShowOtherIndustry(value.industry_id =='-1')
                                                        }}
                                                    />}
                                            </Grid>
                                            
                                            {showOtherIndustry &&
                                                <Grid item xs={12}>
                                                    <RHFTextField name="other_industry_name" label={t('other_industry_name_')} />
                                                </Grid>
                                            }

                                            <Grid item xs={6}>
                                                <RHFTextField name="cr_number" label={t('cr_number_')} />
                                            </Grid>

                                            <Grid item xs={6}>
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
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField name="vat_number" label={t('vat_number')} />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField name="authorized_contact" label={t('authorized_contact')} />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField name="billing_contact" label={t('billing_contact')} />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RHFTextField name="billing_email" label={t('billing_email')} />
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Box display={'flex'} flexDirection='column' alignItems={'center'}>
                                                    <RHFUpload
                                                        name="cr_media"
                                                        maxSize={5000000}
                                                        onDrop={(e) => handleDrop(e, 'CR_MEDIA')}
                                                        helperText={
                                                            <Typography variant="caption" sx={{ mx: 'auto', display: 'block', textAlign: 'center', color: 'text.secondary', }}>Allowed *.jpeg, *.jpg, *.png
                                                                <br /> max size of {fData(5000000)}</Typography>}
                                                        placeholder={<Box sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}><CloudUpload /> <Typography>{t('upload_your_cr')}</Typography></Box>}
                                                    />
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <RHFUpload
                                                    name="vat_certificate_media"
                                                    maxSize={5000000}
                                                    onDrop={(e) => handleDrop(e, 'VAT_MEDIA')}
                                                    helperText={
                                                        <Typography variant="caption" sx={{ mx: 'auto', display: 'block', textAlign: 'center', color: 'text.secondary', }}>Allowed *.jpeg, *.jpg, *.png
                                                            <br /> max size of {fData(5000000)}</Typography>}
                                                    placeholder={<Box sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}><CloudUpload /> <Typography>{t('upload_vat_certificate')}</Typography></Box>}
                                                />

                                            </Grid>

                                            <Grid item xs={12}>
                                                {isLoaded&&
                                                <>
                                                    <GoogleMap
                                                        id="google-map"
                                                        mapContainerStyle={{ width: '100%', height: '300px', marginBottom: 20,borderRadius:8 }}
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
                                                        {suggestions?.length > 0 && (
                                                            <List sx={{ position: 'absolute', bgcolor: "background.paper", zIndex: 99, left: 0, right: 0, border: "1px solid", borderColor: "divider" }}>
                                                                {suggestions.map((prediction) => (
                                                                    <ListItemButton key={prediction.place_id} onClick={() => selectSuggestion(prediction)}>
                                                                        <ListItemText primary={prediction.description} />
                                                                    </ListItemButton>
                                                                ))}
                                                            </List>
                                                        )}
                                                    </Box>
                                                </>}
                                            </Grid>

                                            <Grid item xs={12}>
                                                <RHFTextField   name="location_map" label={t('location')}  InputProps={{ disabled:true }}/>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <RHFTextField multiline rows={3} name="company_address" label={t('address')} />
                                            </Grid>

                                            {watch('otp_send') && (
                                                <Grid item xs={12}>
                                                    <RHFTextField
                                                        type="number"
                                                        name="otp"
                                                        label={t('one_time_password_')}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton onClick={() => sendOTP({ phone: watch('phone'), register_country_master_id: watch('register_country.register_country_master_id'), })}>
                                                                        <Typography variant="body2" fontWeight={'medium'} color={'primary'}>
                                                                            {t('resend_otp')}
                                                                        </Typography>
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                            )}

                                            <Grid item xs={12}>
                                                
                                                <Box display={'flex'} alignItems='center' gap={0.8} mb={1}>
                                                <RHFCheckbox name="isAgree" label={t('agree_to_the')} sx={{ m:0}} />
                                                <Link href={`/corporate-terms-conditions`} target="_blank" style={{ textDecoration: 'none' }}>
                                                <Typography variant='body2' fontWeight={'medium'} color='primary'>{t('corporate_terms_condition')}</Typography>
                                                </Link>
                                                </Box>
                                                <LoadingButton disabled={!watch('isAgree')} loading={loading} fullWidth variant="contained" onClick={handleSubmit(onSubmit)}>
                                                    {watch('otp_send') ? t('submit_request') : t('continue')}
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
