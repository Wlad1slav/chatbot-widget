export default function NotificationBadge() {
    return (
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-white text-xs font-bold">1</span>
        </div>
    )
}