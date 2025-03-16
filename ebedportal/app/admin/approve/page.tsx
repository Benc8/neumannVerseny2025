"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import config from "@/lib/config";
import { users } from "@/database/schema";
import { getPendingUsersWithImage } from "@/lib/actions/foodFetch";
import { toast } from "@/hooks/use-toast";

interface BigUserCardProps {
  user: users;
  onApprove: (userId: string) => void;
}

const BigUserCard = ({ user, onApprove }: BigUserCardProps) => {
  return (
    <Card className="bg-white dark:bg-gray-900 shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
        <p className="text-2xl font-bold text-center flex-1">{user.email}</p>
        <Badge variant={user.status === "PENDING" ? "secondary" : "default"}>
          {user.status}
        </Badge>
      </CardHeader>
      <div className="flex flex-col sm:flex-row items-center">
        <CardContent className="w-full flex flex-col items-center justify-center mb-4 sm:mb-0 sm:mr-4">
          <img
            src={user.imageUrl}
            alt={user.email}
            className="mx-auto sm:max-h-[40vh] xl:max-h-[28.33vh] rounded-lg box-border"
          />
        </CardContent>
        <CardContent className="w-full flex flex-col items-center justify-center">
          {user.status === "PENDING" && (
            <Button
              onClick={() => onApprove(user.id)}
              className="bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800
                text-white font-bold rounded-lg shadow-lg transition-all duration-300
                transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
            >
              Jóváhagyás
            </Button>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

const ListPendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState<users[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPendingUsersWithImage()
      .then((data) => {
        setPendingUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Nem sikerült a felhasználók lekérése");
        setLoading(false);
      });
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      toast({
        title: "Felhasználó jóváhagyva",
        description: "A felhasználó sikeresen jóvá lett hagyva",
      });
      setPendingUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: "APPROVED" } : user,
        ),
      );
    } catch (error) {
      toast({
        title: "Jóváhagyás sikertelen",
        description: "Nem sikerült jóváhagyni a felhasználót",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Felhasználók betöltése...</div>;
  if (error) return <div>Hiba: {error}</div>;

  return (
    <div className="grid gap-6 p-4">
      {pendingUsers.map((user) => (
        <BigUserCard key={user.id} user={user} onApprove={handleApprove} />
      ))}
    </div>
  );
};

export default ListPendingUsers;
