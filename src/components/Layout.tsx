import { Settings } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTabStore } from "@/stores/tab";
import { useModeStore } from "@/stores/mode";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useTimersStore } from "@/stores/timers";
import { useTasksStore } from "@/stores/tasks";
import { useNutritionStore } from "@/stores/nutrition";
import { useCountersStore } from "@/stores/counters";
import { useNotesStore } from "@/stores/notes";
import { useHabitsStore } from "@/stores/habits";
import React from "react";

function LeftBar() {
  const { tabs, activeTabId, setActiveTab } = useTabStore();
  const modeStore = useModeStore();
  const mode = modeStore.modes.find((m) => m.id === modeStore.activeModeId);

  // Dynamically get the icon component from LucideIcons using the icon string
  const ModeIcon =
    mode?.icon &&
    (LucideIcons as unknown as Record<string, React.ElementType>)[mode.icon]
      ? (LucideIcons as unknown as Record<string, React.ElementType>)[mode.icon]
      : LucideIcons["Circle"];

  return (
    <div className="flex flex-col border h-full w-[2.5%] gap-2 items-center justify-between py-2 bg-background">
      <div className="flex flex-col gap-2">
        {tabs
          .filter((tab) => !tab.deleted)
          .map((tab) => {
            const IconComponent =
              (LucideIcons as unknown as Record<string, React.ElementType>)[
                tab.icon
              ] || LucideIcons["Circle"];
            return (
              <Tooltip key={tab.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant={
                      activeTabId === (tab.id ?? tab.label)
                        ? "default"
                        : "outline"
                    }
                    size="icon"
                    onClick={() => setActiveTab(tab.id ?? tab.label)}
                  >
                    <IconComponent />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{tab.label}</TooltipContent>
              </Tooltip>
            );
          })}
      </div>
      <div className="flex flex-col gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const indexOfMode = modeStore.modes.findIndex(
                  (m) => m.id === modeStore.activeModeId
                );
                modeStore.setActiveMode(
                  modeStore.modes[indexOfMode + 1]?.id || modeStore.modes[0].id
                );
              }}
            >
              <ModeIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Mode</TooltipContent>
        </Tooltip>
        <Tooltip>
          <Dialog>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings />
                </Button>
              </TooltipTrigger>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full">
              <DialogTitle>Settings</DialogTitle>
              <div className="py-8 text-center text-lg text-muted-foreground">
                Settings content goes here.
              </div>
            </DialogContent>
          </Dialog>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function BottomBar() {
  // Timer
  const { sessions } = useTimersStore();
  const runningSession = sessions.find((s) => !s.end && !s.deleted);
  const [timerNow, setTimerNow] = useState(Date.now());

  React.useEffect(() => {
    if (!runningSession) return;
    const interval = setInterval(() => setTimerNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [runningSession]);

  let timerDisplay = "--:--:--";
  if (runningSession) {
    const start = new Date(runningSession.start).getTime();
    const elapsed = Math.floor((timerNow - start) / 1000);
    const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
    const s = String(elapsed % 60).padStart(2, "0");
    timerDisplay = `${h}:${m}:${s}`;
  }

  // Hydration (counter named 'Hydration')
  const { counters } = useCountersStore();
  const hydration = counters.find(
    (c) => c.name.toLowerCase() === "hydration" && !c.deleted
  );
  const hydrationValue = hydration?.value ?? 0;
  // Optionally, set a goal (e.g., 8)
  const hydrationGoal = 8;

  // Calories (today's nutrition entries)
  const { entries } = useNutritionStore();
  const today = new Date().toISOString().split("T")[0];
  const todayCalories = entries
    .filter((e) => e.date.startsWith(today) && !e.deleted)
    .reduce((sum, e) => sum + (e.calories || 0), 0);

  // Tasks (today's completed/total)
  const { tasks } = useTasksStore();
  const todayTasks = tasks.filter(
    (t) => !t.deleted && t.created.startsWith(today)
  );
  const completedTasks = todayTasks.filter((t) => t.status === "done").length;

  // Quick Add Popover
  const [quickAddType, setQuickAddType] = useState("task");
  const [quickAddValue, setQuickAddValue] = useState("");
  const notesStore = useNotesStore();
  const habitsStore = useHabitsStore();
  const handleQuickAdd = () => {
    if (!quickAddValue.trim()) return;
    if (quickAddType === "task") {
      useTasksStore.getState().addTask({
        id: `${Date.now()}`,
        type: "task",
        status: "todo",
        title: quickAddValue,
        project: "",
        tags: [],
        description: "",
        created: new Date().toISOString(),
        started: new Date().toISOString(),
        dependencies: [],
        priority: "medium",
        annotations: [],
      });
    } else if (quickAddType === "note") {
      notesStore.addFile({
        id: `${Date.now()}`,
        parentId: null,
        name: quickAddValue,
        content: "",
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      });
    } else if (quickAddType === "habit") {
      habitsStore.addHabit({
        name: quickAddValue,
        description: "",
        frequency: "daily",
        tags: [],
      });
    }
    setQuickAddValue("");
  };

  return (
    <div className="flex border w-full h-[4.5%] items-center pl-2 pr-0.5 gap-4 bg-background text-sm">
      {/* Timer */}
      <div className="flex items-center gap-1 min-w-[90px] ">
        <LucideIcons.Timer className="w-4 h-4 mr-1" />
        {timerDisplay}
      </div>
      {/* Hydration */}
      <div className="flex items-center gap-1 min-w-[70px]">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            hydration &&
            useCountersStore.getState().decrementCounter(hydration.id)
          }
          disabled={!hydration}
        >
          <LucideIcons.Minus className="w-4 h-4" />
        </Button>
        <LucideIcons.Droplet className="w-4 h-4 mx-1" />
        {hydrationValue}/{hydrationGoal}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            hydration &&
            useCountersStore.getState().incrementCounter(hydration.id)
          }
          disabled={!hydration}
        >
          <LucideIcons.Plus className="w-4 h-4" />
        </Button>
      </div>
      {/* Calories */}
      <div className="flex items-center gap-1 min-w-[90px]">
        <LucideIcons.Apple className="w-4 h-4 mr-1" />
        {todayCalories} kcal
      </div>
      {/* Tasks */}
      <div className="flex items-center gap-1 min-w-[80px]">
        <LucideIcons.CheckSquare className="w-4 h-4 mr-1" />
        {completedTasks}/{todayTasks.length}
      </div>
      {/* Spacer */}
      <div className="flex-1" />
      {/* Quick Add */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="ml-2">
            <LucideIcons.Plus />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64">
          <div className="mb-2 font-medium">Quick Add</div>
          <Select value={quickAddType} onValueChange={setQuickAddType}>
            <SelectTrigger className="mb-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="note">Note</SelectItem>
              <SelectItem value="habit">Habit</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder={`New ${
              quickAddType.charAt(0).toUpperCase() + quickAddType.slice(1)
            }`}
            value={quickAddValue}
            onChange={(e) => setQuickAddValue(e.target.value)}
            className="mb-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleQuickAdd();
            }}
          />
          <Button onClick={handleQuickAdd} className="w-full" size="sm">
            Add
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex justify-between">
      <LeftBar />
      <div className="flex flex-col flex-1 h-full w-[95%]">
        <div className="flex flex-col flex-1 border h-[95.5%] w-full">
          {children}
        </div>
        <BottomBar />
      </div>
      <div className="flex flex-col border h-full w-[2.5%]"></div>
    </div>
  );
}
