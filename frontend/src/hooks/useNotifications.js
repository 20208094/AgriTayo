import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // Adjust path as needed

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    async function fetchUserSession() {
      try {
        const response = await fetch('/api/session', {
          headers: {
            'x-api-key': API_KEY
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserId(data.user_id);
        } else {
          console.error('Failed to fetch user session:', response.statusText);
        }
      } catch (err) {
        console.error('Error fetching user session:', err.message);
      }
    }

    fetchUserSession();
  }, [API_KEY]);

  useEffect(() => {
    if (userId) {
      // Fetch notifications initially
      const fetchNotifications = async () => {
        try {
          const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", userId);

          if (error) throw error;
          setNotifications(data);
        } catch (error) {
          console.error("Error fetching notifications:", error.message);
        }
      };

      fetchNotifications();

      // Subscribe to real-time changes
      const subscription = supabase
        .channel('public:notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, payload => {
          setNotifications(prevNotifications => [payload.new, ...prevNotifications]);
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, payload => {
          setNotifications(prevNotifications => 
            prevNotifications.map(notification => 
              notification.id === payload.new.id ? payload.new : notification
            )
          );
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, payload => {
          setNotifications(prevNotifications => 
            prevNotifications.filter(notification => notification.id !== payload.old.id)
          );
        })
        .subscribe();

      // Cleanup on component unmount
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId]);

  return notifications;
};

export default useNotifications;
