"use client";

import React, { useState } from "react";

type AlertItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  handled: boolean;
};

function MessageModal({ 
  onClose, 
  onSend 
}: { 
  onClose: () => void;
  onSend: (subject: string, message: string) => void;
}) {
  const [subject, setSubject] = useState("Suite à vos retours sur le cours UI design de Kathleen Alcini");
  const [message, setMessage] = useState(`Bonjour à tous,

Plusieurs retours ont mis en lumière un manque de clarté sur certaines consignes de rendu. Pour éviter toute confusion, je vous encourage à relire attentivement les instructions sur la plateforme, et n'hésitez pas à poser vos questions lors du prochain cours ou par message.

Nous restons disponibles pour vous accompagner au mieux.

À très bientôt,
L'équipe pédagogique`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{background: 'rgba(0, 0, 0, 0.45)'}}>
      <div style={{
        width: '600px',
        maxWidth: '100%',
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        maxHeight: '90vh',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <h2 style={{
              fontFamily: '"Mochiy Pop One", cursive',
              fontSize: '18px',
              fontWeight: 400,
              fontStyle: 'normal',
              margin: 0,
              marginBottom: '8px',
              color: '#1f2937',
              lineHeight: '100%',
              letterSpacing: '0%'
            }}>Envoyer un message aux étudiants</h2>
            <p style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
              fontWeight: 400,
              margin: 0,
              color: '#6b7280',
              lineHeight: '1.4'
            }}>Ce message est généré via IA, vous pouvez le modifier avant de l'envoyer.</p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '0',
              lineHeight: '1',
              marginLeft: '16px'
            }}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          {/* Objet */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '8px'
            }}>Objet</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#1f2937',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Message */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '8px'
            }}>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#1f2937',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                lineHeight: '1.6'
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-start'}}>
          <button
            onClick={onClose}
            style={{
              background: 'white',
              color: '#374151',
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Annuler <span>✕</span>
          </button>
          <button
            onClick={() => {
              onSend(subject, message);
              onClose();
            }}
            style={{
              background: '#ffd93d',
              color: '#1f2937',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Envoyer le message <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AlertsModal({
  subject = "UI Design",
  classNameName = "B3UI",
  teacher = "Kathleen AÏCIN",
  onClose,
}: {
  subject?: string;
  classNameName?: string;
  teacher?: string;
  onClose?: () => void;
}) {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "1",
      title: "Alerte 1/3",
      message:
        "Ricotta Chicago Aussie extra pie. Ranch parmesan anchovies sautéed lovers red Chicago stuffed.",
      time: "Il y a 2 heures",
      handled: false,
    },
    {
      id: "2",
      title: "Alerte 2/3",
      message:
        "Ricotta Chicago Aussie extra pie. Ranch parmesan anchovies sautéed lovers red Chicago stuffed.",
      time: "Il y a 2 heures",
      handled: false,
    },
    {
      id: "3",
      title: "Alerte 3/3",
      message:
        "Ricotta Chicago Aussie extra pie. Ranch parmesan anchovies sautéed lovers red Chicago stuffed.",
      time: "Il y a 3 heures",
      handled: true,
    },
  ]);

  const [tab, setTab] = useState<"non" | "traite">("non");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  function sendMessage(alertId: string) {
    setShowMessageModal(true);
  }

  function handleSendMessage(subject: string, message: string) {
    setSuccessMessage("Message envoyé avec succès aux étudiants");
    setTimeout(() => setSuccessMessage(null), 3000);
  }

  function toggleHandled(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, handled: !a.handled } : a))
    );
  }

  const nonHandled = alerts.filter((a) => !a.handled);
  const handled = alerts.filter((a) => a.handled);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{background: 'rgba(0, 0, 0, 0.45)'}}>
        <div style={{
          width: '798px',
          maxWidth: '100%',
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          maxHeight: '90vh',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap'}}>
              <h2 style={{
                fontFamily: '"Mochiy Pop One", cursive',
                fontSize: '18px',
                fontWeight: 400,
                fontStyle: 'normal',
                margin: 0,
                color: '#1f2937',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}>Alertes</h2>
              <span style={{
                background: '#f3f4f6',
                padding: '8px 14px',
                borderRadius: '6px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                color: '#374151',
                lineHeight: '100%'
              }}>{subject}</span>
              <span style={{
                background: '#f3f4f6',
                padding: '8px 14px',
                borderRadius: '6px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                color: '#374151',
                lineHeight: '100%'
              }}>{classNameName}</span>
              <span style={{
                background: '#f3f4f6',
                padding: '8px 14px',
                borderRadius: '6px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                color: '#374151',
                lineHeight: '100%'
              }}>{teacher}</span>
            </div>
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

          {/* Success Banner */}
          {successMessage && (
            <div style={{
              background: '#d1f4e0',
              color: '#0f5132',
              padding: '14px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{fontSize: '16px'}}>✓</span>
              {successMessage}
            </div>
          )}

          {/* Tabs Section */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              fontStyle: 'normal',
              color: '#6b7280',
              lineHeight: '100%',
              letterSpacing: '0%'
            }}>
              {alerts.length} alertes disponibles
            </div>
            <div style={{display: 'flex', gap: '8px'}}>
              <button
                onClick={() => setTab("non")}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: tab === "non" ? 'white' : 'transparent',
                  color: tab === "non" ? '#1f2937' : '#6b7280',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textDecoration: tab === "non" ? 'underline' : 'none',
                  textDecorationThickness: '2px',
                  textUnderlineOffset: '4px'
                }}
              >
                Non traitées
              </button>
              <button
                onClick={() => setTab("traite")}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: tab === "traite" ? 'white' : 'transparent',
                  color: tab === "traite" ? '#1f2937' : '#6b7280',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textDecoration: tab === "traite" ? 'underline' : 'none',
                  textDecorationThickness: '2px',
                  textUnderlineOffset: '4px'
                }}
              >
                traitées
              </button>
            </div>
          </div>

          {/* Alerts Container */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: '500px',
            overflowY: 'auto',
            paddingRight: '8px'
          }}>
            {(tab === "non" ? nonHandled : handled).map((a) => (
              <div key={a.id} style={{
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {/* Alert Header */}
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#ff6b35',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px',
                      flexShrink: 0
                    }}>⚠</div>
                    <span style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      fontSize: '12px',
                      color: '#1f2937',
                      lineHeight: '100%'
                    }}>{a.title}</span>
                    {!a.handled && (
                      <span style={{
                        background: '#ff6b35',
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 600
                      }}>à traiter</span>
                    )}
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <span style={{fontSize: '14px', color: '#9ca3af'}}>
                      Marquée comme traitée
                    </span>
                    <input
                      type="checkbox"
                      checked={a.handled}
                      onChange={() => toggleHandled(a.id)}
                      style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        accentColor: '#ff6b35'
                      }}
                      aria-label={`Marquer ${a.title}`}
                    />
                  </div>
                </div>

                {/* Alert Message */}
                <p style={{
                  margin: 0,
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '100%',
                  color: '#4b5563'
                }}>{a.message}</p>

                <div style={{fontSize: '13px', color: '#9ca3af'}}>{a.time}</div>

                {/* Action Buttons */}
                <div style={{display: 'flex', gap: '12px'}}>
                  <button style={{
                    background: '#ffd93d',
                    color: '#1f2937',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '100%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>💬</span> Commenter
                  </button>
                  <button 
                    onClick={() => sendMessage(a.id)}
                    style={{
                      background: 'white',
                      color: '#4b5563',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '16px',
                      fontWeight: 400,
                      lineHeight: '100%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                    <span>✉️</span> Envoyer un message aux étudiants
                  </button>
                </div>
              </div>
            ))}

            {(tab === "non" ? nonHandled : handled).length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#9ca3af',
                padding: '60px 20px',
                fontSize: '15px'
              }}>
                Aucune alerte ici.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal 
          onClose={() => setShowMessageModal(false)}
          onSend={handleSendMessage}
        />
      )}
    </>
  );
}
