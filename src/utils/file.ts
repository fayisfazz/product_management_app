import { promises as fs } from "fs";
import { resolve } from "path";

const filePath = resolve("data/products.json");

export async function readJSONFile() {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function writeJSONFile(data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function readCartJSONFile() {
  const data = await fs.readFile(resolve("data/carts.json"), "utf-8");
  return JSON.parse(data);
}

export async function writeCartJSONFile(data: any) {
  await fs.writeFile(resolve("data/carts.json"), JSON.stringify(data, null, 2), "utf-8");
}
