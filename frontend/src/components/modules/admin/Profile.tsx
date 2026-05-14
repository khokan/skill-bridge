"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getProfile, updateProfile } from "@/actions/student.action";
import { ProfilePanel, type ProfileSummary } from "@/components/shared/profile-panel";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileSummary | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProfile();
      if (error) throw error;

      setProfile(data?.data ?? data);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (payload: { name?: string; phone?: string | null; image?: string | null }) => {
    try {
      setLoading(true);
      const { error } = await updateProfile(payload);
      if (error) throw error;

      toast.success("Profile updated");
      await load();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      <ProfilePanel
        title="Admin Profile"
        description="Update the admin account profile using the same shared profile system."
        profile={profile}
        mode="edit"
        loading={loading}
        onSave={save}
      />
    </div>
  );
}