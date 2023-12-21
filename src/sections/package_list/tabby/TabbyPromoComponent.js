import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useLocales } from 'src/locales';

export default function TabbyPromoComponent({ referenceID = '', Price = '' }) {
    const {currentLang} = useLocales()

  useEffect(() => {
    // Load Tabby script
    const script = document.createElement('script');
    script.src = 'https://checkout.tabby.ai/tabby-promo.js';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Tabby
    script.onload = () => {
      new TabbyPromo({
        selector: `#TabbyPromo-${referenceID}`,
        currency: 'BHD',
        price: Price,
        installmentsCount: 4,
        lang: currentLang.value,
        source: 'product',
        publicKey: process.env.NEXT_PUBLIC_TABBY_KEY,
        merchantCode: 'AutoBaybhr',
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id={`TabbyPromo-${referenceID}`}></div>;
}