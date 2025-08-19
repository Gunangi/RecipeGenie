'use client';

import { useState } from 'react';
import { Button } from "./ui/button";
import { Settings } from "lucide-react";
import { SettingsDialog } from './settings-dialog';

export function SettingsButton() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    return (
        <>
            <Button variant="ghost" className="justify-start gap-2 w-full" onClick={() => setIsSettingsOpen(true)}>
                <Settings className="w-5 h-5" />
                <span>Settings</span>
            </Button>
            <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
        </>
    )
}