import { useState, useEffect, useMemo } from 'react';
import { Task, BoardState, TaskPriority } from '../types/kanban';
import { createColumn, createTask, updateTaskInList, removeTaskFromList, moveTaskInBoard, toggleSubTaskInList, addSubTaskToList, deleteSubTaskFromList, changeTaskPriority, renameColumnInBoard, removeColumnFromBoard, setTaskDueDate } from '../utils/boardUtils';
import { isValidBoardState } from '../utils/validationUtils';

const STORAGE_KEY = `${import.meta.env.MODE}_kanban_data`;

const INITIAL_STATE: BoardState = {
    columns: [
        { id: 'col-todo', title: 'À faire', colorClass: 'bg-red-500', taskIds: [] },
        { id: 'col-inprogress', title: 'En cours', colorClass: 'bg-primary', taskIds: [] },
        { id: 'col-done', title: 'Terminé', colorClass: 'bg-emerald-500', taskIds: [] }
    ],
    tasks: {}
};

function migrateV1toV1_1(oldTasks: any[]): BoardState {
    const newState = JSON.parse(JSON.stringify(INITIAL_STATE)) as BoardState;
    const map: Record<string, string> = { 'À faire': 'col-todo', 'En cours': 'col-inprogress', 'Terminé': 'col-done' };

    oldTasks.forEach(task => {
        if (!task?.id || typeof task.status !== 'string') return;
        const colId = map[task.status] || 'col-todo';
        const { status, ...rest } = task;
        newState.tasks[task.id] = { ...rest, columnId: colId } as Task;
        newState.columns.find(c => c.id === colId)?.taskIds.push(task.id);
    });
    return newState;
}

function initBoardState(key: string): BoardState {
    try {
        const data = localStorage.getItem(key);
        if (!data) return INITIAL_STATE;
        const parsed = JSON.parse(data);
        if (isValidBoardState(parsed)) return parsed;
        if (Array.isArray(parsed)) return migrateV1toV1_1(parsed);
        return INITIAL_STATE;
    } catch { return INITIAL_STATE; }
}

function useBoardActions(setBoard: React.Dispatch<React.SetStateAction<BoardState>>) {
    return useMemo(() => ({
        addColumn: (title: string, colorClass = 'bg-slate-500') => setBoard(p => createColumn(p, title, colorClass)),
        renameColumn: (id: string, title: string) => setBoard(p => renameColumnInBoard(p, id, title)),
        deleteColumn: (id: string) => setBoard(p => removeColumnFromBoard(p, id)),
        addTask: (t: Omit<Task, 'id'>) => setBoard(p => createTask(p, t)),
        updateTask: (id: string, updates: Partial<Task>) => setBoard(p => updateTaskInList(p, id, updates)),
        deleteTask: (id: string) => setBoard(p => removeTaskFromList(p, id)),
        toggleSubTask: (tId: string, sId: string) => setBoard(p => toggleSubTaskInList(p, tId, sId)),
        addSubTask: (tId: string, m: string) => setBoard(p => addSubTaskToList(p, tId, m)),
        deleteSubTask: (tId: string, sId: string) => setBoard(p => deleteSubTaskFromList(p, tId, sId)),
        updateTaskPriority: (tId: string, priority: TaskPriority) => setBoard(p => changeTaskPriority(p, tId, priority)),
        updateTaskDueDate: (tId: string, d: string) => setBoard(p => setTaskDueDate(p, tId, d)),
        moveTask: (t: string, sC: string, dC: string, sI: number, dI: number) => setBoard(p => moveTaskInBoard(p, t, sC, dC, sI, dI))
    }), [setBoard]);
}

export function useKanban() {
    const [board, setBoard] = useState<BoardState>(() => initBoardState(STORAGE_KEY));

    useEffect(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(board)); }
        catch (e) { console.error(e); }
    }, [board]);

    const actions = useBoardActions(setBoard);
    return { board, ...actions };
}
