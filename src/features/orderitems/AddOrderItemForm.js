import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOrderItem } from './orderItemsSlice'; // Update this to point to your Redux slice
import './AddOrderItemForm.css';

export const AddOrderItemForm = () => {
  const [order_id, setOrderId] = useState('');
  const [article_id, setArticleId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const dispatch = useDispatch();

  const canSave =
    Boolean(order_id) && Boolean(article_id) && Boolean(quantity) && Boolean(price);

  const onSaveOrderItemClicked = async () => {
    if (canSave) {
      await dispatch(addOrderItem({ order_id, article_id, quantity, price }));
      setOrderId('');
      setArticleId('');
      setQuantity(1);
      setPrice('');
    }
  };

  return (
    <form className="add-order-item-form">
      <label htmlFor="order-id">Order ID</label>
      <input
        id="order-id"
        type="number"
        value={order_id}
        onChange={(e) => setOrderId(e.target.value)}
      />

      <label htmlFor="article-id">Article ID</label>
      <input
        id="article-id"
        type="number"
        value={article_id}
        onChange={(e) => setArticleId(e.target.value)}
      />

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
        onClick={onSaveOrderItemClicked}
        disabled={!canSave}
      >
        Add Order Item
      </button>
    </form>
  );
};