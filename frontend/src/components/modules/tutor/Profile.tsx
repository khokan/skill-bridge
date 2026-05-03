"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Loader2,
  User,
  Languages,
  FileText,
  Tags,
} from "lucide-react";

import {
  getTutorProfile,
  createTutorProfile,
  updateTutorProfile,
  deleteTutorProfile,
  getCategories,
  setTutorCategories,
} from "@/actions/tutorProfile.actions";

type ProfileCategory = {
  category: {
    id: string;
    name: string;
    slug: string;
  };
};


type Category = { id: string; name: string; slug: string; isActive: boolean };

interface TutorProfile {
  id: string;
  bio?: string | null;
  languages?: string[] | null;
  hourlyRate?: number | null;
  experienceYrs: number | null;
  currency?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  userId?: string | null;
  categories?: { category: { id: string; name: string; slug: string } }[];
}

const safeArray = <T,>(val: unknown): T[] => (Array.isArray(val) ? (val as T[]) : []);

export default function TutorProfilePage() {
  const [profile, setProfile] = useState<TutorProfile | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    bio: "",
    languages: "", // comma separated
    hourlyRate: "",
    experienceYrs: "",
  });

  const [errors, setErrors] = useState({
    bio: "",
    languages: "",
    hourlyRate: "",
    experienceYrs: "",
    categories: "",
  });

  const hasProfile = !!profile?.id;

  useEffect(() => {
    void bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bootstrap = async () => {
    try {
      setLoading(true);

      const [catRes, profRes] = await Promise.all([getCategories(), getTutorProfile()]);

      // ---- categories ----
      if (catRes?.error) throw new Error(catRes.error.message ?? "Failed to load categories");

      // handle multiple possible shapes
      const catItems =
        (catRes as any)?.data?.items ??
        (catRes as any)?.data?.data?.items ??
        (catRes as any)?.data ??
        (catRes as any)?.items ??
        [];

      setCategories(safeArray<Category>(catItems));

      console.log("profile", profRes);
      // ---- profile ----
      if (profRes?.error) {
        const msg = (profRes.error.message ?? "").toLowerCase();
        // if your backend returns "not found" when empty, keep it silent
        if (!msg.includes("not found")) toast.error(profRes.error.message ?? "Failed to load profile");
        setProfile(null);
        setSelectedCategoryIds([]);
        return;
      }

      const rawProf =
        (profRes as any)?.data?.data ??
        (profRes as any)?.data?.profile ??
        (profRes as any)?.data ??
        (profRes as any)?.profile ??
        null;

      // IMPORTANT: treat no-id as "no profile"
      if (!rawProf || !rawProf.id) {
        setProfile(null);
        setSelectedCategoryIds([]);
        return;
      }

      const prof = rawProf as TutorProfile;
      setProfile(prof);

      const ids = safeArray<{ category: { id: string } }>(prof.categories)
        .map((x) => x?.category?.id)
        .filter(Boolean) as string[];

      setSelectedCategoryIds(ids);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load");
      setProfile(null);
      setSelectedCategoryIds([]);
    } finally {
      setLoading(false);
    }
  };

  const activeCategories = useMemo(() => {
    // show only active categories if you want
    return categories.filter((c) => c.isActive !== false);
  }, [categories]);

  const handleEdit = () => {
    if (!profile?.id) return;

    setForm({
      bio: profile.bio ?? "",
      languages: safeArray<string>(profile.languages).join(", "),
      hourlyRate: profile.hourlyRate ? String(profile.hourlyRate) : "",
      experienceYrs:
        profile.experienceYrs !== null && profile.experienceYrs !== undefined
          ? String(profile.experienceYrs)
          : "",
    });

    setErrors({ bio: "", languages: "", hourlyRate: "", experienceYrs: "", categories: "" });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setForm({ bio: "", languages: "", hourlyRate: "", experienceYrs: "" });
    setSelectedCategoryIds([]);
    setErrors({ bio: "", languages: "", hourlyRate: "", experienceYrs: "", categories: "" });
    setIsDialogOpen(true);
  };

  const validateForm = () => {
    const nextErr = { bio: "", languages: "", hourlyRate: "", experienceYrs: "", categories: "" };
    let ok = true;

    if (!form.bio.trim()) {
      nextErr.bio = "Bio is required";
      ok = false;
    }

    const rate = Number(form.hourlyRate);
    if (!form.hourlyRate || Number.isNaN(rate) || rate <= 0) {
      nextErr.hourlyRate = "Valid hourly rate is required";
      ok = false;
    }

    if (!selectedCategoryIds.length) {
      nextErr.categories = "Select at least one category";
      ok = false;
    }

    const experience = Number(form.experienceYrs);
    if (!form.experienceYrs || Number.isNaN(experience) || experience < 0) {
      nextErr.experienceYrs = "Valid experience is required";
      ok = false;
    }

    setErrors(nextErr);
    return ok;
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      const payload = {
        bio: form.bio.trim(),
        languages: form.languages
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        hourlyRate: Number(form.hourlyRate),
        experienceYrs: Number(form.experienceYrs),
      };

      // 1) create/update profile
      const res = hasProfile ? await updateTutorProfile(payload) : await createTutorProfile(payload);
      if (res?.error) throw new Error(res.error.message || "Profile save failed");

      // 2) set categories (replace)
      const catRes = await setTutorCategories({ categoryIds: selectedCategoryIds });
      if (catRes?.error) throw new Error(catRes.error.message || "Category save failed");

      toast.success(hasProfile ? "Profile updated successfully" : "Profile created successfully");
      setIsDialogOpen(false);
      await bootstrap();
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteTutorProfile();
      if (res?.error) throw new Error(res.error.message || "Delete failed");

      toast.success("Profile deleted successfully");
      setIsDeleteDialogOpen(false);
      setProfile(null);
      setSelectedCategoryIds([]);
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tutor Profile</h1>
          <p className="text-muted-foreground">Manage your tutor profile information</p>
        </div>

        {!hasProfile ? (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Profile
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>This will permanently delete your tutor profile.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Profile"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Profile Details */}
      {hasProfile ? (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Your current tutor profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Field</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      Bio
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-2xl whitespace-pre-wrap">{profile?.bio || "Not provided"}</div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Tags className="mr-2 h-4 w-4 text-muted-foreground" />
                      Categories
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                 {safeArray<ProfileCategory>(profile?.categories).length ? (
                    safeArray<ProfileCategory>(profile?.categories).map((x) => (
                          <Badge key={x.category.id} variant="secondary" className="text-sm">
                            {x.category.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">Not selected</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Languages className="mr-2 h-4 w-4 text-muted-foreground" />
                      Languages
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {safeArray<string>(profile?.languages).length ? (
                        safeArray<string>(profile?.languages).map((l, i) => (
                          <Badge key={`${l}-${i}`} variant="outline" className="text-sm">
                            {l}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">Not specified</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                     <span className="mr-2 h-4 w-4 text-muted-foreground">৳</span>
                      Hourly Rate
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-lg font-semibold">
                      {profile?.hourlyRate ?? 0} {profile?.currency ?? "BDT"}/hr
                    </Badge>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      User ID
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{profile?.userId || "N/A"}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Experience</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-sm">
                      {profile?.experienceYrs ?? 0} year{profile?.experienceYrs === 1 ? "" : "s"}
                    </Badge>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Created At</TableCell>
                  <TableCell>{formatDate(profile?.createdAt)}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Updated At</TableCell>
                  <TableCell>{formatDate(profile?.updatedAt)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Profile Found</h3>
              <p className="text-muted-foreground mb-6">Create one to start offering tutoring services.</p>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Create Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{hasProfile ? "Edit Tutor Profile" : "Create Tutor Profile"}</DialogTitle>
            <DialogDescription>
              {hasProfile ? "Update your tutor profile information below." : "Fill in your profile to get started."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">
                Bio <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className={errors.bio ? "border-destructive" : ""}
                rows={4}
              />
              {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>
                Categories <span className="text-destructive">*</span>
              </Label>

              <div className={`rounded-xl border p-3 ${errors.categories ? "border-destructive" : ""}`}>
                {activeCategories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active categories available. Ask admin to create categories.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {activeCategories.map((c) => {
                      const checked = selectedCategoryIds.includes(c.id);
                      return (
                        <label key={c.id} className="flex items-center gap-2 text-sm">
                          <Checkbox checked={checked} onCheckedChange={() => toggleCategory(c.id)} />
                          <span>{c.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {errors.categories && <p className="text-sm text-destructive">{errors.categories}</p>}
              <p className="text-sm text-muted-foreground">Students will find you using these categories.</p>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <Label htmlFor="languages">Languages (optional)</Label>
              <Input
                id="languages"
                placeholder="e.g., English, Bangla"
                value={form.languages}
                onChange={(e) => setForm({ ...form, languages: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">Separate multiple languages with commas</p>
            </div>

            {/* Hourly rate */}
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">
                Hourly Rate (BDT) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1 mr-2 h-4 w-4 text-muted-foreground">৳</span>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g., 600"
                  value={form.hourlyRate}
                  onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                  className={`pl-9 ${errors.hourlyRate ? "border-destructive" : ""}`}
                />
              </div>
              {errors.hourlyRate && <p className="text-sm text-destructive">{errors.hourlyRate}</p>}
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experienceYrs">
                Experience (years) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="experienceYrs"
                type="number"
                min="0"
                step="1"
                placeholder="e.g., 3"
                value={form.experienceYrs}
                onChange={(e) => setForm({ ...form, experienceYrs: e.target.value })}
                className={errors.experienceYrs ? "border-destructive" : ""}
              />
              {errors.experienceYrs && <p className="text-sm text-destructive">{errors.experienceYrs}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {hasProfile ? "Update Profile" : "Create Profile"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
