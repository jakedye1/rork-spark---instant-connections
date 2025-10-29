import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";

export type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: Date;
};

export type Friend = {
  id: string;
  name: string;
  age: string;
  interests: string[];
  addedAt: Date;
  lastMessage?: string;
  lastMessageTime?: Date;
  isOnline: boolean;
  messages?: Message[];
};

type FriendsContextType = {
  friends: Friend[];
  isLoading: boolean;
  addFriend: (friend: Omit<Friend, "id" | "addedAt">) => Promise<string>;
  removeFriend: (friendId: string) => Promise<void>;
  getFriend: (friendId: string) => Friend | undefined;
  updateLastMessage: (friendId: string, message: string) => Promise<void>;
  addMessage: (friendId: string, message: Omit<Message, "id" | "timestamp">) => Promise<void>;
  getMessages: (friendId: string) => Message[];
};

const FRIENDS_STORAGE_KEY = "@spark_friends";

export const [FriendsProvider, useFriends] = createContextHook<FriendsContextType>(() => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFriends = useCallback(async (isAuthLoading: boolean) => {
    if (isAuthLoading) {
      return;
    }

    if (!user) {
      setFriends([]);
      setIsLoading(false);
      return;
    }

    try {
      const key = `${FRIENDS_STORAGE_KEY}_${user.id}`;
      const stored = await AsyncStorage.getItem(key);
      
      if (stored) {
        try {
          const parsedFriends = JSON.parse(stored);
          const friendsWithDates = parsedFriends.map((f: Friend) => ({
            ...f,
            addedAt: new Date(f.addedAt),
            lastMessageTime: f.lastMessageTime ? new Date(f.lastMessageTime) : undefined,
            messages: f.messages ? f.messages.map((m: Message) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })) : [],
          }));
          setFriends(friendsWithDates);
        } catch (parseError) {
          console.error("Failed to parse friends data:", parseError);
          console.log('Corrupted friends data detected, resetting friends');
          setFriends([]);
          await AsyncStorage.removeItem(key).catch(err => {
            console.error('Failed to remove corrupted friends data:', err);
          });
        }
      }
    } catch (error) {
      console.error("Failed to load friends:", error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFriends(isAuthLoading);
  }, [user?.id, isAuthLoading, loadFriends]);

  const saveFriends = useCallback(async (updatedFriends: Friend[]) => {
    if (!user) return;

    try {
      const key = `${FRIENDS_STORAGE_KEY}_${user.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(updatedFriends));
    } catch (error) {
      console.error("Failed to save friends:", error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }, [user]);

  const addFriend = useCallback(async (friend: Omit<Friend, "id" | "addedAt">) => {
    if (!user) {
      console.error("No user logged in");
      throw new Error("Not authenticated");
    }

    const friendId = Date.now().toString();
    const newFriend: Friend = {
      ...friend,
      id: friendId,
      addedAt: new Date(),
      messages: [],
    };

    const updatedFriends = [...friends, newFriend];
    setFriends(updatedFriends);
    await saveFriends(updatedFriends);
    
    console.log("Friend added successfully:", newFriend);
    return friendId;
  }, [friends, saveFriends, user]);

  const removeFriend = useCallback(async (friendId: string) => {
    const updatedFriends = friends.filter((f) => f.id !== friendId);
    setFriends(updatedFriends);
    await saveFriends(updatedFriends);
  }, [friends, saveFriends]);

  const getFriend = useCallback((friendId: string) => {
    return friends.find((f) => f.id === friendId);
  }, [friends]);

  const updateLastMessage = useCallback(async (friendId: string, message: string) => {
    const updatedFriends = friends.map((f) =>
      f.id === friendId
        ? { ...f, lastMessage: message, lastMessageTime: new Date() }
        : f
    );
    setFriends(updatedFriends);
    await saveFriends(updatedFriends);
  }, [friends, saveFriends]);

  const addMessage = useCallback(async (friendId: string, message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    const updatedFriends = friends.map((f) => {
      if (f.id === friendId) {
        const messages = f.messages || [];
        return {
          ...f,
          messages: [...messages, newMessage],
          lastMessage: newMessage.text,
          lastMessageTime: newMessage.timestamp,
        };
      }
      return f;
    });

    setFriends(updatedFriends);
    await saveFriends(updatedFriends);
  }, [friends, saveFriends]);

  const getMessages = useCallback((friendId: string) => {
    const friend = friends.find((f) => f.id === friendId);
    return friend?.messages || [];
  }, [friends]);

  return useMemo(
    () => ({
      friends,
      isLoading,
      addFriend,
      removeFriend,
      getFriend,
      updateLastMessage,
      addMessage,
      getMessages,
    }),
    [friends, isLoading, addFriend, removeFriend, getFriend, updateLastMessage, addMessage, getMessages]
  );
});
