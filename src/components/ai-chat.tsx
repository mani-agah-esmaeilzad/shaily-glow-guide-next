'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, PlusCircle, Sparkles, Bot } from 'lucide-react';
import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';
import type { UserProfile, Task } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}
type SuggestedTask = Omit<Task, 'id' | 'completed'>;

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
`;

const generateSystemInstruction = (profile: UserProfile, tasks: Task[]): string => {
  let profileInfo = `\n\n### اطلاعات کامل کاربر فعلی:\n`;
  profileInfo += `- **جنسیت**: ${profile.gender || 'ثبت نشده'}\n`;
  profileInfo += `- **بازه سنی**: ${profile.age || 'ثبت نشده'}\n`;
  profileInfo += `\n#### آنالیز پوست:\n`;
  profileInfo += `- **کومدون (جوش سرسیاه/سرسفید)**: ${profile.comedones || 'ثبت نشده'}\n`;
  profileInfo += `- **جوش قرمز و ملتهب**: ${profile.redPimples || 'ثبت نشده'}\n`;
  profileInfo += `- **خطوط ظریف (چروک)**: ${profile.fineLines || 'ثبت نشده'}\n`;
  profileInfo += `- **وضعیت پیشانی و بینی**: ${profile.foreheadNose || 'ثبت نشده'}\n`;
  profileInfo += `- **وضعیت کناره‌های بینی**: ${profile.sideNose || 'ثبت نشده'}\n`;
  profileInfo += `- **وضعیت گونه‌ها**: ${profile.cheeks || 'ثبت نشده'}\n`;

  if (profile.skinType) profileInfo += `- **نوع کلی پوست**: ${profile.skinType}\n`;
  if (profile.skinConcerns && profile.skinConcerns.length > 0) profileInfo += `- **نگرانی‌های پوستی**: ${profile.skinConcerns.join('، ')}\n`;
  if (profile.hairType) profileInfo += `- **نوع مو**: ${profile.hairType}\n`;
  if (profile.hairConcerns && profile.hairConcerns.length > 0) profileInfo += `- **نگرانی‌های مو**: ${profile.hairConcerns.join('، ')}\n`;
    
  if (tasks.length > 0) {
    profileInfo += `\n### روتین فعلی کاربر:\n`;
    tasks.forEach(task => {
      profileInfo += `- ${task.title} (${task.time === 'morning' ? 'صبح' : 'شب'})\n`;
    });
  } else {
    profileInfo += `\n**نکته**: کاربر هنوز روتین فعالی ندارد. می‌توانی به او در ساختن یک روتین اولیه کمک کنی.\n`;
  }

  return SYSTEM_INSTRUCTION_BASE + profileInfo;
};


interface AIChatProps {
  profile: UserProfile;
  currentTasks: Task[];
  onAddTasks: (tasks: SuggestedTask[]) => void;
}

export const AIChat: React.FC<AIChatProps> = ({ profile, currentTasks, onAddTasks }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[] | null>(null);
  const [isSuggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const chatSessionRef = useRef<ChatSession | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptSentRef = useRef(false);

  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt');
    if (promptFromUrl && !promptSentRef.current) {
      promptSentRef.current = true; 
      sendMessage(promptFromUrl);
      router.replace('/', { scroll: false });
    }
  }, [searchParams]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleAddSuggestion = () => {
    if (suggestedTasks) {
      onAddTasks(suggestedTasks);
      setSuggestedTasks(null);
      setSuggestionModalOpen(false);
    }
  };

  const sendMessage = async (messageToSend?: string) => {
    const textToSend = messageToSend || input.trim();
    if (!textToSend || isLoading) return;

    setSuggestedTasks(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        if (!chatSessionRef.current) {
            const apiKey = "AIzaSyA_uuYZJDhggbXUYemarNz5K6l3XbKkdSA";
            if (!apiKey) {
                throw new Error("Gemini API key not found!");
            }
    
            const genAI = new GoogleGenerativeAI(apiKey);
            const personalizedInstruction = generateSystemInstruction(profile, currentTasks);
            const model = genAI.getGenerativeModel({
              model: 'gemini-1.5-flash',
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
          setSuggestionModalOpen(true);
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

  return (
    <>
      <div className="flex flex-col h-full w-full bg-transparent">
        {/* **اصلاح شد:** کلاس pt-20 برای اضافه کردن فاصله از بالا اضافه شد */}
        <ScrollArea className="flex-1 pt-20 px-6 pb-6" ref={scrollAreaRef} dir="rtl">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-16 flex flex-col items-center justify-center h-full">
                <Sparkles className="mx-auto h-12 w-12 text-brand-primary/50 mb-4" />
                <p className="text-lg font-medium text-gray-600">سلام! من شایلی هستم.</p>
                <p className="text-sm mt-2 max-w-xs mx-auto">
                  می‌توانید سوالات خود را در مورد پوست و مو بپرسید یا از من بخواهید یک روتین جدید برایتان بسازم.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={cn("flex items-end gap-3", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                {message.sender === 'ai' && (
                  <Avatar className='h-8 w-8'>
                    <AvatarFallback className='bg-brand-primary/20 text-brand-primary'>
                      <Bot size={18} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-3 shadow-sm text-right",
                    message.sender === 'user'
                      ? 'bg-brand-primary text-white rounded-bl-none'
                      : 'bg-white text-gray-800 rounded-br-none'
                  )}
                >
                  <div className="prose prose-sm max-w-none break-words text-right">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                  <p className="text-xs opacity-60 mt-2 text-left">{message.timestamp}</p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src={profile.avatarUrl} /> 
                    <AvatarFallback>{profile.name ? profile.name.charAt(0) : 'U'}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-end gap-3 justify-start">
                <Avatar className='h-8 w-8'>
                  <AvatarFallback className='bg-brand-primary/20 text-brand-primary'>
                    <Bot size={18} />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
                    <span className="text-sm text-gray-500">در حال نوشتن...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4 bg-transparent" dir="rtl">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="از شایلی بپرسید..."
              className="min-h-[50px] resize-none rounded-full py-3 pl-14 pr-6 border-gray-300 focus:ring-brand-primary bg-white shadow-md text-right"
              disabled={isLoading}
              rows={1}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-9 w-9 bg-brand-primary hover:bg-brand-primary/90"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            اطلاعات شایلی صرفاً جنبه آموزشی دارد و جایگزین مشاوره پزشک نیست.
          </p>
        </div>
      </div>

      <Dialog open={isSuggestionModalOpen} onOpenChange={setSuggestionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-primary" />
              پیشنهاد جدید شایلی برای روتین شما
            </DialogTitle>
            <DialogDescription>
              این تسک‌ها بر اساس گفتگو و پروفایل شما پیشنهاد شده‌اند.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ul className="space-y-2">
              {suggestedTasks?.map((task, index) => (
                <li key={index} className='bg-brand-cream/60 p-3 rounded-lg text-sm font-medium'>
                  <span className='text-brand-primary font-bold'>{task.title}</span> 
                  <span className="text-xs text-gray-500 mr-1">
                    ({task.time === 'morning' ? 'صبح' : 'شب'}, نوع: {task.type === 'skin' ? 'پوست' : 'مو'})
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSuggestionModalOpen(false)}>فعلاً نه</Button>
            <Button onClick={handleAddSuggestion} className="bg-brand-primary hover:bg-brand-primary/90">
              <PlusCircle className="w-4 h-4 ml-2" />
              افزودن به روتین من
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};