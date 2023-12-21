import { Search } from '@mui/icons-material';
import { Autocomplete, Card, InputAdornment, Link, MenuItem, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'src/components/image';
import SearchNotFound from 'src/components/search-not-found';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import { SEARCH_PACKAGE } from 'src/utils/constant';

export default function Searchbar() {
    const { getApiData } = useApi();
    const { currentCity, currentVehicle } = useSettingsContext();
    const { make, model } = currentVehicle

    const controller = new AbortController();
    const { signal } = controller;
    const router = useRouter();

    const [searchProducts, setSearchProducts] = useState('');
    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(true);

    async function GetList() {
        try{
            setLoading(true);
            const params = { search_keyword: searchProducts };
            const response = await getApiData(SEARCH_PACKAGE, params, signal);
            if (response) {
                const data = response.data.result;
                setLoading(false);
                setResponseList(data);
            }
        }catch(error){

        }
    }
    useEffect(() => {
        if (searchProducts) {
            GetList();
        }
        return () => {
            controller.abort();
        };
    }, [searchProducts]);

    const handleGotoProduct = (option) => {
        const getUrl = `/${currentCity.slug}/${option.slug_url}/${model ? model.vehicle_model_slug : (make && make.vehicle_make_slug)}`;
        setResponseList([]);
        setSearchProducts('');
        router.push(`/[city]/[...category]?packageDetailSlug=true`, getUrl);
    };

    const handleKeyUp = (event, value) => {
        if (event.key === 'Enter') {
            setSearchProducts('');
            // handleGotoProduct(searchProducts);
        }
    };

    return (
        <>
            <Autocomplete
                sx={{ flex: 0.5 }}
                size="small"
                popupIcon={null}
                options={responseList}
                onInputChange={(event, value) => setSearchProducts(value)}
                getOptionLabel={(option) => option.service_group_name}
                noOptionsText={<SearchNotFound query={searchProducts} loading={loading} />}
                isOptionEqualToValue={(option, value) =>
                    option.service_group_name === value.service_group_name
                }
                renderInput={(params) => (
                    <Card>
                        <TextField
                            {...params}
                            width={'100%'}
                            placeholder={t('search')}
                            onKeyUp={handleKeyUp}
                            variant="outlined"
                            sx={{
                                borderRadius: 20,
                                '& fieldset': { border: 'none' },
                            }}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize="small" sx={{ color: 'text.disabled' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Card>
                )}
                renderOption={(props, option, { inputValue }) => {
                    const { service_group_name, media_url, media_url_alt, slug_url } = option;
                    // const matches = match(service_group_name, inputValue, { insideWords: true });
                    // const parts = parse(service_group_name, matches);
                    return (
                        <MenuItem {...props} onClick={() => handleGotoProduct(option)}>
                            <Image
                                alt={media_url_alt}
                                src={media_url}
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 1,
                                    flexShrink: 0,
                                    mr: 1.5,
                                }}
                            />
                            <Link underline="none">
                                <Typography
                                    component="span"
                                    variant="subtitle2"
                                    color={'text.primary'}
                                >
                                    {service_group_name}
                                </Typography>
                            </Link>
                        </MenuItem>
                    );
                }}
            />
        </>
    );
}
