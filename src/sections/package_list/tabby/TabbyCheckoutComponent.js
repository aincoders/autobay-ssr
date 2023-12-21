import { useEffect } from 'react';
import { useLocales } from 'src/locales';

export default function TabbyCheckoutComponent({  Price = '' }) {
    const {currentLang} = useLocales()

  useEffect(() => {
    // Load Tabby script
    const script = document.createElement('script');
    script.src = 'https://checkout.tabby.ai/tabby-card.js';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Tabby
    script.onload = () => {
      new TabbyCard({
        selector: `#tabbyCard`,
        currency: 'BHD',
        lang: currentLang.value,
        price: Price,
        size:"wide",
        header: false
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="tabbyCard"></div>;
}