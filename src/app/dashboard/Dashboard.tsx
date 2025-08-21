'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AIChat } from '@/components/ai-chat';
import { AvatarDisplay } from '@/components/ui/avatar-display';
import { AddRoutineItem } from '@/components/add-routine-item';
import { Loader2, LogOut, Check, Sparkles, MessageCircle, BarChart2, Trash2 } from 'lucide-react'; // آیکون سطل زباله اضافه شد
import { useAuth } from '@/context/AuthContext';
import type { UserProfile, Task } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


interface DashboardProps {
  profile: UserProfile;
}

// کامپوننت TaskItem با دکمه حذف
const TaskItem = ({ task, onToggle, onDelete }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void; }) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // جلوگیری از اجرای onToggle هنگام کلیک روی دکمه حذف
    onDelete(task.id);
  };

  return (
    <div
      key={task.id}
      className={`group flex items-center gap-4 p-4 rounded-xl border-l-4 transition-all duration-300 cursor-pointer ${task.completed
          ? 'bg-green-50 border-green-400'
          : 'bg-card hover:bg-muted/50 border-transparent'
        }`}
      onClick={() => onToggle(task.id)}
    >
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${task.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-muted-foreground'
          }`}
      >
        {task.completed && <Check size={14} />}
      </div>
      <div className="flex-1">
        <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {task.title}
        </p>
      </div>
      <Badge variant={task.type === 'skin' ? 'default' : 'secondary'} className="text-xs">
        {task.type === 'skin' ? 'پوست' : 'مو'}
      </Badge>
      {/* دکمه حذف */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => e.stopPropagation()} // جلوگیری از فعال شدن toggle
          >
            <Trash2 size={16} />
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


export const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);

  const updateTasksInApi = async (updatedTasks: Task[]) => {
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

  useEffect(() => {
    if (!profile.id) return;
    const fetchRoutine = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/routines/${profile.id}`);
        const data = await response.json();
        if (data.tasks && Array.isArray(data.tasks)) {
          setTasks(data.tasks);
        } else {
          const initialTasks: Task[] = [
            { id: '1', title: 'شستشوی صورت با ژل ملایم', type: 'skin', completed: false, time: 'morning' },
            { id: '2', title: 'استفاده از کرم ضدآفتاب', type: 'skin', completed: false, time: 'morning' },
          ];
          setTasks(initialTasks);
          await updateTasksInApi(initialTasks);
        }
      } catch (error) {
        console.error("Failed to fetch routine:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutine();
  }, [profile.id]);

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

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    updateTasksInApi(updatedTasks);
  };

  // تابع جدید برای حذف تسک
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

  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  const morningTasks = tasks.filter(task => task.time === 'morning');
  const eveningTasks = tasks.filter(task => task.time === 'evening');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col lg:flex-row">
        {/* ستون کناری (Sidebar) */}
        <aside className="w-full lg:w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <AvatarDisplay gender={profile.gender} name={profile.name} size="lg" />
            <div>
              <h2 className="font-bold text-lg">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>پیشرفت امروز</CardDescription>
                <CardTitle className="text-2xl">{completedTasks} / {tasks.length} تسک</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progressPercentage} className="h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>پروفایل شما</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-medium text-xs text-muted-foreground mb-1">نوع پوست</h3>
                  <Badge variant="outline">{profile.skinType}</Badge>
                </div>
                <div>
                  <h3 className="font-medium text-xs text-muted-foreground mb-1">نوع مو</h3>
                  <Badge variant="outline">{profile.hairType}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-auto space-y-2">
            <Button onClick={() => setShowAIChat(true)} variant="secondary" size="lg" className="w-full">
              <MessageCircle className="ml-2 h-5 w-5" /> مشاوره با شایلی
            </Button>
            <Button onClick={logout} variant="ghost" size="lg" className="w-full text-muted-foreground">
              <LogOut className="ml-2 h-5 w-5" /> خروج
            </Button>
          </div>
        </aside>

        {/* محتوای اصلی */}
        <main className="flex-1 p-8">
          <header className="mb-8">
            <p className="text-xl text-muted-foreground mt-2">امروز برای مراقبت از خودت آماده‌ای؟</p>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* ستون روتین روزانه */}
            <div className="xl:col-span-2">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>روتین روزانه تو</CardTitle>
                  <AddRoutineItem onAdd={addCustomTask} />
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="morning" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="morning"> صبح</TabsTrigger>
                      <TabsTrigger value="evening"> شب</TabsTrigger>
                    </TabsList>
                    <TabsContent value="morning" className="space-y-3 mt-6">
                      {morningTasks.length > 0 ? morningTasks.map(task => <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />) : <p className="text-center text-muted-foreground py-4">تسکی برای صبح نداری.</p>}
                    </TabsContent>
                    <TabsContent value="evening" className="space-y-3 mt-6">
                      {eveningTasks.length > 0 ? eveningTasks.map(task => <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />) : <p className="text-center text-muted-foreground py-4">تسکی برای شب نداری.</p>}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* ستون کناری محتوا */}
            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle>نکته امروز ✨</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">نوشیدن آب کافی در طول روز، بهترین و ساده‌ترین راه برای حفظ شادابی و رطوبت پوستت است. سعی کن حداقل ۸ لیوان آب بنوشی.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>آمار هفتگی</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <BarChart2 className="text-primary" size={28} />
                    <div>
                      <p className="font-bold text-xl">۷۵٪</p>
                      <p className="text-sm text-muted-foreground">پایبندی به روتین</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <AIChat
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        profile={profile}
        currentTasks={tasks}
        onAddTasks={addSuggestedTasks}
      />
    </div>
  );
};
export default Dashboard;