"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Send, Smile } from "lucide-react";
import Header from "@/components/header";
import Picker from "@emoji-mart/react";


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

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
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

  // get the conversation
  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("http://localhost:5007/chat/conversation", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        setSelectedConversation(data.conversation);
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
        const res = await fetch(
          `http://localhost:5007/chat/messages/${selectedConversation?._id}`,
          {
            credentials: "include",
          }
        );
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

  // send message from student to teacher
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const msg: Message = {
      senderType: "Student",
      content: newMessage,
    };
    const studentId = selectedConversation?.student;

    if (!studentId) {
      console.error(
        "❌ Impossible de trouver le studentId pour la conversation sélectionnée"
      );
      return;
    }

    // Envoyer le message au teacher via socket.io
    socket.emit("send_message", {
      conversation: selectedConversation,
      senderType: msg.senderType,
      content: msg.content,
      senderId: studentId,
    });

    // Display instantly
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-[1400px] px-[50px] gap-10 w-full">
        <Header chat />
        <div className="flex flex-col items-center justify-center">
          <div className="flex h-[80vh] w-[50vw] items-center [@media(max-width:755px)]:w-full">
            <Dialog>
              <ResizablePanelGroup
                direction="horizontal"
                className="max-w-full"
              >
                <ResizablePanel
                  defaultSize={75}
                  className="rounded-xl border-r-5 border-b-5 border-3 border-black bg-white relative"
                >
                  <div className="h-full flex flex-col">
                    <ScrollArea className="flex-1 max-h-[527px] overflow-y-auto p-5">
                      <div className="flex flex-col gap-2">
                        {messages.map((msg, index) => (
                          <div
                            key={index}
                            className={`max-w-[70%] p-2 rounded-md shadow text-sm ${
                              msg.senderType === "Student"
                                ? "bg-green-300 self-end"
                                : "bg-gray-200 self-start"
                            }`}
                          >
                            {msg.content}
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2 p-5 border-t-5 border-black items-center [@media(max-width:498px)]:flex-col [@media(max-width:498px)]:items-center">
                      <input
                        type="text"
                        placeholder="Write a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 px-4 py-2 min-w-0 rounded-sm border-3 cursor-pointer placeholder:text-black border-black border-b-5 border-r-5  focus:outline-none focus:ring-2 shadow-sm text-sm"
                      />
                      <div className="flex gap-2 overflow-x-auto scroll-container">
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-3 cursor-pointer border-black border-b-5 border-r-5"
                        >
                          <Image />
                        </Button>
                        <Button
                          size="icon"
                          className="hover:cursor-pointer border-3 cursor-pointer border-black border-b-5 border-r-5"
                          variant="outline"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <Smile />
                        </Button>
                        {showEmojiPicker && (
                          <div className="absolute top-5 right-5 z-10 [@media(max-width:498px)]:w-[90%] overflow-x-auto scroll-container">
                            <Picker
                              
                              theme="light"
                              onEmojiSelect={(emoji: any) => {
                                setNewMessage((prev) => prev + emoji.native);
                              }}
                            />
                          </div>
                        )}
                        <Button
                          size="icon"
                          className="bg-[var(--main-green)] hover:bg-green-600 border-3 cursor-pointer border-black border-b-5 border-r-5"
                          onClick={handleSendMessage}
                        >
                          <Send className="text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
