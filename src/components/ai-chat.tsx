// src/components/ai-chat.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, X, PlusCircle, Sparkles, Bot } from 'lucide-react';
import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';
import type { UserProfile, Task } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

// رابط برای پیام‌های چت
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

// تایپ برای تسک‌های پیشنهادی
type SuggestedTask = Omit<Task, 'id' | 'completed'>;

// رابط برای Props کامپوننت
interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  currentTasks: Task[];
  onAddTasks: (tasks: SuggestedTask[]) => void;
}

// دستورالعمل‌های پایه برای مدل
const SYSTEM_INSTRUCTION_BASE = `
شما یک دستیار هوش مصنوعی به نام "شایلی" هستید.
قوانین شما:
1.  *هشدار اولیه:* در اولین پیام به کاربر جدید، این پیام را ارسال کن: "سلام! من «شایلی» هستم، یک راهنمای هوش مصنوعی. اطلاعات من صرفاً جنبه آموزشی دارد و هرگز جایگزین مشاوره و تشخیص پزشک متخصص نیست. سوالت در مورد پوست و مو چیه؟"
2.  *عدم تشخیص:* هرگز یک بیماری را تشخیص نده. همیشه کاربر را برای تشخیص قطعی به پزشک متخصص ارجاع بده.
3.  *محدوده تخصص:* فقط و فقط به سوالات مربوط به سلامت و مراقبت از پوست، مو و ناخن پاسخ بده.
4.  *لحن:* لحن شما باید دوستانه، علمی و اطمینان‌بخش باشد.
5.  *پاسخ کوتاه:* پاسخ‌ها باید برای خواندن در تلگرام مناسب، خلاصه و روان باشند.
6.  *اطلاعات کاربر:* شما به اطلاعات پروفایل کاربر و روتین فعلی او دسترسی دارید. از این اطلاعات برای ارائه پاسخ‌های دقیق‌تر استفاده کن.
7.  *پیشنهاد روتین:* اگر خواستی یک یا چند تسک جدید برای روتین پیشنهاد دهی، آن‌ها را حتماً و فقط در قالب یک بلوک JSON داخل تگ <SUGGESTION> قرار بده. هر تسک باید شامل 'title' (رشته)، 'type' ('skin' یا 'hair') و 'time' ('morning' یا 'evening') باشد. هرگز این ساختار را تغییر نده.
مثال برای پیشنهاد:
<SUGGESTION>
[
  {"title": "استفاده از ماسک خاک رس", "type": "skin", "time": "evening"},
  {"title": "نوشیدن ۸ لیوان آب", "type": "skin", "time": "morning"}
]
</SUGGESTION>
`;

// تابعی برای ساخت دستورالعمل‌های شخصی‌سازی شده
const generateSystemInstruction = (profile: UserProfile, tasks: Task[]): string => {
  let profileInfo = `\n\n### اطلاعات کاربر فعلی:\n`;
  profileInfo += `- نوع پوست: ${profile.skinType}\n- نگرانی‌های پوستی: ${profile.skinConcerns?.join('، ') || 'ندارد'}\n`;
  profileInfo += `- نوع مو: ${profile.hairType}\n- نگرانی‌های مو: ${profile.hairConcerns?.join('، ') || 'ندارد'}\n`;

  if (tasks.length > 0) {
    profileInfo += `\n### روتین فعلی کاربر:\n`;
    tasks.forEach(task => {
      profileInfo += `- ${task.title} (${task.time === 'morning' ? 'صبح' : 'شب'})\n`;
    });
  } else {
    profileInfo += `\nکاربر هنوز روتین فعالی ندارد.\n`;
  }

  return SYSTEM_INSTRUCTION_BASE + profileInfo;
};

