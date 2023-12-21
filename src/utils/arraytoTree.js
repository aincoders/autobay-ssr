import { useSettingsContext } from '../components/settings';

export function arrayToTreeSparePartCategoryMaster(
    arr,
    parent = '0',
    link = 'spare_part_category_parent_id'
) {
    return arr
        .filter((item) => item[link] === parent)
        .map((child) => ({
            ...child,
            space: child.spare_part_category_parent_id !== '0',
            children: arrayToTreeSparePartCategoryMaster(arr, child.spare_part_category_id),
        }));
}

export function arrayToTreePackageCategoryMaster(
    arr,
    parent = '0',
    link = 'package_category_parent_id'
) {
    return arr
        .filter((item) => item[link] === parent)
        .map((child) => ({
            ...child,
            space: child.package_category_parent_id !== '0',
            children: arrayToTreePackageCategoryMaster(arr, child.package_category_id),
        }));
}

export const slugify = (string) => string.toLowerCase().replace(/\s+/g, '-');

export const isEven = (num) => num % 2 === 0;

export function replaceString(value = '') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { currentCity, currentVehicle } = useSettingsContext();

    const replaceMap = {
        $CITY_NAME: currentCity?.city_name || "",
        $VEHICLE_MODEL_NAME: currentVehicle?.model ? currentVehicle?.model?.vehicle_model_name : '',
    };

    return value.replace(/\$CITY_NAME|\$VEHICLE_MODEL_NAME/g, (matched) => replaceMap[matched]);
}
