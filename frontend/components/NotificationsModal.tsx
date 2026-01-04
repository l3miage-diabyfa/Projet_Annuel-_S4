"use client";

import React, { useState } from "react";

type Notification = {
  id: string;
  type: "negative" | "positive";
  course: string;
  teacher: string;
  date: string;
  isRead: boolean;
};

export default function NotificationsModal({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "negative",
      course: "UI design",
      teacher: "Kathleen Alcini",
      date: "6 juin à 10:00",
      isRead: false
    },
    {
      id: "2",
      type: "positive",
      course: "Marketing digital intergénérationnel",
      teacher: "Yoann Coualan",
      date: "6 juin à 10:00",
      isRead: false
    },
    {
      id: "3",
      type: "negative",
      course: "UI design",
      teacher: "Kathleen Alcini",
      date: "6 juin à 10:00",
      isRead: false
    }
  ]);

  const [tab, setTab] = useState<"non" | "lues">("non");

  const toggleRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: !n.isRead } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);
  const displayedNotifications = tab === "non" ? unreadNotifications : readNotifications;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{background: 'rgba(0, 0, 0, 0.45)'}}>
      <div style={{
        width: '600px',
        maxWidth: '100%',
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 style={{
            fontFamily: '"Mochiy Pop One", cursive',
            fontSize: '18px',
            fontWeight: 400,
            margin: 0,
            color: '#1f2937',
            lineHeight: '100%'
          }}>Notifications</h2>

          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '0',
              lineHeight: '1'
            }}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={{display: 'flex', gap: '16px'}}>
          <button
            onClick={() => setTab("non")}
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: tab === "non" ? '#1f2937' : '#9ca3af',
              cursor: 'pointer',
              textDecoration: tab === "non" ? 'underline' : 'none',
              textDecorationThickness: '2px',
              textUnderlineOffset: '4px',
              padding: '4px 8px'
            }}
          >
            Non lues
          </button>
          <button
            onClick={() => setTab("lues")}
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: tab === "lues" ? '#1f2937' : '#9ca3af',
              cursor: 'pointer',
              textDecoration: tab === "lues" ? 'underline' : 'none',
              textDecorationThickness: '2px',
              textUnderlineOffset: '4px',
              padding: '4px 8px'
            }}
          >
            Lues
          </button>
        </div>

        {/* Divider */}
        <div style={{height: '1px', background: '#e5e7eb'}} />

        {/* Mark all as read button */}
        {tab === "non" && unreadNotifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              alignSelf: 'flex-end',
              padding: '4px 0'
            }}
          >
            <span style={{fontSize: '16px'}}>✓</span> Marquer comme lues
          </button>
        )}

        {/* Notifications List */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {displayedNotifications.map((notif) => (
            <div key={notif.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 0'
            }}>
              {/* Icon */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: notif.type === "negative" ? '#ff6b35' : '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                flexShrink: 0
              }}>
                {notif.type === "negative" ? "⚠" : "✓"}
              </div>

              {/* Content */}
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '4px'}}>
                <p style={{
                  margin: 0,
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#1f2937',
                  lineHeight: '1.4'
                }}>
                  Alerte {notif.type === "negative" ? "négative" : "positive"} détectée sur le cours{" "}
                  <span style={{fontWeight: 700}}>{notif.course}</span> de{" "}
                  <span style={{fontWeight: 700}}>{notif.teacher}</span>
                </p>
                <span style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#9ca3af'
                }}>
                  {notif.date}
                </span>
              </div>

              {/* Checkbox */}
              <div 
                onClick={() => toggleRead(notif.id)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '2px solid #1f2937',
                  background: notif.isRead ? '#1f2937' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}
              >
                {notif.isRead && (
                  <span style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 700
                  }}>✓</span>
                )}
              </div>
            </div>
          ))}

          {displayedNotifications.length === 0 && (
            <div style={{
              textAlign: 'center',
              color: '#9ca3af',
              padding: '40px 20px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '15px'
            }}>
              Aucune notification ici.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
