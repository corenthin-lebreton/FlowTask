interface AvatarGroupProps {
    avatars: string[];
    max?: number;
}

export function AvatarGroup({ avatars, max = 3 }: AvatarGroupProps) {
    const displayAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    return (
        <div className="flex -space-x-2">
            {displayAvatars.map((url, i) => (
                <img
                    key={i}
                    alt={`Avatar ${i + 1}`}
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                    src={url}
                />
            ))}
            {remainingCount > 0 && (
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}
