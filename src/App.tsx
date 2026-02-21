import { Header } from "./components/layout/Header";
import { KanbanBoard } from "../src/components/kanban/KanbanBoard";
import { KanbanProvider } from "./context/KanbanContext";

export default function App() {
    return (
        <KanbanProvider>
            <Header />
            <main className="flex-1 overflow-x-auto overflow-y-hidden p-8">
                <KanbanBoard />
            </main>
        </KanbanProvider>
    );
}
