import React, { useState } from 'react';
import { Send, Settings, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';

type Message = {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}

const LightChatUI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { id: messages.length + 1, text: inputMessage, sender: "You", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setInputMessage('');
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSaveApiKey = () => {
    console.log('API Key saved:', apiKey);
  };

  return (
    <div className="bg-white text-gray-800 h-[93vh] flex flex-col">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Get AI help to prototype your UI.</h2>
            <div className="mt-2 flex space-x-4 text-sm">
              <div>
                <span className="text-gray-600">Model</span>
                <span className="ml-2 font-medium">gpt-3.5-turbo</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleNewChat}>
              <PlusCircle className="mr-2 h-4 w-4" /> New Chat
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" /> Config
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>API Configuration</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                    API Key
                  </label>
                  <Input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="mt-1"
                    placeholder="Enter your API key"
                  />
                </div>
                <Button onClick={handleSaveApiKey}>Save API Key</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 justify-center items-center">
                {message.sender === "You" ? <img src='/user-icon.png' alt='you' /> : <img src='/html-bot-icon.png' alt='system' />}
              </div>
              <div className="flex-1 px-2">
                <div className="flex items-center">
                  <span className="font-semibold">{message.sender}</span>
                  <span className="ml-2 text-xs text-gray-500">{message.timestamp}</span>
                </div>
                <p className="mt-1 text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex items-center bg-gray-100 rounded-md border">
            <input
              type="text"
              placeholder="Write a message..."
              className="flex-1 bg-transparent p-2 focus:outline-none"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              className="p-2 pr-3 text-blue-500 hover:text-blue-600"
              onClick={handleSendMessage}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightChatUI;