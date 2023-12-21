import PropTypes from 'prop-types';
import { createContext, useMemo, useState } from 'react';

AboutProvider.propTypes = {
    children: PropTypes.node,
};
const AboutContext = createContext();

function AboutProvider({ children,props }) {
    const [loading, setLoading] = useState(false);
  
    const seoInfo = props?.seoInfo || '';
    const aboutUsInfo = props?.aboutUsInfo || '';
    const featureList = props?.featureList ||[];
    const whyChooseList = props?.whyChooseList ||[];
    const benefitList = props?.benefitList ||[];
    const howItWorkList = props?.howItWorkList ||[];



    const memoizedValue = useMemo(() => (
        {
            seoInfo,
            loading,
            howItWorkList,
            benefitList,
            whyChooseList,
            featureList,
            aboutUsInfo
        }
    ),
        [loading,
            seoInfo,
            howItWorkList,
            benefitList,
            whyChooseList,
            featureList,
            aboutUsInfo
        ]
    );

    return <AboutContext.Provider value={memoizedValue}>{children}</AboutContext.Provider>;
}
export { AboutContext, AboutProvider };
