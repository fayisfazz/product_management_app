import type { APIRoute } from "astro";
import { readJSONFile, writeJSONFile } from "../../../utils/file";
import { v4 as uuidv4 } from 'uuid';

export const prerender = false;

export const GET: APIRoute = async () => {
  const products = await readJSONFile();
  return new Response(JSON.stringify(products), { status: 200 });
};


export const POST: APIRoute = async ({ request }) => {
    const newProduct = await request.json();    
  const products = await readJSONFile();

  // Generate a new ID for the product
  newProduct.id = uuidv4()

  products.push(newProduct);
  await writeJSONFile(products);

  return new Response(JSON.stringify(newProduct), { status: 201 });
};



export const DELETE: APIRoute = async ({ request }) => {
  const {id} = await request.json();
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing ID parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const products = await readJSONFile();
    const newProducts = products.filter((product: any) => product.id !== id);

    if (newProducts.length === products.length) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await writeJSONFile(newProducts);

    return new Response(JSON.stringify({ message: "Product deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const PUT: APIRoute = async ({  request }) => {
  const data = await request.json();
  if (!data?.id) {
    return new Response(JSON.stringify({ error: "Missing ID parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const products = await readJSONFile();
    const productIndex = products.findIndex((product: any) => product.id === data.id);
    if (productIndex === -1) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedProducts = products.filter((product: any) => product.id !== data.id);
    updatedProducts.push(data)
  
    await writeJSONFile(updatedProducts);

    return new Response(JSON.stringify(products[productIndex]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error,"error")
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};




