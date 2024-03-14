import { z } from "zod";
import fs from "fs";
import DefaultNetwork from "$lib/data/DefaultNetwork" 

const NodeSchema = z.object({
  label: z.string(),
  x: z.number(),
  y: z.number(),
});

const Router = z.object({
  labelSpace: z.object({}),
  neighborRouters: z.object({}),
  id: z.number(),
  node: NodeSchema,
  LIB: z.object({}),
  FIB: z.object({}),
  allowedConnections: z.array(z.string()),
});

const schema = z.object({
  store: z.object({}),
  _routers: z.array(Router),
});

fs.readFile("srclibdataDefaultNetwork.JSON", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log(data);

  try {
    const jsonData = JSON.parse(data);
    const validatedData = schema.parse(jsonData);
    console.log("Data is valid:", validatedData);

    createDefaultNetwork(validatedData);
  } catch (error) {
    console.error("Data is invalid", error.errors);
  }
});

function createDefaultNetwork(data) {
  /*Logic to implement data here*/
}
