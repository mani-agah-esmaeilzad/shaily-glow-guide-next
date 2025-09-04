'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIChat } from '@/components/ai-chat';
import { AvatarDisplay } from '@/components/ui/avatar-display';
import { AddRoutineItem } from '@/components/add-routine-item';
import { Loader2, LogOut, Check, Trash2, Menu, Package, Compass, Wand2, Flame, Heart, Sun, Scissors, BookText } from 'lucide-react'; // آیکون جدید
import { useAuth } from '@/context/AuthContext';
import type { UserProfile, Task } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog } from '@/components/ui/dialog';
import { UserProfileModal } from '@/components/user-profile-modal';
import { RoutineReminder } from '@/components/routine-reminder';
import { GamificationWidget } from '@/components/gamification-widget';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserMenu } from '@/components/user-menu';
import { WeeklyReportModal } from '@/components/weekly-report-modal';
import { SettingsModal } from '@/components/settings-modal';

// کامپوننت TaskItem (بدون تغییر)
const TaskItem = ({ task, onToggle, onDelete }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void; }) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div
      key={task.id}
      className={`group flex items-center gap-4 p-3 rounded-lg border-r-4 transition-all duration-300 cursor-pointer ${task.completed ? 'bg-brand-primary/10 border-brand-primary' : 'bg-white hover:bg-gray-50 border-transparent'
        }`}
      onClick={() => onToggle(task.id)}
    >
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${task.completed ? 'bg-brand-primary border-brand-primary text-white' : 'border-gray-300'
          }`}
      >
        {task.completed && <Check size={14} />}
      </div>
      <div className="flex-1">
        <p className={`font-medium text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 size={14} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>آیا از حذف این تسک مطمئن هستید؟</AlertDialogTitle>
            <AlertDialogDescription>
              این عمل قابل بازگشت نیست و این تسک برای همیشه از روتین شما حذف خواهد شد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>لغو</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClick} className="bg-destructive hover:bg-destructive/90">
              حذف کن
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};


// کامپوننت جدا برای محتوای سایدبار جهت استفاده مجدد
const SidebarContent = ({ profile, gamificationStats, tasks, onToggleTask, onDeleteTask, onAddTask }: any) => {
  const morningTasks = tasks.filter((task: Task) => task.time === 'morning');
  const eveningTasks = tasks.filter((task: Task) => task.time === 'evening');

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl">
      <ScrollArea className="flex-1 pt-4">
        <div className="p-4 space-y-4 flex flex-col items-center">
          <Link href="/discover" className="w-full">
            <Button variant="outline" className="w-full justify-center text-base py-6 rounded-2xl bg-brand-primary/5 border-brand-primary/20 text-brand-primary">
              <Compass className="h-5 w-5 ml-3" />
              کشف روز
            </Button>
          </Link> 
          <Link href="/trending-routines" className="w-full">
            <Button variant="outline" className="w-full justify-center text-base py-6 rounded-2xl">
              <Flame className="h-5 w-5 ml-3" />
              روتین‌های پرطرفدار
            </Button>
          </Link>
          <Link href="/rejuvenation" className="w-full">
            <Button variant="outline" className="w-full justify-center text-base py-6 rounded-2xl">
              <Heart className="h-5 w-5 ml-3" />
              مشاوره جوان‌سازی
            </Button>
          </Link>
          <Link href="/brightening" className="w-full">
            <Button variant="outline" className="w-full justify-center text-base py-6 rounded-2xl">
              <Sun className="h-5 w-5 ml-3" />
              روشن‌کننده پوست
            </Button>
          </Link>
          <Link href="/hair-care" className="w-full">
            <Button variant="outline" className="w-full justify-center text-base py-6 rounded-2xl">
              <Scissors className="h-5 w-5 ml-3" />
              مراقبت از مو
            </Button>
          </Link>
          <Link href="/blog" className="w-full">
            <Button variant="outline" className="w-full justify-center text-base py-6 rounded-2xl">
              <BookText className="h-5 w-5 ml-3" />
              وبلاگ
            </Button>
          </Link>
          <div className="w-full">
            <GamificationWidget stats={gamificationStats} />
          </div>

          <Card className="w-full bg-transparent border-none shadow-none">
            <CardHeader className="px-2 pt-0">
              <CardTitle className="text-lg font-bold text-brand-primary text-center">روتین روزانه شما</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="morning" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="morning">صبح</TabsTrigger>
                  <TabsTrigger value="evening">شب</TabsTrigger>
                </TabsList>
                <TabsContent value="morning" className="space-y-2 mt-4">
                  {morningTasks.length > 0 ? morningTasks.map((task: Task) => <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask} />) : <p className="text-center text-xs text-gray-400 py-4">تسکی برای صبح نداری.</p>}
                </TabsContent>
                <TabsContent value="evening" className="space-y-2 mt-4">
                  {eveningTasks.length > 0 ? eveningTasks.map((task: Task) => <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask} />) : <p className="text-center text-xs text-gray-400 py-4">تسکی برای شب نداری.</p>}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      <div className="p-4 border-t flex-shrink-0">
        <AddRoutineItem onAdd={onAddTask} />
      </div>
    </div>
  );
};

