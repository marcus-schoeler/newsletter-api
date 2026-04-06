export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        includeListIds: [7], // ⚠️ später anpassen!
        templateId: 9,       // ⚠️ später anpassen!
        redirectionUrl: "https://deine-domain.de/danke"
      }),
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: 'Failed' });
  }
}
