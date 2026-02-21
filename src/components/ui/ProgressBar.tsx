interface ProgressBarProps {
    current: number;
    total: number;
    colorClass?: string;
}

export function ProgressBar({ current, total, colorClass = "bg-primary" }: ProgressBarProps) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return (
        <div className="mb-4">
            <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                <span>Progress</span>
                <span>{current}/{total}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div className={`${colorClass} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}
