import { useEffect } from 'react';

export function useFbIosWebviewClass() {
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent;
      const isFbWebview = /FBAN|FBAV|Instagram/.test(ua);
      const isIOS = /iP(hone|ad|od)/.test(ua);

      if (isFbWebview && isIOS) {
        document.documentElement.classList.add('fb-ios-webview');
      }
    }
  }, []);
}
