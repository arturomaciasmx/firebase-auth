import { Item, ItemAccess } from "./api/items/route";

export default async function Home() {
  let items: Item[] = [];

  const response = await fetch(`${process.env.API_URL}/api/items`, { cache: "no-store" });

  if (response.ok) {
    const itemsJson = await response.json();
    if (itemsJson && itemsJson.length > 0) {
      items = itemsJson;
      console.log(items);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Homepage</h1>

      {items.map((item) => {
        return (
          <div key={item.id} className="border p-4 my-4">
            <p>{item.title}</p>
            <span
              className={`${
                item.access === ItemAccess.ADMIN
                  ? "bg-orange-400"
                  : item.access === ItemAccess.PRO
                  ? "bg-blue-400"
                  : item.access === ItemAccess.USER
                  ? "bg-green-400"
                  : "bg-gray-400"
              } text-white text-xs px-2 py-1 rounded`}
            >
              {item.access}
            </span>
          </div>
        );
      })}
    </div>
  );
}
