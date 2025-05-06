"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, MessageCircle, Send, Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";


type Student = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
};

type Conversation = {
    _id: string;
    student: Student;
    teacher: string;
};

type Message = {
    senderType: "Student" | "Teacher";
    content: string;
    timestamp?: string;
};

let socket: Socket;

function getRandomColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
}

export default function Chat() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // obtenir socket io
    useEffect(() => {
        socket = io("http://localhost:5007", { withCredentials: true });

        socket.on("connect", () => {
            console.log("✅ Connected to socket.io server");
        });

        socket.on("receiveMessage", (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);
    // obtenir all conversations
    useEffect(() => {
        async function fetchConversations() {
            try {
                const res = await fetch("http://localhost:5007/chat/conversations/teacher", {
                    credentials: "include",
                });
                const data = await res.json();
                setConversations(data);
            } catch (err) {
                console.error("❌ Failed to load conversations", err);
            }
        }

        fetchConversations();
    }, []);
    // obtenir all messages d'une conversation
    useEffect(() => {
        if (!selectedConversation) return;

        async function fetchMessages() {
            try {
                const res = await fetch(`http://localhost:5007/chat/messages/${selectedConversation}`, {
                    credentials: "include",
                });
                const data = await res.json();
                setMessages(data);
            } catch (err) {
                console.error("❌ Failed to load messages", err);
            }
        }

        fetchMessages();
    }, [selectedConversation]);
    // scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    // send message
    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const msg: Message = {
            senderType: "Teacher",
            content: newMessage,
        };
        const selectedConv = conversations.find(conv => conv._id === selectedConversation);
        const teacherId = selectedConv?.teacher;

        if (!teacherId) {
            console.error("❌ Impossible de trouver le teacherId pour la conversation sélectionnée");
            return;
        }

        // Envoyer le message au teacher via socket.io
            socket.emit("send_message", {
                conversation: selectedConversation,
                senderType: msg.senderType,
                content: msg.content,
                senderId: teacherId, 
            });

        // Display instantly
        setMessages((prev) => [...prev, msg]);
        setNewMessage("");
    };

    return (
        <div className="flex h-screen items-center bg-gray-100">
            <Dialog>
                <ResizablePanelGroup direction="horizontal" className="max-w-[1200px] p-10">
                    <ResizablePanel defaultSize={25} className="rounded-l-xl border-y border-l bg-white">
                        <ScrollArea className="h-full w-full">
                            <div className="p-4 border-b flex items-center justify-center gap-2 w-full">
                                <MessageCircle className="w-5 h-5 text-blue-500" />
                                <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
                            </div>
                            {conversations.map((conv) => {
                                const initials = `${conv.student.firstName[0]}${conv.student.lastName[0]}`.toUpperCase();
                                const bgColor = getRandomColor(conv.student.firstName + conv.student.lastName);
                                return (
                                    <div
                                        key={conv._id}
                                        className="flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition rounded-md shadow-sm cursor-pointer"
                                        onClick={() => setSelectedConversation(conv._id)}
                                    >
                                        <div
                                            className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-sm"
                                            style={{ backgroundColor: bgColor }}
                                        >
                                            {initials}
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {conv.student.firstName} {conv.student.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500">{conv.student.email}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </ScrollArea>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={75} className="rounded-r-xl border-y border-r bg-white">
                        <div className="h-full flex flex-col">
                            <ScrollArea className="flex-1 max-h-[527px] overflow-y-auto p-5">
                            <div className="flex flex-col gap-2">
                                {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`max-w-[70%] p-2 rounded-md shadow text-sm ${
                                    msg.senderType === "Teacher"
                                        ? "bg-blue-100 self-end"
                                        : "bg-gray-200 self-start"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            </ScrollArea>
                            <div className="flex gap-2 p-5 border-t">
                                <Button size="icon" variant="outline" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                    <Smile />
                                </Button>
                                {showEmojiPicker && (
                                    <div className="absolute top-110 left-95 z-10">
                                        <Picker
                                        data={data}
                                        theme="light"
                                        onEmojiSelect={(emoji: any) => {
                                            setNewMessage((prev) => prev + emoji.native);
                                        }}
                                        />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    placeholder="Écrire un message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-sm"
                                />
                                <Button size="icon" variant="outline">
                                    <Image />
                                </Button>
                                <Button size="icon" className="bg-blue-400" onClick={handleSendMessage}>
                                    <Send className="text-white" />
                                </Button>
                            </div>
                        </div>
                    </ResizablePanel>

                </ResizablePanelGroup>
            </Dialog>
        </div>
    );
}
