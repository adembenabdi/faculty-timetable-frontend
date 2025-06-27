"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";

export default function AdminParametresPage() {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Get admin info from localStorage
  let admin = null;
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("userData");
    if (userData) admin = JSON.parse(userData);
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", });
      return;
    }
    setLoading(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      toast({ title: "Succès", description: "Mot de passe changé avec succès." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({ title: "Erreur", description: err?.response?.data?.error || "Erreur lors du changement de mot de passe." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Paramètres Administrateur</h1>
      <div className="bg-white rounded shadow p-6 space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Informations de l'administrateur</h2>
          {admin ? (
            <div className="text-gray-700 space-y-1">
              <div><span className="font-medium">Nom:</span> {admin.first_name} {admin.last_name}</div>
              <div><span className="font-medium">Email:</span> {admin.email}</div>
            </div>
          ) : (
            <div className="text-gray-500">Aucune information d'administrateur trouvée.</div>
          )}
        </div>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <h2 className="text-lg font-semibold">Changer le mot de passe</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Changement..." : "Changer le mot de passe"}
          </Button>
        </form>
      </div>
    </div>
  );
} 