"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Filter,
  Loader2,
  Tag,
  Grid3X3,
  Eye,
  EyeOff
} from "lucide-react";
import { 
  getAdminCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "@/actions/admin.actions";

type Category = { 
  id: string; 
  name: string; 
  slug: string; 
  isActive: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  order?: number;
  parentId?: string;
};

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [filteredItems, setFilteredItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  
  // Form state
  const [form, setForm] = useState({ 
    name: "", 
    slug: "", 
    description: "",
    isActive: true,
    order: 0 
  });
  const [editForm, setEditForm] = useState<Category | null>(null);
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const load = async () => {
    try {
      setLoading(true);
      const { data, error } = await getAdminCategories();
      if (error) throw error;
      const categories = data?.data?.items ?? [];
      setItems(categories);
      setFilteredItems(categories);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load categories");
      console.error("Load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Apply filters whenever search or statusFilter changes
  useEffect(() => {
    let result = items;

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(category => 
        category.name.toLowerCase().includes(searchLower) ||
        category.slug.toLowerCase().includes(searchLower) ||
        category.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter(category => 
        statusFilter === "ACTIVE" ? category.isActive : !category.isActive
      );
    }

    setFilteredItems(result);
  }, [search, statusFilter, items]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (!form.name.trim()) {
        throw new Error("Category name is required");
      }

     // Remove unsupported fields from the payload
    const { error } = await createCategory({
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      isActive: form.isActive,
      // Remove these lines:
      // description: form.description.trim() || undefined,
      // order: form.order,
    });

      if (error) throw error;
      
      toast.success("Category created successfully");
      
      // Reset form
      setForm({ 
        name: "", 
        slug: "", 
        description: "",
        isActive: true,
        order: 0 
      });
      
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    
    try {
      setProcessing(editForm.id);
      
      const { error } = await updateCategory(editForm.id, {
        name: editForm.name,
        slug: editForm.slug,
        // description: editForm.description,
        isActive: editForm.isActive,
        // order: editForm.order,
      });

      if (error) throw error;
      
      toast.success("Category updated successfully");
      setEditForm(null);
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update category");
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setProcessing(id);
      const { error } = await deleteCategory(id);
      if (error) throw error;
      toast.success("Category deleted successfully");
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to delete category");
    } finally {
      setProcessing(null);
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      setProcessing(category.id);
      
      const { error } = await updateCategory(category.id, { 
        isActive: !category.isActive 
      });
      
      if (error) throw error;
      
      toast.success(`Category ${!category.isActive ? 'activated' : 'deactivated'} successfully`);
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update category status");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
        <CheckCircle className="h-3 w-3" /> Active
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 gap-1">
        <XCircle className="h-3 w-3" /> Inactive
      </Badge>
    );
  };

  // Statistics
  const stats = {
    total: items.length,
    active: items.filter(c => c.isActive).length,
    inactive: items.filter(c => !c.isActive).length,
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories Management</h1>
          <p className="text-muted-foreground">
            Manage content categories for the platform
          </p>
        </div>
        <Button onClick={load} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Grid3X3 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Total Categories</div>
                <div className="text-2xl font-bold">{stats.total}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Active</div>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-500/10 flex items-center justify-center">
                <EyeOff className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Inactive</div>
                <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Category Card */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
          <CardDescription>
            Create a new category for organizing content
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleCreate}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Programming"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="e.g., programming (optional)"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly version of the name. Auto-generated if left empty.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of the category"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
              />
              <Label htmlFor="active">Active</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                min="0"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Plus className="mr-2 h-4 w-4" />
              Create Category
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories by name, slug, or description..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: "ALL" | "ACTIVE" | "INACTIVE") => setStatusFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Showing {filteredItems.length} of {items.length} categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground">
                {search || statusFilter !== "ALL" 
                  ? "Try changing your filters" 
                  : "No categories in the system yet"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                            <Tag className="h-4 w-4 text-primary" />
                          </div>
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </TableCell>
                      {/* <TableCell>
                        <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                          {category.description || "No description"}
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <Badge variant="outline">{category.order || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(category.isActive)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setEditForm(category)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(category)}>
                              {category.isActive ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    category "{category.name}" and remove all associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(category.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={processing === category.id}
                                  >
                                    {processing === category.id && (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Delete Category
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editForm} onOpenChange={(open) => !open && setEditForm(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update category details
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name *</Label>
                <Input
                  id="edit-name"
                  value={editForm?.name || ""}
                  onChange={(e) => setEditForm(prev => prev ? { ...prev, name: e.target.value } : null)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={editForm?.slug || ""}
                  onChange={(e) => setEditForm(prev => prev ? { ...prev, slug: e.target.value } : null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editForm?.description || ""}
                  onChange={(e) => setEditForm(prev => prev ? { ...prev, description: e.target.value } : null)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={editForm?.isActive || false}
                  onCheckedChange={(checked) => setEditForm(prev => prev ? { ...prev, isActive: checked } : null)}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-order">Display Order</Label>
                <Input
                  id="edit-order"
                  type="number"
                  min="0"
                  value={editForm?.order || 0}
                  onChange={(e) => setEditForm(prev => prev ? { ...prev, order: parseInt(e.target.value) || 0 } : null)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={processing === editForm?.id}>
                {processing === editForm?.id && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}