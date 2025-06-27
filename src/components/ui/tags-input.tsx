
"use client";

import React, { useState } from 'react';
import { Input } from './input';
import { Badge } from './badge';
import { Button } from './button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string[];
    onChange: (tags: string[]) => void;
}

export function TagsInput({ value, onChange, placeholder, ...props }: TagsInputProps) {
    const [inputValue, setInputValue] = useState('');

    const addTag = (tag: string) => {
        const newTag = tag.trim();
        if (newTag && !value.includes(newTag)) {
            onChange([...value, newTag]);
        }
        setInputValue('');
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        }
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {value.map(tag => (
                    <Badge key={tag} variant="secondary" className="pl-3 pr-1">
                        {tag}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-auto w-auto p-0.5 ml-1"
                            onClick={() => removeTag(tag)}
                        >
                            <X className="w-3 h-3" />
                            <span className="sr-only">Remove {tag}</span>
                        </Button>
                    </Badge>
                ))}
            </div>
            <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => addTag(inputValue)}
                placeholder={placeholder}
                {...props}
            />
        </div>
    );
}
