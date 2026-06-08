export default async function handler(req, res) {
    // السماح بالوصول من أي مصدر (لن نستخدم CORS لأن المتصل من نفس الخادم)
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { inputs, parameters } = req.body;

    if (!inputs) {
        return res.status(400).json({ error: 'Missing image data' });
    }

    const HF_API_TOKEN = "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";
    const HF_MODEL = "timbrooks/instruct-pix2pix";
    const HF_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

    try {
        const response = await fetch(HF_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs, parameters })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }

        // إعادة الصورة المعدلة كـ binary
        const buffer = await response.buffer();
        res.setHeader('Content-Type', 'image/png');
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
              }
