import OrderTable from "../components/tables/OrderTable";

const Order = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <OrderTable />
    </div>
  );
};

export default Order;
