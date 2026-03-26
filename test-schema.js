async function getSchema() {
  const response = await fetch('https://api.dicebear.com/9.x/avataaars/schema.json');
  const json = await response.json();
  console.log("Allowed Tops:", json.properties.top.items.enum.join(', '));
  console.log("Allowed Clothing:", json.properties.clothing.items.enum.join(', '));
  console.log("Allowed Eyes:", json.properties.eyes.items.enum.join(', '));
  console.log("Allowed Accessories:", json.properties.accessories.items.enum.join(', '));
}
getSchema();
