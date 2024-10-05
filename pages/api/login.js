export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // In a real application, you would validate the username and password against a database
    // For this example, we'll use a hardcoded check
    if (username === 'admin' && password === 'password') {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}