import { memo } from "react";
import { AvatarGroup } from "../ui/AvatarGroup";
import { Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";
import { Task } from "../../types/kanban";

interface TaskCardProps { task: Task; columnTitle: string; onClick?: (id: string) => void; onDelete?: (id: string) => void; }

const PRIORITY_MAP: Record<string, { label: string; variant: any }> = {
    'Crucial': { label: 'Priorité Cruciale', variant: 'crucial' },
    'Important': { label: 'Priorité Importante', variant: 'important' },
    'Haute': { label: 'Priorité Haute', variant: 'high' },
    'Moyenne': { label: 'Priorité Moyenne', variant: 'medium' },
    'Basse': { label: 'Priorité Basse', variant: 'low' },
};

const getBadgeProps = (priority: string, isCompleted: boolean) => {
    if (isCompleted) return { label: 'Terminé', variant: 'done' as const, icon: "check" };
    const conf = PRIORITY_MAP[priority] || PRIORITY_MAP['Moyenne'];
    return { label: conf.label, variant: conf.variant, icon: undefined };
};

const CardHeader = ({ isCompleted, priority, onDelete, id }: any) => {
    const badgeProps = getBadgeProps(priority, isCompleted);
    return (
        <div className="flex justify-between items-start mb-3">
            <Badge {...badgeProps} />
            <button onClick={(e) => { e.stopPropagation(); onDelete?.(id); }} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1 -mr-2 -mt-2" title="Supprimer">
                <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
        </div>
    );
};

const CardFooter = ({ isCompleted, avatars }: any) => (
    <div className={`flex items-center ${avatars || !isCompleted ? 'justify-between' : 'justify-start'} pt-3 border-t border-slate-100 dark:border-slate-700`}>
        {isCompleted ? <div className="text-xs text-slate-400 font-medium line-through">Terminé</div> :
            avatars ? <AvatarGroup avatars={avatars} /> :
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium"><span className="material-symbols-outlined text-sm">schedule</span><span>Bientôt</span></div>}
    </div>
);

const RegularCard = ({ task, isCompleted, onClick, onDelete }: any) => {
    const { id, title, description, priority, subTasks, dueDate, avatars, tags } = task;
    const subsDone = subTasks.filter((s: any) => s.isCompleted).length;

    return (
        <div onClick={(e) => { e.stopPropagation(); onClick?.(id); }} className={`group bg-white dark:bg-slate-800 p-5 rounded-xl shadow-soft border border-slate-100 dark:border-slate-700 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 ${isCompleted ? 'opacity-75 hover:opacity-100' : ''}`}>
            <CardHeader isCompleted={isCompleted} priority={priority} onDelete={onDelete} id={id} />
            <h3 className={`text-slate-900 dark:text-white font-semibold text-lg leading-tight mb-2 ${isCompleted ? 'line-through decoration-slate-400 decoration-2' : ''}`}>{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{description}</p>
            {dueDate && <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 bg-slate-50 dark:bg-slate-800/50 w-fit px-2 py-1 rounded"><span className="material-symbols-outlined text-[14px]">event</span><span>{new Date(dueDate).toLocaleDateString()}</span></div>}
            {tags && tags.length > 0 && <div className="flex gap-2 mb-4 flex-wrap">{tags.map((t: string, i: number) => <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs">{t}</span>)}</div>}
            {subTasks.length > 0 && <ProgressBar current={subsDone} total={subTasks.length} colorClass={isCompleted ? "bg-emerald-500" : "bg-primary"} />}
            <CardFooter isCompleted={isCompleted} avatars={avatars} />
        </div>
    );
};

const ImageCard = ({ task, isCompleted, onClick }: any) => {
    const badgeProps = getBadgeProps(task.priority, isCompleted);
    const subsDone = task.subTasks.filter((s: any) => s.isCompleted).length;

    return (
        <div onClick={(e) => { e.stopPropagation(); onClick?.(task.id); }} className="group bg-white dark:bg-slate-800 p-0 rounded-xl shadow-soft border border-slate-100 dark:border-slate-700 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 overflow-hidden">
            <div className="h-32 w-full bg-slate-200 relative">
                <img className="w-full h-full object-cover" alt="Cover" src={task.imageUrl} />
                <div className="absolute top-3 left-3"><span className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm bg-opacity-90">{badgeProps.label}</span></div>
            </div>
            <div className="p-5">
                <h3 className="text-slate-900 dark:text-white font-semibold text-lg leading-tight mb-2">{task.title}</h3>
                {task.subTasks.length > 0 && <ProgressBar current={subsDone} total={task.subTasks.length} colorClass={isCompleted ? "bg-emerald-500" : "bg-primary"} />}
                <CardFooter isCompleted={isCompleted} avatars={task.avatars} />
            </div>
        </div>
    );
};

export const TaskCard = memo(function TaskCard({ task, columnTitle, onClick, onDelete }: TaskCardProps) {
    const isCompleted = columnTitle === 'Terminé';
    if (task.imageUrl) return <ImageCard task={task} isCompleted={isCompleted} onClick={onClick} />;
    return <RegularCard task={task} isCompleted={isCompleted} onClick={onClick} onDelete={onDelete} />;
});
