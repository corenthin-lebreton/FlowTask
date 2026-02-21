import { memo, ReactNode, useState, useRef, useEffect } from "react";
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps { id: string; title: string; count: number; colorClass: string; taskIds: string[]; children: ReactNode; onAddTask?: (colId: string) => void; onRename?: (colId: string) => void; onDelete?: (colId: string) => void; }

const DropdownMenu = ({ id, isOpen, setIsOpen, onRename, onDelete, dropdownRef }: any) => {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        }
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className={`text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md ${isOpen ? 'bg-slate-100 dark:bg-slate-800' : ''}`}><span className="material-symbols-outlined text-xl leading-none">more_horiz</span></button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20 overflow-hidden py-1 animate-in fade-in zoom-in duration-100 origin-top-right">
                    <button onClick={() => { setIsOpen(false); onRename?.(id); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">edit</span>Modifier le nom</button>
                    <button onClick={() => { setIsOpen(false); onDelete?.(id); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">delete</span>Supprimer</button>
                </div>
            )}
        </div>
    );
};

const ColumnHeader = ({ id, title, count, colorClass, onRename, onDelete }: any) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                <h2 className="text-base font-bold text-slate-700 dark:text-slate-200">{title}</h2>
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
            </div>
            <DropdownMenu id={id} isOpen={isDropdownOpen} setIsOpen={setIsDropdownOpen} onRename={onRename} onDelete={onDelete} dropdownRef={dropdownRef} />
        </div>
    );
};

export const KanbanColumn = memo(function KanbanColumn({ id, title, count, colorClass, taskIds, children, onAddTask, onRename, onDelete }: KanbanColumnProps) {
    const { isOver, setNodeRef } = useDroppable({ id, data: { type: 'Column', columnId: id } });

    return (
        <div className="flex flex-col w-1/3 min-w-[320px] max-w-[400px] h-full">
            <ColumnHeader id={id} title={title} count={count} colorClass={colorClass} onRename={onRename} onDelete={onDelete} />
            <div ref={setNodeRef} className={`flex-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar border border-slate-200/50 dark:border-slate-700/50 transition-all ${isOver ? 'ring-2 ring-primary/50' : ''}`}>
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {children}
                </SortableContext>
            </div>
            <button onClick={() => onAddTask?.(id)} className="mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 hover:bg-slate-50 text-sm font-medium"><span className="material-symbols-outlined text-lg">add</span>Ajouter une tâche</button>
        </div>
    );
});
