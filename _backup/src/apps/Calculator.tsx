import React, { useState } from 'react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    const currentValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(currentValue);
    } else if (operator) {
      const result = calculate(prevValue, currentValue, operator);
      setPrevValue(result);
      setDisplay(String(result));
    }

    setWaitingForNewValue(true);
    setOperator(op);
  };

  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return a / b;
      default: return b;
    }
  };

  const handleEqual = () => {
    if (operator && prevValue !== null) {
      const currentValue = parseFloat(display);
      const result = calculate(prevValue, currentValue, operator);
      setDisplay(String(result));
      setPrevValue(null);
      setOperator(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handlePercent = () => {
    const currentValue = parseFloat(display);
    setDisplay(String(currentValue / 100));
  };

  const handleSign = () => {
    const currentValue = parseFloat(display);
    setDisplay(String(currentValue * -1));
  };

  const btnClass = (color: string, wide: boolean = false) => 
    `h-full w-full rounded-full text-xl font-medium flex items-center ${wide ? 'pl-6 justify-start' : 'justify-center'} transition-all active:brightness-125 ${color} ${wide ? 'col-span-2 aspect-[2/1]' : 'aspect-square'}`;

  return (
    <div className="h-full w-full bg-[#323232] flex flex-col p-4 select-none">
      <div className="flex-1 flex items-end justify-end text-white text-5xl font-light mb-4 px-2 break-all">
        {display}
      </div>
      
      <div className="grid grid-cols-4 gap-3 w-full max-w-[400px] mx-auto">
        <button onClick={handleClear} className={btnClass("bg-[#A5A5A5] text-black")}>{display === '0' ? 'AC' : 'C'}</button>
        <button onClick={handleSign} className={btnClass("bg-[#A5A5A5] text-black")}>+/-</button>
        <button onClick={handlePercent} className={btnClass("bg-[#A5A5A5] text-black")}>%</button>
        <button onClick={() => handleOperator('÷')} className={btnClass(operator === '÷' ? "bg-white text-orange-500" : "bg-[#FF9F0A] text-white")}>÷</button>

        <button onClick={() => handleNumber('7')} className={btnClass("bg-[#555555] text-white")}>7</button>
        <button onClick={() => handleNumber('8')} className={btnClass("bg-[#555555] text-white")}>8</button>
        <button onClick={() => handleNumber('9')} className={btnClass("bg-[#555555] text-white")}>9</button>
        <button onClick={() => handleOperator('×')} className={btnClass(operator === '×' ? "bg-white text-orange-500" : "bg-[#FF9F0A] text-white")}>×</button>

        <button onClick={() => handleNumber('4')} className={btnClass("bg-[#555555] text-white")}>4</button>
        <button onClick={() => handleNumber('5')} className={btnClass("bg-[#555555] text-white")}>5</button>
        <button onClick={() => handleNumber('6')} className={btnClass("bg-[#555555] text-white")}>6</button>
        <button onClick={() => handleOperator('-')} className={btnClass(operator === '-' ? "bg-white text-orange-500" : "bg-[#FF9F0A] text-white")}>-</button>

        <button onClick={() => handleNumber('1')} className={btnClass("bg-[#555555] text-white")}>1</button>
        <button onClick={() => handleNumber('2')} className={btnClass("bg-[#555555] text-white")}>2</button>
        <button onClick={() => handleNumber('3')} className={btnClass("bg-[#555555] text-white")}>3</button>
        <button onClick={() => handleOperator('+')} className={btnClass(operator === '+' ? "bg-white text-orange-500" : "bg-[#FF9F0A] text-white")}>+</button>

        <button onClick={() => handleNumber('0')} className={btnClass("bg-[#555555] text-white", true)}>0</button>
        <button onClick={() => handleNumber('.')} className={btnClass("bg-[#555555] text-white")}>.</button>
        <button onClick={handleEqual} className={btnClass("bg-[#FF9F0A] text-white")}>=</button>
      </div>
    </div>
  );
};
