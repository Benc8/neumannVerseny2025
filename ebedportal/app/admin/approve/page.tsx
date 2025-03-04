"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, User as UserIcon, Mail } from "lucide-react";
import config from "@/lib/config";
import { users } from "@/database/schema";
import { Badge } from "@/components/ui/badge";
import { getPendingUsersWithImage } from "@/lib/actions/foodFetch";
import { toast } from "@/hooks/use-toast";

interface UserCardProps {
  user: users;
  onApprove: (userId: string) => void;
}

const UserCard = ({ user, onApprove }: UserCardProps) => {
  return (
    <Card className="bg-white dark:bg-gray-900 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          {user.image ? (
            <img
              src={
                user.image.startsWith(config.env.imagekit.urlEndpoint)
                  ? user.image
                  : `${config.env.imagekit.urlEndpoint}/${user.image}`
              }
              alt={user.name || "User"}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-gray-500" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold">
              {user.name || "Anonymous"}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
        <Badge variant={user.status === "PENDING" ? "secondary" : "default"}>
          {user.status}
        </Badge>
      </CardHeader>

      <CardContent className="flex justify-between items-center">
        {user.status === "PENDING" && (
          <Button
            onClick={() => onApprove(user.id)}
            className="bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800
              text-white font-bold rounded-lg shadow-lg transition-all duration-300
              transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve User
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// User List Component
const ListPendingUsers = async () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  // pendingUsers = await getPendingUsersWithImage();
  //console.log(pendingUsers);

  const handleApprove = async (userId: string) => {
    try {
      toast({
        title: "User Approved",
        description: "User has been successfully approved",
      });
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Failed to approve user",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid gap-6 p-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} onApprove={handleApprove} />
      ))}
    </div>
  );
};

export default ListPendingUsers;
