import React, { useState, useRef, useEffect } from 'react';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>(['Welcome to WebOS Terminal v1.0', 'Type "help" for available commands.']);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    
    let output = '';
    
    switch (command) {
      case 'help':
        output = 'Available commands: help, clear, echo, whoami, contact, date';
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'echo':
        output = args.slice(1).join(' ');
        break;
      case 'whoami':
        output = 'guest@webos';
        break;
      case 'contact':
        output = 'Email: henry@example.com\nGitHub: github.com/henry';
        break;
      case 'date':
        output = new Date().toString();
        break;
      case '':
        break;
      default:
        output = `Command not found: ${command}`;
    }

    setHistory(prev => [...prev, `guest@webos:~$ ${cmd}`, output].filter(Boolean));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="h-full bg-black text-green-400 p-4 font-mono text-sm overflow-auto" onClick={() => document.getElementById('term-input')?.focus()}>
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
      ))}
      <div className="flex">
        <span className="mr-2 text-blue-400">guest@webos:~$</span>
        <input
          id="term-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none text-green-400"
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
