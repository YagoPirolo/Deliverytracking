// Initialize Supabase client and create a global variable to store the client
const { createClient } = supabase;
supabase = createClient(
  "https://ohxlbckqsfawqrgsdfhq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeGxiY2txc2Zhd3FyZ3NkZmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc2MTAxMTcsImV4cCI6MTk5MzE4NjExN30.mMN0RVHHw4yIpWM8dnYOFUU9--BgembFSVM7Bc3Cv4A"
);

const ordersTableBody = document.getElementById("ordersTableBody");

async function fetchOrders() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      user_id,
      total_amount,
      user_id:users (
        name
      ),
      order_delivery_status (
        delivery_status_id:delivery_status (
          status_name
        )
      )
    `)
    .order("id");

  if (error) {
    console.error("Error fetching orders:", error);
    return;
  }

  orders.forEach((order) => {
    const row = document.createElement("tr");

    const orderIdCell = document.createElement("td");
    orderIdCell.textContent = order.id;
    row.appendChild(orderIdCell);

    const customerNameCell = document.createElement("td");
    customerNameCell.textContent = order.user_id.name;
    row.appendChild(customerNameCell);

    const totalAmountCell = document.createElement("td");
    totalAmountCell.textContent = `$${order.total_amount.toFixed(2)}`;
    row.appendChild(totalAmountCell);

    const deliveryStatusCell = document.createElement("td");
    const currentStatus = order.order_delivery_status.slice(-1)[0];
    
    if (currentStatus && currentStatus.delivery_status_id) {
      deliveryStatusCell.textContent = currentStatus.delivery_status_id.status_name;
    } else {
      deliveryStatusCell.textContent = 'Not available';
    }
    
    row.appendChild(deliveryStatusCell);

    ordersTableBody.appendChild(row);
  });
}

fetchOrders();


