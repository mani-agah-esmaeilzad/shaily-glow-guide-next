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
import { Loader2, LogOut, Check, Sparkles, MessageCircle, BarChart2, Trash2, Calendar, TrendingUp, Star, Award } from 'lucide-react';
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
      className={`group flex items-center gap-4 p-4 rounded-2xl border-r-4 transition-all duration-300 cursor-pointer ${task.completed
          ? 'border-r-4 shadow-soft'
          : 'glass hover:shadow-soft border-transparent'
        }`}
      style={{
        background: task.completed 
          ? 'linear-gradient(135deg, #99B094, #BE9382)'
          : '#F2EADF',
        borderRightColor: task.completed ? '#99B094' : 'transparent'
      }}
      onClick={() => onToggle(task.id)}
    >
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${task.completed
            ? 'text-white'
            : 'border-muted-foreground'
          }`}
        style={{
          backgroundColor: task.completed ? '#99B094' : 'transparent',
          borderColor: task.completed ? '#99B094' : '#99B094'
        }}
      >
        {task.completed && <Check size={14} />}
      </div>
      <div className="flex-1">
        <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {task.title}
        </p>
      </div>
      <Badge 
        variant="outline" 
        className="text-xs rounded-2xl border-2 font-medium"
        style={{
          borderColor: task.type === 'skin' ? '#99B094' : '#BE9382',
          color: task.type === 'skin' ? '#99B094' : '#BE9382',
          backgroundColor: task.type === 'skin' ? 'rgba(153, 176, 148, 0.1)' : 'rgba(190, 147, 130, 0.1)'
        }}
      >
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
    <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-beige relative" style={{ direction: 'rtl' }}>
      {/* Modern background pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 right-20 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-brand-brown/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-brand-tan/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row">
        {/* ستون کناری (Sidebar) */}
        <aside className="w-full lg:w-80 bg-white/90 backdrop-blur-xl border-l border-brand-tan/20 shadow-2xl p-8 flex flex-col gap-8">
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-brand-primary to-brand-brown rounded-3xl text-white">
            <AvatarDisplay gender={profile.gender} name={profile.name} size="lg" />
            <div>
              <h2 className="font-bold text-xl text-white">{profile.name}</h2>
              <p className="text-sm text-white/80">{profile.mobile}</p>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/80 rounded-3xl border border-brand-tan/20 shadow-xl backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                  </div>
                  <CardDescription className="text-gray-600 font-medium">پیشرفت امروز</CardDescription>
                </div>
                <CardTitle className="text-3xl font-bold text-brand-primary">{completedTasks} / {tasks.length} تسک</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-brand-tan/20 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-brand-primary to-brand-brown h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{Math.round(progressPercentage)}% تکمیل شده</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 rounded-3xl border border-brand-tan/20 shadow-xl backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-brand-brown/10 rounded-2xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-brand-brown" />
                  </div>
                  <CardDescription className="text-gray-600 font-medium">پروفایل شما</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-brand-cream/50 rounded-2xl">
                  <h3 className="font-semibold text-sm text-gray-700 mb-2">نوع پوست</h3>
                  <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 rounded-xl px-3 py-1">{profile.skinType}</Badge>
                </div>
                <div className="p-4 bg-brand-beige/50 rounded-2xl">
                  <h3 className="font-semibold text-sm text-gray-700 mb-2">نوع مو</h3>
                  <Badge className="bg-brand-brown/10 text-brand-brown border-brand-brown/20 rounded-xl px-3 py-1">{profile.hairType}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Button 
              onClick={() => setShowAIChat(true)} 
              size="lg" 
              className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-brand-primary to-brand-brown hover:from-brand-primary/90 hover:to-brand-brown/90 transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl"
            >
              <MessageCircle className="ml-2 h-6 w-6" /> 
              مشاوره با شایلی
            </Button>
            <Button 
              onClick={logout} 
              variant="outline" 
              size="lg" 
              className="w-full py-4 rounded-2xl font-semibold border-2 border-brand-tan/30 text-gray-600 hover:bg-brand-cream/50 hover:border-brand-tan/50 transition-all duration-300"
            >
              <LogOut className="ml-2 h-5 w-5" /> 
              خروج
            </Button>
          </div>
        </aside>

        {/* محتوای اصلی */}
        <main className="flex-1 p-8">
          <header className="mb-12">
            <div className="bg-white/80 rounded-3xl p-8 shadow-xl backdrop-blur-sm border border-brand-tan/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-brown rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-brand-primary mb-2">سلام {profile.name}! 👋</h1>
                  <p className="text-xl text-gray-600">امروز برای مراقبت از خودت آماده‌ای؟</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gradient-to-r from-brand-primary/10 to-brand-brown/10 rounded-2xl p-4 text-center">
                  <Calendar className="w-6 h-6 text-brand-primary mx-auto mb-2" />
                  <p className="font-semibold text-brand-primary">امروز</p>
                  <p className="text-sm text-gray-600">{new Date().toLocaleDateString('fa-IR')}</p>
                </div>
                <div className="bg-gradient-to-r from-brand-brown/10 to-brand-tan/10 rounded-2xl p-4 text-center">
                  <Award className="w-6 h-6 text-brand-brown mx-auto mb-2" />
                  <p className="font-semibold text-brand-brown">امتیاز</p>
                  <p className="text-sm text-gray-600">{completedTasks * 10} امتیاز</p>
                </div>
                <div className="bg-gradient-to-r from-brand-tan/10 to-brand-beige/10 rounded-2xl p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-brand-brown mx-auto mb-2" />
                  <p className="font-semibold text-brand-brown">روند</p>
                  <p className="text-sm text-gray-600">در حال بهبود</p>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* ستون روتین روزانه */}
            <div className="xl:col-span-2">
              <Card className="bg-white/90 rounded-3xl border border-brand-tan/20 shadow-2xl backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-brown rounded-2xl flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-brand-primary">روتین روزانه تو</CardTitle>
                  </div>
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
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-brand-primary to-brand-brown rounded-3xl border border-brand-tan/20 shadow-2xl text-white">
                <CardHeader className="p-6">
                  <CardTitle className="text-white font-bold flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    نکته امروز
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-white/90 leading-relaxed text-lg">
                    نوشیدن آب کافی در طول روز، بهترین و ساده‌ترین راه برای حفظ شادابی و رطوبت پوستت است. سعی کن حداقل ۸ لیوان آب بنوشی.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 rounded-3xl border border-brand-tan/20 shadow-xl backdrop-blur-sm">
                <CardHeader className="p-6">
                  <CardTitle className="font-bold text-brand-primary flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                      <BarChart2 className="h-5 w-5 text-brand-primary" />
                    </div>
                    آمار هفتگی
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="bg-gradient-to-r from-brand-cream to-brand-beige rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-3xl text-brand-primary mb-1">۷۵٪</p>
                        <p className="text-sm text-gray-600">پایبندی به روتین</p>
                      </div>
                      <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-brand-primary" />
                      </div>
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