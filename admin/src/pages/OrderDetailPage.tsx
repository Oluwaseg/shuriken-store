import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { fetchOrderById } from "../components/tables/apis/orders";
import { Order } from "../components/tables/types/type";

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetchOrderById(orderId);
        if (response && response.order) {
          setOrder(response.order);
        } else {
          setError("Order details are not available.");
        }
      } catch {
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId]);

  if (loading)
    return (
      <div className="text-center py-12">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600 font-semibold">{error}</p>
      </div>
    );
  if (!order)
    return (
      <div className="text-center py-12">
        <p className="text-lg font-semibold">No order found.</p>
      </div>
    );

  return (
    <div className="container mx-auto p-6 md:p-12 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Link
        to="/orders"
        className="flex items-center space-x-2 mb-8 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300"
      >
        <FaArrowLeft className="text-xl" />
        <span className="text-lg font-medium">Back to Orders</span>
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Shipping Information
          </h2>
          {order.shippingInfo ? (
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>
                <strong>Address:</strong> {order.shippingInfo.address}
              </p>
              <p>
                <strong>City:</strong> {order.shippingInfo.city}
              </p>
              <p>
                <strong>State:</strong> {order.shippingInfo.state}
              </p>
              <p>
                <strong>Country:</strong> {order.shippingInfo.country}
              </p>
              <p>
                <strong>Postal Code:</strong> {order.shippingInfo.postalCode}
              </p>
              <p>
                <strong>Phone No:</strong> {order.shippingInfo.phoneNo}
              </p>
            </div>
          ) : (
            <p>No shipping information available.</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Payment Information
          </h2>
          {order.paymentInfo ? (
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>
                <strong>ID:</strong> {order.paymentInfo.id}
              </p>
              <p>
                <strong>Status:</strong> {order.paymentInfo.status}
              </p>
            </div>
          ) : (
            <p>No payment information available.</p>
          )}
        </div>

        <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Order Items
          </h2>
          {order.orderItems && order.orderItems.length > 0 ? (
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {item.name}
                    </p>
                    <p>
                      <strong>Price:</strong> ${item.price}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No items in this order.</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Order Summary
          </h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p>
              <strong>Items Price:</strong> ${order.itemsPrice}
            </p>
            <p>
              <strong>Tax Price:</strong> ${order.taxPrice}
            </p>
            <p>
              <strong>Shipping Price:</strong> ${order.shippingPrice}
            </p>
            <p>
              <strong>Total Price:</strong> ${order.totalPrice}
            </p>
            <p>
              <strong>Status:</strong> {order.orderStatus}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
