import { useState, useMemo } from "react";
import { useUsers, User } from "@/hooks/admin/useUsers";
import { useUpdateUserRole } from "@/hooks/admin/useUpdateUserRole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Shield, Users, UserX, Loader2 } from "lucide-react";
import { format } from "date-fns";

type RoleFilter = "all" | "admin" | "mentor" | "none";
type RoleAction = "admin" | "mentor" | null;

interface RoleChangeDialog {
  open: boolean;
  user: User | null;
  newRole: RoleAction;
}

export default function AdminUsers() {
  const { data: users, isLoading, error } = useUsers();
  const updateRole = useUpdateUserRole();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [roleDialog, setRoleDialog] = useState<RoleChangeDialog>({
    open: false,
    user: null,
    newRole: null,
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      // Search filter
      const matchesSearch = user.email.toLowerCase().includes(search.toLowerCase());

      // Role filter
      let matchesRole = true;
      if (roleFilter === "admin") matchesRole = user.role === "admin";
      else if (roleFilter === "mentor") matchesRole = user.role === "mentor";
      else if (roleFilter === "none") matchesRole = user.role === null;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const openRoleDialog = (user: User, newRole: RoleAction) => {
    setRoleDialog({ open: true, user, newRole });
  };

  const handleRoleChange = () => {
    if (roleDialog.user) {
      updateRole.mutate({
        userId: roleDialog.user.id,
        role: roleDialog.newRole,
      });
    }
    setRoleDialog({ open: false, user: null, newRole: null });
  };

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">Admin</Badge>;
      case "mentor":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Mentor</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">No Role</Badge>;
    }
  };

  const getRoleActionLabel = (role: RoleAction) => {
    switch (role) {
      case "admin":
        return "Make Admin";
      case "mentor":
        return "Make Mentor";
      default:
        return "Revoke Access";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load users. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage user roles and access permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users?.filter((u) => u.role === "admin").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mentors</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users?.filter((u) => u.role === "mentor").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Search and filter users, then assign or revoke roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as RoleFilter)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="mentor">Mentors</SelectItem>
                <SelectItem value="none">No Role</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.last_sign_in_at
                          ? format(new Date(user.last_sign_in_at), "MMM d, yyyy")
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {user.role !== "admin" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-purple-500 border-purple-500/20 hover:bg-purple-500/10"
                              onClick={() => openRoleDialog(user, "admin")}
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Button>
                          )}
                          {user.role !== "mentor" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-500 border-blue-500/20 hover:bg-blue-500/10"
                              onClick={() => openRoleDialog(user, "mentor")}
                            >
                              <Users className="h-3 w-3 mr-1" />
                              Mentor
                            </Button>
                          )}
                          {user.role !== null && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive/20 hover:bg-destructive/10"
                              onClick={() => openRoleDialog(user, null)}
                            >
                              <UserX className="h-3 w-3 mr-1" />
                              Revoke
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={roleDialog.open} onOpenChange={(open) => !open && setRoleDialog({ open: false, user: null, newRole: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              <span className="font-medium text-foreground">
                {getRoleActionLabel(roleDialog.newRole).toLowerCase()}
              </span>{" "}
              for <span className="font-medium text-foreground">{roleDialog.user?.email}</span>?
              {roleDialog.newRole === null && (
                <span className="block mt-2 text-destructive">
                  This will prevent the user from accessing the platform.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRoleChange}
              className={roleDialog.newRole === null ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {updateRole.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
