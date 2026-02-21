import React, { createContext, useContext, useState, useMemo } from 'react';
import { useKanban } from '../hooks/useKanban';
import { BoardState, Task, TaskPriority } from '../types/kanban';

interface KanbanContextType {
    board: BoardState;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredTasks: Record<string, Task>;
    // Board actions
    addColumn: (title: string, colorClass?: string) => void;
    renameColumn: (colId: string, newTitle: string) => void;
    deleteColumn: (colId: string) => void;
    addTask: (newTaskData: Omit<Task, 'id'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleSubTask: (taskId: string, subTaskId: string) => void;
    addSubTask: (taskId: string, subTaskTitle: string) => void;
    deleteSubTask: (taskId: string, subTaskId: string) => void;
    updateTaskPriority: (taskId: string, priority: TaskPriority) => void;
    updateTaskDueDate: (taskId: string, dueDate: string) => void;
    moveTask: (taskId: string, sourceColId: string, destColId: string, sourceIdx: number, destIdx: number) => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: React.ReactNode }) {
    const kanban = useKanban();
    const [searchQuery, setSearchQuery] = useState("");

    // Computation for the search engine (Derived state)
    const filteredTasks = useMemo(() => {
        if (!searchQuery.trim()) return kanban.board.tasks;

        const lowerQuery = searchQuery.toLowerCase();
        const filtered: Record<string, Task> = {};

        for (const [id, task] of Object.entries(kanban.board.tasks)) {
            if (
                task.title.toLowerCase().includes(lowerQuery) ||
                task.description.toLowerCase().includes(lowerQuery)
            ) {
                filtered[id] = task;
            }
        }
        return filtered;
    }, [kanban.board.tasks, searchQuery]);

    const value: KanbanContextType = {
        ...kanban,
        searchQuery,
        setSearchQuery,
        filteredTasks
    };

    return (
        <KanbanContext.Provider value={value}>
            {children}
        </KanbanContext.Provider>
    );
}

export function useKanbanContext() {
    const context = useContext(KanbanContext);
    if (context === undefined) {
        throw new Error('useKanbanContext must be used within a KanbanProvider');
    }
    return context;
}
