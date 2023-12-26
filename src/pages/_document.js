import { getInitColorSchemeScript } from '@mui/material';
import { documentGetInitialProps, DocumentHeadTags } from '@mui/material-nextjs/v13-pagesRouter';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import palette from '../theme/palette';
import { primaryFont } from '../theme/typography';

export default class MyDocument extends Document {
    render() {
        return (
            <Html className={primaryFont.className}>
                <Head>
                    <DocumentHeadTags {...this.props} />
                    {/* <link rel="manifest" href="/manifest.json" /> */}
                    <meta name="theme-color" content={palette.light.primary.main} />
                    <meta name="author" content="Aincoders" />
                    <link rel="stylesheet" href="/assets/css/index.css" />
                </Head>

                <body>
                    {getInitColorSchemeScript()}
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

MyDocument.getInitialProps = documentGetInitialProps;
