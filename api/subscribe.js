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

  const { email } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ error: "Email missing" });
  }

  try {
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
          redirectionUrl: "redirectionUrl: "https://195093-copy6.cargo.site/?subscribed=true"
        })
      }
    );

    const data = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Brevo request failed",
        details: data
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error: "Failed",
      details: String(error)
    });
  }
}
