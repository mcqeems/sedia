export interface WeatherAlert {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

export default async function getPeringatanCuaca(): Promise<WeatherAlert[]> {
  const response = await fetch("/api/bmkg/alerts/nowcast/id/rss.xml");
  const xmlText = await response.text();

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  const itemNodes = xmlDoc.querySelectorAll("item");

  const alerts: WeatherAlert[] = Array.from(itemNodes).map((node) => {
    return {
      title: node.querySelector("title")?.textContent || "No Title",
      link: node.querySelector("link")?.textContent || "",
      description: node.querySelector("description")?.textContent || "",
      pubDate: node.querySelector("pubDate")?.textContent || "",
    };
  });

  return alerts;
}
