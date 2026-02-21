interface BadgeProps {
    label: string;
    variant?: 'crucial' | 'important' | 'high' | 'medium' | 'low' | 'done' | 'default';
    icon?: string;
}

export function Badge({ label, variant = 'default', icon }: BadgeProps) {
    let classes = "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300";

    if (variant === 'crucial') {
        classes = "bg-red-500 dark:bg-red-900/40 text-white dark:text-red-200"; // Crucial : Rouge
    } else if (variant === 'important') {
        classes = "bg-orange-400 dark:bg-orange-900/40 text-white dark:text-orange-200"; // Important : Orange
    } else if (variant === 'high') {
        classes = "bg-rose-400 dark:bg-rose-900/40 text-white dark:text-rose-200"; // Haute
    } else if (variant === 'medium') {
        classes = "bg-amber-400 dark:bg-amber-900/40 text-white dark:text-amber-200"; // Moyenne : Jaune
    } else if (variant === 'low') {
        classes = "bg-blue-400 dark:bg-blue-900/40 text-white dark:text-blue-200"; // Basse : Bleu
    } else if (variant === 'done') {
        classes = "bg-emerald-500 dark:bg-emerald-900/40 text-white dark:text-emerald-200";
    }

    return (
        <span className={`${classes} text-xs font-semibold px-2.5 py-1 flex items-center gap-1 w-fit rounded`}>
            {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
            {label}
        </span>
    );
}
