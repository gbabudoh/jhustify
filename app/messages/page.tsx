'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { MessageSquare, Search, User, Clock, CheckCircle, AlertCircle, Reply, Trash2, Archive, Star, ArrowLeft } from 'lucide-react';

interface Message {
  _id: string;
  businessId: {
    _id: string;
    businessName: string;
    category: string;
  };
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  sender?: {
    name: string;
    email: string;
  };
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

  useEffect(() => {
    // Simulate loading messages
    const mockMessages: Message[] = [
      {
        _id: '1',
        businessId: {
          _id: 'biz1',
          businessName: 'Sample Business',
          category: 'Technology'
        },
        subject: 'Welcome to Jhustify!',
        message: 'Thank you for joining Jhustify. Get started by verifying your business to build trust with customers.',
        status: 'unread',
        priority: 'high',
        createdAt: new Date().toISOString(),
        sender: {
          name: 'Jhustify Team',
          email: 'support@jhustify.com'
        }
      }
    ];
    
    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || msg.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <AlertCircle className="text-orange-500" size={16} />;
      case 'read': return <CheckCircle className="text-blue-500" size={16} />;
      case 'replied': return <Reply className="text-green-500" size={16} />;
      default: return <MessageSquare className="text-gray-500" size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6d6e6b]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0 w-full md:w-auto">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-3 text-center md:text-left">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6d6e6b] to-[#6B7280] rounded-xl flex items-center justify-center shrink-0">
                    <MessageSquare className="text-white" size={24} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-[#6d6e6b] mb-1">Messages</h1>
                    <p className="text-gray-600 text-sm md:text-base">Manage your business communications</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center md:justify-end w-full md:w-auto">
                <Button variant="primary" className="bg-gradient-to-r from-[#6d6e6b] to-[#6B7280]" asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white border-gray-200 mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d6e6b]"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <Button
                    variant={filterStatus === 'all' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === 'unread' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('unread')}
                  >
                    Unread
                  </Button>
                  <Button
                    variant={filterStatus === 'read' ? 'primary' : 'outline'}
                    size="sm"
                    className="flex-1 md:flex-none"
                    onClick={() => setFilterStatus('read')}
                  >
                    Read
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Messages Layout - Stack on mobile, grid on desktop */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
            {/* Inbox List (Hide on mobile if a message is selected) */}
            <div className={`lg:col-span-1 ${selectedMessage ? 'hidden lg:block' : 'block'}`}>
              <Card className="bg-white border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#6d6e6b] mb-4">Inbox</h3>
                  <div className="space-y-3">
                    {filteredMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="text-gray-400 mx-auto mb-3" size={48} />
                        <p className="text-gray-500">No messages found</p>
                      </div>
                    ) : (
                      filteredMessages.map((message) => (
                        <div
                          key={message._id}
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedMessage?._id === message._id
                              ? 'border-[#6d6e6b] bg-[#6d6e6b] bg-opacity-5'
                              : 'border-gray-200 hover:border-[#6d6e6b] hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">{getStatusIcon(message.status)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-[#6d6e6b] truncate">
                                  {message.subject}
                                </h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(message.priority)}`}>
                                  {message.priority}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate mb-2">
                                {message.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {message.sender?.name || 'Unknown'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Message Detail (Hide on mobile if NO message is selected) */}
            <div className={`lg:col-span-2 ${!selectedMessage ? 'hidden lg:block' : 'block'}`}>
              {selectedMessage ? (
                <Card className="bg-white border-gray-200">
                  <div className="p-4 md:p-6">
                    <div className="border-b border-gray-200 pb-4 mb-4">
                      {/* Mobile Back Button to Return to Inbox List */}
                      <button 
                        className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200"
                        onClick={() => setSelectedMessage(null)}
                      >
                        <ArrowLeft size={16} /> Back to Inbox
                      </button>

                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-3">
                        <h2 className="text-lg md:text-xl font-semibold text-[#6d6e6b] break-words">
                          {selectedMessage.subject}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedMessage.priority)}`}>
                            {selectedMessage.priority}
                          </span>
                          <Button variant="ghost" size="sm">
                            <Star size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Archive size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600 mt-2">
                        <div className="flex items-center gap-1 md:gap-2">
                          <User size={14} className="md:w-4 md:h-4" />
                          <span className="truncate max-w-[120px] md:max-w-none">{selectedMessage.sender?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          <Clock size={14} className="md:w-4 md:h-4" />
                          <span>{new Date(selectedMessage.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          {getStatusIcon(selectedMessage.status)}
                          <span className="capitalize">{selectedMessage.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:gap-3">
                      <Button variant="primary" className="bg-gradient-to-r from-[#6d6e6b] to-[#6B7280] flex-1 md:flex-none">
                        <Reply className="mr-2" size={16} />
                        Reply
                      </Button>
                      <Button variant="outline" className="flex-1 md:flex-none">
                        <Archive className="mr-2" size={16} />
                        Archive
                      </Button>
                      <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 flex-none w-full md:w-auto mt-2 md:mt-0">
                        <Trash2 className="mr-2" size={16} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="bg-white border-gray-200">
                  <div className="p-12 text-center">
                    <MessageSquare className="text-gray-400 mx-auto mb-4" size={64} />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Select a message</h3>
                    <p className="text-gray-500">Choose a message from the inbox to view its details</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
