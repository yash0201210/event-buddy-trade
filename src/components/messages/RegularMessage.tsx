
import React from 'react';

interface RegularMessageProps {
  message: {
    id: string;
    content: string;
    created_at: string;
  };
  isOwn: boolean;
}

export const RegularMessage = ({ message, isOwn }: RegularMessageProps) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-md px-4 py-3 rounded-lg ${
        isOwn 
          ? 'bg-red-600 text-white' 
          : 'bg-gray-100 border border-gray-200'
      }`}>
        <div className="whitespace-pre-line text-sm">{message.content}</div>
        <p className={`text-xs mt-2 ${isOwn ? 'text-red-100' : 'text-gray-500'}`}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};
