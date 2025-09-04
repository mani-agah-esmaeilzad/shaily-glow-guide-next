'use client';

import React, { use } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarDisplay } from './ui/avatar-display';
import { User, Settings, BarChart3, Gem, LogOut } from 'lucide-react';
import Link from 'next/link';

interface UserMenuProps {
    user: any;
    onLogout: () => void;
    onOpenProfile: () => void;
    onOpenSettings: () => void;
    onOpenReport: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onOpenProfile, onOpenSettings, onOpenReport }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                    <AvatarDisplay avatarUrl={user.avatarUrl}  gender={user.gender} name={user.name} size="lg" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.mobile}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onOpenProfile} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>پروفایل کاربری</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={onOpenSettings} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>تنظیمات</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={onOpenReport} className="cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>گزارش هفتگی</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/subscribe">
                    <DropdownMenuItem className="cursor-pointer text-brand-primary focus:text-brand-primary">
                        <Gem className="mr-2 h-4 w-4" />
                        <span>خرید اشتراک</span>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>خروج</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};