import { useKanbanContext } from "../../context/KanbanContext";
import { useTheme } from "../../hooks/useTheme";

export function Header() {
    const { searchQuery, setSearchQuery, addColumn } = useKanbanContext();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleAddCategory = () => {
        const title = window.prompt("Nom de la catégorie:");
        if (title && title.trim()) {
            addColumn(title.trim());
        }
    };

    return (
        <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">grid_view</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">FlowTask</h1>
            </div>

            <div className="flex items-center gap-6">
                {/* Dark Mode Toggle Switch - Animated & Detailed */}
                <button
                    onClick={toggleTheme}
                    className="relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-700 transition-colors duration-300 ease-in-out hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75 shadow-inner overflow-hidden"
                    role="switch"
                    aria-checked={isDarkMode}
                    title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
                >
                    <span className="sr-only">Thème</span>

                    {/* Left/Right Background Decals (Static) */}
                    <span className="absolute inset-0 flex h-full w-full items-center justify-between px-1.5 pointer-events-none">
                        <span className={`material-symbols-outlined text-[15px] transition-opacity duration-300 ${isDarkMode ? 'opacity-100 text-slate-400' : 'opacity-0'}`}>
                            dark_mode
                        </span>
                        <span className={`material-symbols-outlined text-[15px] transition-opacity duration-300 ${!isDarkMode ? 'opacity-100 text-slate-400' : 'opacity-0'}`}>
                            light_mode
                        </span>
                    </span>

                    {/* Sliding Thumb and Rotating Icon */}
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute left-0 flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-md ring-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDarkMode ? 'translate-x-[32px]' : 'translate-x-0'
                            }`}
                    >
                        {/* Sun Icon (rotates out when dark mode) */}
                        <span
                            className={`material-symbols-outlined text-[16px] absolute transition-all duration-500 text-amber-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDarkMode ? '-rotate-180 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'
                                }`}
                        >
                            light_mode
                        </span>
                        {/* Moon Icon (rotates in when dark mode) */}
                        <span
                            className={`material-symbols-outlined text-[16px] absolute transition-all duration-500 text-indigo-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDarkMode ? 'rotate-0 opacity-100 scale-100' : 'rotate-180 opacity-0 scale-50'
                                }`}
                        >
                            dark_mode
                        </span>
                    </span>
                </button>

                <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 w-64 border border-transparent focus-within:border-primary/50 transition-colors">
                    <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                    <input
                        className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 dark:text-slate-200 placeholder-slate-400"
                        placeholder="Rechercher une tâche..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="h-8 w-8 rounded-full bg-primary/20 overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf4Mq2zq0zNEc3bTtMZw5ErgTWYJjDk4lzsbujg0jG29Yl9a_SwFNWBgQFt1hbt_c1t0ILgsvysT7lHDJFrr-e-dE87sP8wheYoYC0gMy4LQ25KENE5GxZwnGmaAeB31SHH8p00hWL8Xe_kOSVp0Ee4U2M_cG1eL-5cWE9xoU2Tmdyw78a6DTK59OfYL_0RNUhfZFuNK9zv3_q3JIhkbwENI2G19NgwC87KnVhd0D-NIv7xTcrw6hvg6wQj26C4zKSK6n0wWrIjdTU" />
                </div>

                <button
                    onClick={handleAddCategory}
                    className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 transition-all shadow-md shadow-primary/20"
                >
                    <span className="material-symbols-outlined text-xl">add</span>
                    <span>Nouvelle Catégorie</span>
                </button>
            </div>
        </header>
    );
}
