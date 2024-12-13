import { useUser } from "@/hooks/use-user";
import useSWR from "swr";
import { Order, OrderItem, Pet } from "db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect } from "react";

type OrderWithItems = Order & {
  items: (OrderItem & { pet: Pet })[];
};

export function Profile() {
  const { user } = useUser();
  const [, navigate] = useLocation();
  const { data: orders } = useSWR<OrderWithItems[]>(
    user ? "/api/orders" : null
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Username:</span> {user.username}
            </p>
            <p>
              <span className="font-semibold">Account Type:</span>{" "}
              {user.isAdmin ? "Administrator" : "Customer"}
            </p>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      <div className="space-y-4">
        {orders?.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Order #{order.id}</CardTitle>
              <CardDescription>
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <img
                        src={item.pet.imageUrl}
                        alt={item.pet.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold">{item.pet.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="font-bold text-lg">
                    Total: ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {orders?.length === 0 && (
          <p className="text-center text-gray-600">No orders yet</p>
        )}
      </div>
    </div>
  );
}
