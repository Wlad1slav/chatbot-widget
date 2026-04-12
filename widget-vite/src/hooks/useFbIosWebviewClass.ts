import { useMemo } from "react";

export function useFbIosWebviewClass() {
  return useMemo(() => {
    if (typeof navigator === "undefined") return false;

    const ua = navigator.userAgent;
    const isFbWebview = /FBAN|FBAV|Instagram/.test(ua);
    const isIOS = /iP(hone|ad|od)/.test(ua);

    return isFbWebview && isIOS;
  }, []);
}
