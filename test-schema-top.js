async function getSchema() {
  const response = await fetch('https://api.dicebear.com/9.x/avataaars/schema.json');
  const json = await response.json();
  console.log("Allowed Tops:");
  console.dir(json.properties.top.items.enum, { maxArrayLength: null });
}
getSchema();
