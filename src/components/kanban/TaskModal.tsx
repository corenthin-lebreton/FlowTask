import { useState, useEffect } from "react";
import { Task, TaskPriority } from "../../types/kanban";
import { Badge } from "../ui/Badge";

interface TaskModalProps { task: Task; columnTitle: string; isOpen: boolean; onClose: () => void; onChangeTitle: (id: string, title: string) => void; onChangeDescription: (id: string, desc: string) => void; onToggleSubtask: (taskId: string, subId: string) => void; onChangePriority?: (taskId: string, p: TaskPriority) => void; onAddSubtask?: (taskId: string, t: string) => void; onDeleteSubtask?: (taskId: string, subId: string) => void; onChangeDueDate?: (taskId: string, d: string) => void; }

const PRIORITY_OPTS = ['Basse', 'Moyenne', 'Haute', 'Important', 'Crucial'];
const PRIORITY_VARIANTS: Record<string, any> = { Crucial: 'crucial', Important: 'important', Haute: 'high', Basse: 'low', Moyenne: 'medium' };

const Header = ({ onClose }: any) => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">inventory_2</span><span className="text-sm font-medium text-slate-500">Edition Tâche</span></div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1"><span className="material-symbols-outlined text-2xl">close</span></button>
    </div>
);

const TitleSection = ({ task, title, setTitle, onChangeTitle, columnTitle, onChangePriority, dueDate, setDueDate, onChangeDueDate }: any) => (
    <div>
        <input type="text" className="w-full text-2xl font-bold text-slate-900 dark:text-white bg-transparent border-0 border-b-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary focus:ring-0 px-0 pb-1" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => onChangeTitle(task.id, title)} placeholder="Titre de la tâche..." />
        <div className="flex items-center gap-4 mt-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Catégorie <span className="text-primary">{columnTitle}</span></div>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Priorité</span>
                    <select className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 border-none outline-none cursor-pointer p-0" value={task.priority} onChange={(e) => onChangePriority?.(task.id, e.target.value)}>
                        {PRIORITY_OPTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <Badge label="" variant={PRIORITY_VARIANTS[task.priority] || 'medium'} />
                </div>
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Échéance</span>
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                        <span className="material-symbols-outlined text-[16px] text-slate-400 mr-1.5">event</span>
                        <input type="date" className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 border-none outline-none cursor-pointer p-0" value={dueDate} onChange={(e) => { setDueDate(e.target.value); onChangeDueDate?.(task.id, e.target.value); }} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const DescSection = ({ description, setDescription, onBlurDesc }: any) => (
    <div>
        <div className="flex items-center gap-2 mb-3"><span className="material-symbols-outlined text-slate-400 text-xl">subject</span><h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Description</h3></div>
        <textarea className="w-full min-h-[120px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y" value={description} onChange={(e) => setDescription(e.target.value)} onBlur={onBlurDesc} placeholder="Ajouter une description..." />
    </div>
);

const SubtasksSection = ({ task, onToggleSubtask, onDeleteSubtask, onAddSubtask, newSubtaskTitle, setNewSubtaskTitle }: any) => {
    const total = task.subTasks.length;
    const progress = total > 0 ? Math.round((task.subTasks.filter((s: any) => s.isCompleted).length / total) * 100) : 0;
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400 text-xl">checklist</span><h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Sous-tâches</h3></div>
                {total > 0 && <span className="text-xs font-medium text-slate-500">{progress}% Terminées</span>}
            </div>
            {total > 0 && <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-4 overflow-hidden"><div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div></div>}
            <div className="space-y-2">
                {task.subTasks.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between gap-3 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                            <input type="checkbox" className="peer size-5 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700" checked={s.isCompleted} onChange={() => onToggleSubtask(task.id, s.id)} />
                            <span className={`text-sm transition-colors ${s.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{s.title}</span>
                        </label>
                        <button onClick={(e) => { e.preventDefault(); onDeleteSubtask?.(task.id, s.id); }} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1"><span className="material-symbols-outlined text-lg">delete</span></button>
                    </div>
                ))}
            </div>
            <form className="flex gap-2 mt-3" onSubmit={(e) => { e.preventDefault(); if (newSubtaskTitle.trim()) { onAddSubtask?.(task.id, newSubtaskTitle.trim()); setNewSubtaskTitle(""); } }}>
                <input type="text" className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-700 dark:text-slate-300 focus:ring-primary" placeholder="Ajouter une sous-tâche..." value={newSubtaskTitle} onChange={(e) => setNewSubtaskTitle(e.target.value)} />
                <button type="submit" disabled={!newSubtaskTitle.trim()} className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-2 rounded-lg disabled:opacity-50 flex items-center"><span className="material-symbols-outlined text-lg">add</span></button>
            </form>
        </div>
    );
};

export function TaskModal({ task, columnTitle, isOpen, onClose, onChangeTitle, onChangeDescription, onToggleSubtask, onChangePriority, onAddSubtask, onDeleteSubtask, onChangeDueDate }: TaskModalProps) {
    const [title, setTitle] = useState(task.title);
    const [desc, setDesc] = useState(task.description);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [dueDate, setDueDate] = useState(task.dueDate || "");

    useEffect(() => { setTitle(task.title); setDesc(task.description); setDueDate(task.dueDate || ""); }, [task]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg h-full shadow-2xl flex flex-col animate-[slideIn_0.2s_ease-out]">
                <Header onClose={onClose} />
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    <TitleSection task={task} title={title} setTitle={setTitle} onChangeTitle={onChangeTitle} columnTitle={columnTitle} onChangePriority={onChangePriority} dueDate={dueDate} setDueDate={setDueDate} onChangeDueDate={onChangeDueDate} />
                    <DescSection description={desc} setDescription={setDesc} onBlurDesc={() => onChangeDescription(task.id, desc)} />
                    <SubtasksSection task={task} onToggleSubtask={onToggleSubtask} onDeleteSubtask={onDeleteSubtask} onAddSubtask={onAddSubtask} newSubtaskTitle={newSubtaskTitle} setNewSubtaskTitle={setNewSubtaskTitle} />
                </div>
            </div>
            <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        </div>
    );
}
