'use client';

import NProgress from 'nprogress';
import { Suspense, useEffect } from 'react';


import { useRouter } from 'next/router';

import StyledProgressBar from './styles';

// ----------------------------------------------------------------------

export default function ProgressBar() {
  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleAnchorClick = (event) => {
      const targetUrl = event.currentTarget.href;

      const currentUrl = window.location.href;

      if (targetUrl !== currentUrl) {
        NProgress.start();
      }
    };

    const handleMutation = () => {
      const anchorElements = document.querySelectorAll('a[href]');

      const filteredAnchors = Array.from(anchorElements).filter((element) => {
        const href = element.getAttribute('href');
        return href && href.startsWith('/');
      });

      filteredAnchors.forEach((anchor) => anchor.addEventListener('click', handleAnchorClick));
    };

    const mutationObserver = new MutationObserver(handleMutation);

    mutationObserver.observe(document, { childList: true, subtree: true });

    window.history.pushState = new Proxy(window.history.pushState, {
      apply: (target, thisArg, argArray) => {
        NProgress.done();
        return target.apply(thisArg, argArray);
      },
    });
  });

  return (
    <>
      <StyledProgressBar />

      <Suspense fallback={null}>
        <NProgressDone />
      </Suspense>
    </>
  );
}

// ----------------------------------------------------------------------

function NProgressDone() {
    
    const router = useRouter();
    const pathname = router.pathname;

  const searchParams = router.query;

  useEffect(() => {
    NProgress.done();
  }, [pathname, router, searchParams]);

  return null;
}