export const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, profile, currentTasks, onAddTasks }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[] | null>(null);
  const chatSessionRef = useRef<ChatSession | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, suggestedTasks, isLoading]);

  const handleAddSuggestion = () => {
    if (suggestedTasks) {
      onAddTasks(suggestedTasks);
      setSuggestedTasks(null);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    setSuggestedTasks(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        const apiKey = "AIzaSyA_uuYZJDhggbXUYemarNz5K6l3XbKkdSA";
        if (!apiKey) throw new Error("Gemini API key not found!");

        const genAI = new GoogleGenerativeAI(apiKey);
        const personalizedInstruction = generateSystemInstruction(profile, currentTasks);

        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction: personalizedInstruction,
        });

        const generationConfig = {
          temperature: 1,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        };
        chatSessionRef.current = model.startChat({ generationConfig, history: [] });
      }

      const chat = chatSessionRef.current;
      const result = await chat.sendMessage(userMessage.text);
      let text = result.response.text();

      const suggestionRegex = /<SUGGESTION>([\s\S]*?)<\/SUGGESTION>/;
      const match = text.match(suggestionRegex);

      if (match && match[1]) {
        try {
          const parsedTasks = JSON.parse(match[1]);
          setSuggestedTasks(parsedTasks);
          text = text.replace(suggestionRegex, '').trim();
        } catch (e) {
          console.error("Failed to parse suggestion JSON:", e);
        }
      }

      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        text: text,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };

      if (text) {
        setMessages((prev) => [...prev, aiMessage]);
      }

    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: 'متأسفانه در ارتباط با هوش مصنوعی خطایی رخ داد. لطفاً دوباره تلاش کنید.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col shadow-2xl rounded-2xl">
        <CardHeader className="border-b bg-slate-50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
                <Bot className="w-7 h-7 text-primary" />
              </div>
              <div>
                <CardTitle>مشاوره با شایلی</CardTitle>
                <CardDescription className='mt-1'>دستیار هوشمند پوست و مو</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                  <Sparkles className="mx-auto h-12 w-12 text-primary/50 mb-4" />
                  <p className="text-lg font-medium">سلام! من شایلی هستم.</p>
                  <p className="text-sm mt-2">می‌توانید سوالات خود را در مورد پوست و مو از من بپرسید.</p>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={cn("flex items-end gap-3", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                  {message.sender === 'ai' && (
                    <Avatar className='h-8 w-8'>
                      <AvatarFallback className='bg-primary/20 text-primary'>
                        <Bot size={18} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl p-4",
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-slate-100 text-foreground rounded-bl-none'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-60 mt-2 text-left">{message.timestamp}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-end gap-3 justify-start">
                  <Avatar className='h-8 w-8'>
                    <AvatarFallback className='bg-primary/20 text-primary'>
                      <Bot size={18} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-slate-100 rounded-2xl rounded-bl-none p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">در حال نوشتن...</span>
                    </div>
                  </div>
                </div>
              )}

              {suggestedTasks && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 text-center">✨ پیشنهاد شایلی برای روتین شما:</h4>
                  <ul className="space-y-2">
                    {suggestedTasks.map((task, index) => (
                      <li key={index} className='bg-primary/5 p-3 rounded-lg text-sm font-medium text-primary-foreground'>
                        <span className='text-primary'>{task.title}</span> ({task.time === 'morning' ? 'صبح' : 'شب'})
                      </li>
                    ))}
                  </ul>
                  <Button onClick={handleAddSuggestion} className="mt-4 w-full" size="lg">
                    <PlusCircle className="w-5 h-5 ml-2" />
                    افزودن به روتین من
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4 bg-slate-50/50 rounded-b-2xl">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="سوال خود را اینجا بنویسید..."
                className="min-h-[50px] resize-none rounded-full py-3 pl-14 pr-6 border-slate-300 focus:ring-primary"
                disabled={isLoading}
                rows={1}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-9 w-9"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              اطلاعات شایلی صرفاً جنبه آموزشی دارد و جایگزین مشاوره پزشک نیست.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};