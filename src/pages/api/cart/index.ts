import type { APIRoute } from "astro";
import { readCartJSONFile, writeCartJSONFile } from "../../../utils/file";

export const prerender = false;

// GET: Retrieve current cart items
export const GET: APIRoute = async () => {
  const cart = await readCartJSONFile();
  return new Response(JSON.stringify(cart), { status: 200 });
};

// POST: Add an item to the cart
export const POST: APIRoute = async ({ request }) => {
  const newItem = await request.json();
  const cart = await readCartJSONFile();

  // Check if the item already exists in the cart
  const existingItem = cart.find((item: any) => item.id === newItem.id);

  if (existingItem) {
    // If the item already exists, update its quantity
    existingItem.quantity += newItem.quantity;
  } else {
    // Otherwise, add the new item to the cart with an initial quantity
    newItem.quantity = newItem.quantity || 1;
    cart.push(newItem);
  }

  await writeCartJSONFile(cart);

  return new Response(JSON.stringify(newItem), { status: 201 });
};

// PUT: Update quantity of an existing item in the cart
export const PUT: APIRoute = async ({ request }) => {
  const updatedItem = await request.json();
  const cart = await readCartJSONFile();

  const itemIndex = cart.findIndex((item: any) => item.id === updatedItem.id);

  if (itemIndex === -1) {
    return new Response(JSON.stringify({ error: "Item not found in cart" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  cart[itemIndex].quantity = updatedItem.quantity;
  await writeCartJSONFile(cart);

  return new Response(JSON.stringify(cart[itemIndex]), { status: 200 });
};

// DELETE: Remove an item from the cart
export const DELETE: APIRoute = async ({ request }) => {
  const { id } = await request.json();
  const cart = await readCartJSONFile();

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing ID parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const itemIndex = cart.findIndex((item: any) => item.id === id);

  if (itemIndex === -1) {
    return new Response(JSON.stringify({ error: "Item not found in cart" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  cart.splice(itemIndex, 1);
  await writeCartJSONFile(cart);

  return new Response(JSON.stringify({ message: "Item removed from cart" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
