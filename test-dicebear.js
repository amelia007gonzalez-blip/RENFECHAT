async function testUrl() {
  const url = "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&top=shortHair&hairColor=724133&eyes=default&clothing=hoodie&backgroundColor=b6e3f4&radius=20";
  console.log("Fetching: " + url);
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    console.error("HTTP " + response.status + ": " + text);
  } else {
    console.log("HTTP 200 OK! Image loaded successfully.");
  }
}
testUrl();
