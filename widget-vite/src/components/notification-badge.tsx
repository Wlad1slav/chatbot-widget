import { getStyle } from "../utils/styles";
import type { Theme } from "../utils/types";

export default function NotificationBadge({theme}: {theme: Theme}) {
    return (
        <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center animate-pulse ${getStyle(theme, "notifyBadge")}`}>
          <span className="text-xs font-bold">1</span>
        </div>
    )
}