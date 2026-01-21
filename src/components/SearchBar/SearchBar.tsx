'use client';

import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  size?: 'default' | 'large';
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Search for any game...', 
  autoFocus = false,
  size = 'default'
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        onChange('');
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onChange]);

  const isLarge = size === 'large';

  return (
    <motion.div 
      className="relative group w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-indigo-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500 ${isLarge ? 'blur-2xl' : ''}`} />
      
      <div className="relative">
        <motion.div 
          className={`absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors duration-200`}
          whileHover={{ scale: 1.1 }}
        >
          <Search className={isLarge ? 'h-6 w-6' : 'h-5 w-5'} />
        </motion.div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`
            w-full bg-[#131316] border-2 border-white/10 rounded-2xl text-white 
            placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 
            focus:bg-[#18181b] transition-all duration-300
            ${isLarge 
              ? 'h-20 pl-16 pr-16 text-xl' 
              : 'h-14 pl-14 pr-14 text-base'
            }
          `}
        />
        
        {value ? (
          <motion.button
            onClick={() => onChange('')}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors ${isLarge ? 'right-6' : 'right-4'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className={isLarge ? 'h-6 w-6' : 'h-5 w-5'} />
          </motion.button>
        ) : (
          <div className={`absolute top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 ${isLarge ? 'right-6' : 'right-4'}`}>
            <kbd className={`px-2 py-1 bg-white/5 rounded-lg border border-white/10 text-gray-500 font-mono ${isLarge ? 'text-sm' : 'text-xs'}`}>⌘</kbd>
            <kbd className={`px-2 py-1 bg-white/5 rounded-lg border border-white/10 text-gray-500 font-mono ${isLarge ? 'text-sm' : 'text-xs'}`}>K</kbd>
          </div>
        )}
      </div>
    </motion.div>
  );
}
