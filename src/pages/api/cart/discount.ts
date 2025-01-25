import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { quantity, total } = await request.json();


    // Discount values
    const discounts = [
      {
        count: 3,
        percentage: 5,
      },
      {
        count: 10,
        percentage: 10,
      },
    ];

    const calcDiscount = (quantity: number, total: number) => {
      const bestDiscount = discounts.reduce(
        (best, item) => {
          if (item.count <= quantity && item.percentage > best.percentage) {
            return item;
          }
          return best;
        },
        { count: 0, percentage: 0 }
      );

      const discountValue = (bestDiscount.percentage / 100) * total;
      return discountValue;
    };

    const discountValue = calcDiscount(quantity, total);

    return new Response(
      JSON.stringify({ discount: discountValue }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
};
