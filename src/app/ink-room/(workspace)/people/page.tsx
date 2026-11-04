"use client";

import React, { useState, useEffect } from "react";
import { PersonProfile, ContentItem } from "@/lib/types";
import { Users, Plus, Save, Check, Loader2, Sparkles } from "lucide-react";

export default function InkRoomPeoplePage() {
  const [people, setPeople] = useState<PersonProfile[]>([]);
  const [works, setWorks] = useState<ContentItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [displayName, setDisplayName] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [fullBio, setFullBio] = useState("");
  const [rolesInput, setRolesInput] = useState("Writer, Creator");
  const [selectedWorkIds, setSelectedWorkIds] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const loadData = () => {
    fetch("/api/people?all=true")
      .then((res) => res.json())
      .then((data) => setPeople(data.people || []));

    fetch("/api/content?status=published")
      .then((res) => res.json())
      .then((data) => setWorks(data.items || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const startEdit = (p: PersonProfile) => {
    setEditingId(p.id);
    setDisplayName(p.display_name);
    setShortBio(p.short_bio);
    setFullBio(p.full_bio);
    setRolesInput(p.roles.join(", "));
    setSelectedWorkIds(p.selected_work_ids || []);
    setIsPublic(p.is_public);
    setSuccess("");
  };

  const startNew = () => {
    setEditingId("new");
    setDisplayName("");
    setShortBio("");
    setFullBio("");
    setRolesInput("Contributor");
    setSelectedWorkIds([]);
    setIsPublic(true);
    setSuccess("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName) return;
    setSaving(true);
    setSuccess("");

    try {
      const payload: Partial<PersonProfile> = {
        id: editingId !== "new" && editingId ? editingId : undefined,
        display_name: displayName,
        short_bio: shortBio,
        full_bio: fullBio,
        roles: rolesInput.split(",").map((r) => r.trim()).filter(Boolean),
        selected_work_ids: selectedWorkIds,
        is_public: isPublic,
        status: "published",
      };

      const res = await fetch("/api/people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      setSaving(false);
      setSuccess("Profile saved successfully.");
      setEditingId(null);
      loadData();
    } catch {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-gold/30">
        <div>
          <span className="text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold">
            Registry
          </span>
          <h1 className="font-display text-3xl font-bold text-brand-forest">
            People & Collaborators
          </h1>
          <p className="font-reading text-sm text-brand-forest/80 italic mt-0.5">
            Manage author profiles, guest contributors, and dynamic credits.
          </p>
        </div>

        <button
          type="button"
          onClick={startNew}
          className="px-4 py-2.5 rounded-xl bg-brand-coral text-brand-cream text-xs font-sans font-semibold tracking-wider uppercase hover:bg-brand-coral/90 transition-all inline-flex items-center gap-2 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Person</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* People List */}
        <div className="space-y-3">
          <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/70 block">
            Profiles in Registry ({people.length})
          </span>
          <div className="space-y-2">
            {people.map((p) => (
              <div
                key={p.id}
                onClick={() => startEdit(p)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  editingId === p.id
                    ? "bg-brand-parchment border-brand-gold shadow-xs"
                    : "bg-brand-cream border-brand-gold/20 hover:border-brand-gold/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-forest text-brand-gold-light flex items-center justify-center font-display font-bold">
                    {p.display_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-brand-forest">
                      {p.display_name}
                    </h4>
                    <span className="text-[10px] font-sans uppercase font-bold text-brand-coral">
                      {p.roles.join(" · ")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Editor */}
        <div className="lg:col-span-2">
          {editingId ? (
            <form
              onSubmit={handleSave}
              className="bg-brand-parchment p-6 sm:p-8 rounded-2xl border border-brand-gold/30 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20">
                <h3 className="font-display text-xl font-bold text-brand-forest">
                  {editingId === "new" ? "New Contributor Profile" : `Editing: ${displayName}`}
                </h3>
                {success && (
                  <span className="text-xs font-sans font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{success}</span>
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="E.g., Linda Emefa Daniels"
                  className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                  Roles (Comma separated)
                </label>
                <input
                  type="text"
                  value={rolesInput}
                  onChange={(e) => setRolesInput(e.target.value)}
                  placeholder="Writer, Editor, Illustrator"
                  className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/40"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                  Short Bio
                </label>
                <textarea
                  rows={2}
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/40 font-reading"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                  Full Literary Biography
                </label>
                <textarea
                  rows={4}
                  value={fullBio}
                  onChange={(e) => setFullBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/40 font-reading leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-brand-gold/20 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-sans text-brand-forest cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 accent-brand-coral rounded"
                  />
                  <span>Publicly Visible</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 rounded-xl border border-brand-forest/20 text-brand-forest text-xs font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-brand-forest text-brand-cream text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save Profile</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-16 rounded-2xl bg-brand-parchment border border-dashed border-brand-gold/40 text-center">
              <Users className="w-8 h-8 text-brand-gold mx-auto mb-2" />
              <p className="font-reading italic text-brand-forest/70">
                Select a profile on the left or create a new one to edit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
