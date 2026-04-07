export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
 
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
 
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
 
  try {
    let email = "";
 
    // JSON submit
    if (req.headers["content-type"]?.includes("application/json")) {
      email = req.body?.email || "";
    } else {
      // HTML form submit
      email =
        req.body?.email ||
        req.body?.EMAIL ||
        "";
    }
 
    email = String(email).trim();
 
    if (!email) {
      return res.status(400).send("Email missing");
    }
 
    if (!process.env.BREVO_API_KEY) {
      return res.status(500).send("Missing API key");
    }
 
    const response = await fetch(
      "https://api.brevo.com/v3/contacts/doubleOptinConfirmation",
      {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email,
          includeListIds: [7],
          templateId: 1,
          redirectionUrl: "https://195093-copy7.cargo.site/edit/M0313394714"
        })
      }
    );
 
    const data = await response.text();
 
    if (!response.ok) {
      return res.status(response.status).send(`Brevo error: ${data}`);
    }
 
    // Nach Formular-Absenden auf Hinweis-Seite leiten
    return res.redirect(303, "https://195093-copy7.cargo.site/newsletter-check-email");
  } catch (error) {
    return res.status(500).send(`Server crashed: ${error.message}`);
  }
}
