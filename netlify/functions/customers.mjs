import { getStore } from "@netlify/blobs";

// Data structure:
// {
//   shops: {
//     stratou: { "6912345678": { stamps, totalCoffees, ... }, ... },
//     martiou: { ... },
//     olgas: { ... }
//   }
// }

export default async (req) => {
  try {
    const store = getStore("getandgo");

    if (req.method === "GET") {
      const data = await store.get("data", { type: "json" });
      const defaultData = {
        shops: { stratou: {}, martiou: {}, olgas: {} }
      };
      return Response.json(data || defaultData);
    }

    if (req.method === "POST") {
      const data = await req.json();
      if (!data || typeof data !== "object" || !data.shops) {
        return Response.json({ error: "Invalid data structure" }, { status: 400 });
      }
      await store.setJSON("data", data);
      return Response.json({ ok: true, savedAt: Date.now() });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  } catch (err) {
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
};

export const config = {
  path: "/api/customers"
};
