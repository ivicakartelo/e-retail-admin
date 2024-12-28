import React, { useState } from 'react';

export const UpdateOrderItemForm = ({ orderItem, setShowEditForm, fetchOrderItems }) => {
  const [quantity, setQuantity] = useState(orderItem.quantity);
  const [price, setPrice] = useState(orderItem.price);
  
  const canSave = Boolean(quantity) && Boolean(price);

  // Function to save changes and immediately update the front-end
  const onSaveChangesClicked = async () => {
    if (canSave) {
      try {
        // Step 1: Update the order item on the backend using fetch
        const response = await fetch(`http://localhost:5000/order-items/${orderItem.order_item_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity,
            price,
          }),
        });

        // Step 2: If successful, update the local state
        if (response.ok) {
          // Update the orderItem in the parent state (if needed)
          fetchOrderItems(); // Re-fetch all items to ensure the list is up-to-date
          setShowEditForm(false); // Close the edit form
        } else {
          console.error('Failed to update order item');
        }
      } catch (error) {
        console.error('Error updating order item:', error);
      }
    }
  };

  return (
    <form className="update-order-item-form">
      <label htmlFor="quantity">Quantity</label>
      <input
        id="quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
      />

      <label htmlFor="price">Price</label>
      <input
        id="price"
        type="number"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button
        type="button"
        onClick={onSaveChangesClicked}
        disabled={!canSave}
      >
        Save Changes
      </button>
    </form>
  );
};