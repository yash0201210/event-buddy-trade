
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
      <div className={`max-w-md px-4 py-3 rounded-2xl ${
        isOwn 
          ? 'bg-blue-600 text-white ml-4' 
          : 'bg-gray-100 text-gray-900 border border-gray-200 mr-4'
      }`}>
        <div className="whitespace-pre-line text-sm leading-relaxed">{message.content}</div>
        <p className={`text-xs mt-2 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};
