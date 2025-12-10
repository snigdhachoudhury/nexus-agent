import { X, Send, Paperclip, Phone, Video, Image } from 'lucide-react';
import { useState } from 'react';
import type { Request } from '../../App';

interface AssistModalProps {
  request: Request;
  onClose: () => void;
}

export function AssistModal({ request, onClose }: AssistModalProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'customer', text: request.preview, time: request.timestamp },
    { id: 2, sender: 'system', text: 'Sarah Johnson has joined the chat', time: 'Just now' }
  ]);

  const suggestedResponses = [
    "I'd be happy to help you find that!",
    "Let me check our current inventory",
    "I can recommend some similar options",
    "Would you like to schedule a fitting?"
  ];

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'associate',
        text: message,
        time: 'Just now'
      }]);
      setMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-5xl h-[85vh] bg-white rounded-lg overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={request.customerAvatar}
              alt={request.customerName}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-sm text-gray-900">{request.customerName}</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'associate' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'system' ? (
                    <div className="text-center w-full">
                      <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs">
                        {msg.text}
                      </span>
                    </div>
                  ) : (
                    <div className={`max-w-md ${msg.sender === 'associate' ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-block px-4 py-2.5 rounded-lg text-sm ${
                          msg.sender === 'associate'
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">{msg.time}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Responses */}
            <div className="px-6 pb-3 border-t border-gray-100 pt-3">
              <div className="text-gray-500 text-xs mb-2">Quick Responses</div>
              <div className="flex flex-wrap gap-2">
                {suggestedResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(response)}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 transition-colors"
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-5 border-t border-gray-200">
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Image className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300"
                />
                <button
                  onClick={handleSend}
                  className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 border-l border-gray-200 p-5 overflow-y-auto">
            <h3 className="text-sm text-gray-900 mb-4">Request Details</h3>
            
            {/* Product Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <img
                src={request.productImage}
                alt="Product"
                className="w-full h-36 rounded-lg object-cover mb-3"
              />
              <div className="text-sm text-gray-900 mb-1">{request.productName}</div>
              <div className="text-xs text-gray-500">{request.category}</div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-xs text-gray-500 mb-3">Customer Information</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Name:</span>
                  <span className="text-gray-900">{request.customerName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Priority:</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    request.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {request.priority}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-gray-900">{request.status}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button className="w-full px-4 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                Mark as Resolved
              </button>
              <button className="w-full px-4 py-2.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Transfer Request
              </button>
              <button className="w-full px-4 py-2.5 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                Escalate Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
