import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";

export type ChatMessage = {
  id: string;
  text: string;
  sender: "me" | "them" | string;
  timestamp: Date;
};

export type ChatType = "date" | "group" | "friend";

export type Chat = {
  id: string;
  type: ChatType;
  name: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastMessage?: string;
  lastMessageTime?: Date;
  isActive: boolean;
  participantName?: string;
  participantAge?: string;
};

type ChatsContextType = {
  chats: Chat[];
  isLoading: boolean;
  addChat: (chat: Omit<Chat, "id" | "createdAt" | "messages">) => Promise<string>;
  addMessage: (chatId: string, message: Omit<ChatMessage, "id" | "timestamp">) => Promise<void>;
  getChat: (chatId: string) => Chat | undefined;
  getMessages: (chatId: string) => ChatMessage[];
  markChatInactive: (chatId: string) => Promise<void>;
  getActiveChats: () => Chat[];
};

const CHATS_STORAGE_KEY = "@spark_chats";

export const [ChatsProvider, useChats] = createContextHook<ChatsContextType>(() => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadChats = useCallback(async (isAuthLoading: boolean) => {
    if (isAuthLoading) {
      return;
    }

    if (!user) {
      setChats([]);
      setIsLoading(false);
      return;
    }

    try {
      const key = `${CHATS_STORAGE_KEY}_${user.id}`;
      const stored = await AsyncStorage.getItem(key);
      
      if (stored) {
        try {
          const parsedChats = JSON.parse(stored);
          const chatsWithDates = parsedChats.map((c: Chat) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            lastMessageTime: c.lastMessageTime ? new Date(c.lastMessageTime) : undefined,
            messages: c.messages ? c.messages.map((m: ChatMessage) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })) : [],
          }));
          setChats(chatsWithDates);
        } catch (parseError) {
          console.error("Failed to parse chats data:", parseError);
          console.log('Corrupted chat data detected, resetting chats');
          setChats([]);
          await AsyncStorage.removeItem(key).catch(err => {
            console.error('Failed to remove corrupted chat data:', err);
          });
        }
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
      console.error("Error details:", error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadChats(isAuthLoading);
  }, [user?.id, isAuthLoading, loadChats]);

  const saveChats = useCallback(async (updatedChats: Chat[]) => {
    if (!user) return;

    try {
      const key = `${CHATS_STORAGE_KEY}_${user.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(updatedChats));
    } catch (error) {
      console.error("Failed to save chats:", error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }, [user]);

  const addChat = useCallback(async (chat: Omit<Chat, "id" | "createdAt" | "messages">) => {
    if (!user) {
      console.error("No user logged in");
      throw new Error("Not authenticated");
    }

    const chatId = Date.now().toString();
    const newChat: Chat = {
      ...chat,
      id: chatId,
      createdAt: new Date(),
      messages: [],
    };

    const updatedChats = [...chats, newChat];
    setChats(updatedChats);
    await saveChats(updatedChats);
    
    console.log("Chat created successfully:", newChat);
    return chatId;
  }, [chats, saveChats, user]);

  const addMessage = useCallback(async (chatId: string, message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    const updatedChats = chats.map((c) => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: newMessage.text,
          lastMessageTime: newMessage.timestamp,
        };
      }
      return c;
    });

    setChats(updatedChats);
    await saveChats(updatedChats);
  }, [chats, saveChats]);

  const getChat = useCallback((chatId: string) => {
    return chats.find((c) => c.id === chatId);
  }, [chats]);

  const getMessages = useCallback((chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    return chat?.messages || [];
  }, [chats]);

  const markChatInactive = useCallback(async (chatId: string) => {
    const updatedChats = chats.map((c) =>
      c.id === chatId ? { ...c, isActive: false } : c
    );
    setChats(updatedChats);
    await saveChats(updatedChats);
  }, [chats, saveChats]);

  const getActiveChats = useCallback(() => {
    return chats.filter((c) => c.isActive);
  }, [chats]);

  return useMemo(
    () => ({
      chats,
      isLoading,
      addChat,
      addMessage,
      getChat,
      getMessages,
      markChatInactive,
      getActiveChats,
    }),
    [chats, isLoading, addChat, addMessage, getChat, getMessages, markChatInactive, getActiveChats]
  );
});