export const Dashboard: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gamificationStats, setGamificationStats] = useState(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);

  const updateTasksInApi = async (updatedTasks: Task[]) => {
    if (!profile?.id) return;
    try {
      await fetch(`/api/routines/${profile.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: updatedTasks }),
      });
    } catch (error) {
      console.error("Failed to update routine:", error);
    }
  };

  const fetchGamificationData = async () => {
    if (!profile?.id) return;
    const res = await fetch(`/api/gamification/${profile.id}`);
    if (res.ok) {
      const data = await res.json();
      setGamificationStats(data);
    }
  };

  useEffect(() => {
    if (!profile?.id) {
      setIsLoading(false);
      return;
    };
    const initialFetch = async () => {
      setIsLoading(true);
      const routineRes = await fetch(`/api/routines/${profile.id}`);
      if (routineRes.ok) {
        const data = await routineRes.json();
        if (data.tasks && Array.isArray(data.tasks)) setTasks(data.tasks);
      }
      await fetchGamificationData();
      setIsLoading(false);
    };
    initialFetch();
  }, [profile]);

  const addCustomTask = (newTask: Omit<Task, 'id' | 'completed'>) => {
    const task: Task = { id: Date.now().toString(), completed: false, ...newTask };
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    updateTasksInApi(updatedTasks);
  };

  const addSuggestedTasks = (suggestedTasks: Omit<Task, 'id' | 'completed'>[]) => {
    const newTasks: Task[] = suggestedTasks.map(task => ({
      ...task,
      id: `ai-${Date.now()}-${Math.random()}`,
      completed: false,
    }));
    const updatedTasks = [...tasks, ...newTasks];
    setTasks(updatedTasks);
    updateTasksInApi(updatedTasks);
  };

  const toggleTask = async (taskId: string) => {
    const originalTasks = [...tasks];
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    try {
      await updateTasksInApi(updatedTasks);

      const allTasksCompleted = updatedTasks.length > 0 && updatedTasks.every(task => task.completed);
      const wasJustCompleted = !originalTasks.find(t => t.id === taskId)?.completed;

      if (wasJustCompleted && allTasksCompleted) {
        const res = await fetch(`/api/gamification/${profile.id}`, { method: 'POST' });
        if (res.ok) {
          const newStats = await res.json();
          setGamificationStats(newStats);
        }
      }
    } catch (error) {
      setTasks(originalTasks);
    }
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    updateTasksInApi(updatedTasks);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const sidebarProps = {
    profile,
    gamificationStats,
    tasks,
    onToggleTask: toggleTask,
    onDeleteTask: deleteTask,
    onAddTask: addCustomTask,
  };

  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-brand-cream to-brand-beige" style={{ direction: 'rtl' }}>
      <aside className="h-full border-l border-brand-tan/20 w-1/3 lg:w-1/4 hidden md:block">
        <SidebarContent {...sidebarProps} />
      </aside>

      <div className="flex-1 flex flex-col h-screen">
        <header className="p-2 border-b flex justify-between items-center bg-white/50 backdrop-blur-sm flex-shrink-0 md:hidden">
          <div className="flex items-center gap-3">
            <UserMenu
              user={profile}
              onLogout={logout}
              onOpenProfile={() => setProfileModalOpen(true)}
              onOpenSettings={() => setSettingsModalOpen(true)}
              onOpenReport={() => setReportModalOpen(true)}
            />
            <div className="bg-brand-primary/10 text-brand-primary text-xs font-bold px-3 py-1 rounded-full">
              {profile.subscription_plan || 'پایه'}
            </div>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-[80%] max-w-sm border-l">
              <SidebarContent {...sidebarProps} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-hidden relative">
          <div className="absolute top-6 left-6 z-20 hidden md:flex items-center gap-3">
            <div className="bg-brand-primary/10 text-brand-primary text-sm font-bold px-4 py-2 rounded-full shadow-sm">
              اشتراک: {profile.subscription_plan || 'پایه'}
            </div>
            <UserMenu
              user={profile}
              onLogout={logout}
              onOpenProfile={() => setProfileModalOpen(true)}
              onOpenSettings={() => setSettingsModalOpen(true)}
              onOpenReport={() => setReportModalOpen(true)}
            />
          </div>
          <AIChat
            profile={profile}
            currentTasks={tasks}
            onAddTasks={addSuggestedTasks}
          />
        </main>
      </div>

      <Dialog open={isProfileModalOpen} onOpenChange={setProfileModalOpen}>
        <UserProfileModal user={profile} />
      </Dialog>
      <Dialog open={isSettingsModalOpen} onOpenChange={setSettingsModalOpen}>
        <SettingsModal />
      </Dialog>
      <Dialog open={isReportModalOpen} onOpenChange={setReportModalOpen}>
        <WeeklyReportModal stats={gamificationStats} />
      </Dialog>
    </div>
  );
};

export default Dashboard;