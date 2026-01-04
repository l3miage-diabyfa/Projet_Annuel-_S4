"use client";

import React, { useState } from "react";

type Collaborator = {
  id: string;
  name: string;
  initials: string;
  role: "Admin" | "Éditeur";
  color: string;
};

export default function ShareModal({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<"Admin" | "Éditeur">("Admin");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: "1",
      name: "Jeremy Serval",
      initials: "JS",
      role: "Admin",
      color: "#ff6b35"
    },
    {
      id: "2",
      name: "Kathleen Alcini",
      initials: "KA",
      role: "Éditeur",
      color: "#ffa500"
    }
  ]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const inviteLink = "https://example.com/invite/abc123";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleInvite = () => {
    if (email.trim()) {
      const newCollaborator: Collaborator = {
        id: Date.now().toString(),
        name: email,
        initials: email.substring(0, 2).toUpperCase(),
        role: selectedRole,
        color: "#" + Math.floor(Math.random()*16777215).toString(16)
      };
      setCollaborators([...collaborators, newCollaborator]);
      setEmail("");
    }
  };

  const handleRoleChange = (id: string, newRole: "Admin" | "Éditeur") => {
    setCollaborators(collaborators.map(c => 
      c.id === id ? { ...c, role: newRole } : c
    ));
    setOpenDropdownId(null);
  };

  const handleDelete = (id: string) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
    setOpenDropdownId(null);
  };

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
        gap: '32px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
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

        {/* Header Section */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px'}}>
          <h2 style={{
            fontFamily: '"Mochiy Pop One", cursive',
            fontSize: '18px',
            fontWeight: 400,
            margin: 0,
            color: '#1f2937',
            lineHeight: '100%'
          }}>Inviter des collaborateurs</h2>
          
          <button
            onClick={handleCopyLink}
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '10px 16px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            {linkCopied ? '✓ Copié!' : 'Copier le lien'} 
            {!linkCopied && <span style={{fontSize: '16px'}}>📋</span>}
          </button>
        </div>

        {/* Invite Form */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
            <input
              type="email"
              placeholder="Inviter par email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
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
            
            {/* Role Dropdown */}
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: 'white',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#374151',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: '120px',
                  justifyContent: 'space-between'
                }}
              >
                Rôle <span style={{fontSize: '12px'}}>▼</span>
              </button>
              
              {showRoleDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  minWidth: '140px',
                  zIndex: 10,
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => {
                      setSelectedRole("Admin");
                      setShowRoleDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: 'none',
                      background: selectedRole === "Admin" ? '#f9fafb' : 'white',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#374151',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRole("Éditeur");
                      setShowRoleDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: 'none',
                      background: selectedRole === "Éditeur" ? '#f9fafb' : 'white',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#374151',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    Éditeur
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleInvite}
            style={{
              background: '#ffd93d',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#1f2937',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: 'fit-content'
            }}
          >
            Inviter <span>→</span>
          </button>
        </div>

        {/* Divider */}
        <div style={{height: '1px', background: '#e5e7eb', margin: '8px 0'}} />

        {/* Collaborators List */}
        <div>
          <h3 style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            color: '#1f2937',
            margin: 0,
            marginBottom: '16px'
          }}>Personnes disposant de l'accès</h3>

          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {collaborators.map((collab) => (
              <div key={collab.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: collab.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {collab.initials}
                  </div>
                  <span style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#1f2937'
                  }}>
                    {collab.name}
                  </span>
                </div>

                {/* Role Selector */}
                <div style={{position: 'relative'}}>
                  <button
                    onClick={() => setOpenDropdownId(openDropdownId === collab.id ? null : collab.id)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      background: 'white',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#374151',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: '120px',
                      justifyContent: 'space-between'
                    }}
                  >
                    {collab.role} <span style={{fontSize: '12px'}}>▼</span>
                  </button>

                  {openDropdownId === collab.id && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '4px',
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      minWidth: '140px',
                      zIndex: 10,
                      overflow: 'hidden'
                    }}>
                      <button
                        onClick={() => handleRoleChange(collab.id, "Admin")}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          border: 'none',
                          background: collab.role === "Admin" ? '#f9fafb' : 'white',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '14px',
                          fontWeight: 400,
                          color: '#374151',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        Admin
                      </button>
                      <button
                        onClick={() => handleRoleChange(collab.id, "Éditeur")}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          border: 'none',
                          background: collab.role === "Éditeur" ? '#f9fafb' : 'white',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '14px',
                          fontWeight: 400,
                          color: '#374151',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        Éditeur
                      </button>
                      <div style={{height: '1px', background: '#e5e7eb', margin: '4px 0'}} />
                      <button
                        onClick={() => handleDelete(collab.id)}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          border: 'none',
                          background: 'white',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '14px',
                          fontWeight: 400,
                          color: '#ef4444',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
