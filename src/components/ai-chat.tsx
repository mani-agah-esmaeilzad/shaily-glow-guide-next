'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, X, PlusCircle } from 'lucide-react';
import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';
import type { UserProfile, Task } from '@/types';

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
  profileInfo += `- نام: ${profile.name}\n- سن: ${profile.age}\n- شغل: ${profile.job}\n`;
  profileInfo += `- نوع پوست: ${profile.skinType}\n- نگرانی‌های پوستی: ${profile.skinConcerns.join('، ') || 'ندارد'}\n`;
  profileInfo += `- نوع مو: ${profile.hairType}\n- نگرانی‌های مو: ${profile.hairConcerns.join('، ') || 'ندارد'}\n`;
  
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

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, suggestedTasks]);

  const handleAddSuggestion = () => {
    if (suggestedTasks) {
      onAddTasks(suggestedTasks);
      setSuggestedTasks(null); // Clear suggestion after adding
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setSuggestedTasks(null); // Clear previous suggestions

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('fa-IR'),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) throw new Error("Gemini API key not found!");
        
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

      // Extract and parse suggestion
      const suggestionRegex = /<SUGGESTION>([\s\S]*?)<\/SUGGESTION>/;
      const match = text.match(suggestionRegex);

      if (match && match[1]) {
        try {
          const parsedTasks = JSON.parse(match[1]);
          setSuggestedTasks(parsedTasks);
          // Remove the suggestion block from the main text
          text = text.replace(suggestionRegex, '').trim();
        } catch (e) {
          console.error("Failed to parse suggestion JSON:", e);
        }
      }

      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        text: text,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('fa-IR'),
      };
      
      if (text) { // Only add message if there is text left
        setMessages((prev) => [...prev, aiMessage]);
      }

    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: 'متأسفانه در ارتباط با هوش مصنوعی خطایی رخ داد.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('fa-IR'),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">🤖 مشاوره با شایلی</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-lg mb-2">سلام! من شایلی هستم 👋</p>
                  <p className="text-sm">درباره پوست و موهایت از من بپرس</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">شایلی در حال تایپ است...</span>
                    </div>
                  </div>
                </div>
              )}

              {suggestedTasks && (
                <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
                    <h4 className="font-semibold mb-2">پیشنهاد شایلی برای روتین شما:</h4>
                    <ul className="space-y-1 list-disc list-inside text-sm">
                        {suggestedTasks.map((task, index) => (
                            <li key={index}>{task.title} ({task.time === 'morning' ? 'صبح' : 'شب'})</li>
                        ))}
                    </ul>
                    <Button onClick={handleAddSuggestion} className="mt-4 w-full">
                        <PlusCircle className="w-4 h-4 ml-2" />
                        افزودن به روتین من
                    </Button>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="سوالت رو بپرس..."
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="lg"
                className="px-6"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              اطلاعات ارائه شده صرفاً جنبه آموزشی دارد و جایگزین مشاوره پزشک نیست
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
