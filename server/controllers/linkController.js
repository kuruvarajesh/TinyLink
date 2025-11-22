import Link from '../models/Link.js';

const validateUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

const validateCode = (code) => /^[A-Za-z0-9]{6,8}$/.test(code);

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createLink = async (req, res) => {
  try {
    let { url, code } = req.body;

    if (!url || !validateUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL. Please provide a valid HTTP/HTTPS URL.' });
    }

    if (!code) {
      code = generateCode();
      while (await Link.codeExists(code)) {
        code = generateCode();
      }
    } else {
      if (!validateCode(code)) {
        return res.status(400).json({ error: 'Invalid code. Code must be 6-8 alphanumeric characters.' });
      }
      if (await Link.codeExists(code)) {
        return res.status(409).json({ error: 'Code already exists. Please choose a different code.' });
      }
    }

    const link = await Link.create(code, url);
    res.status(201).json({
      success: true,
      data: {
        code: link.code,
        original_url: link.original_url,
        total_clicks: link.total_clicks,
        last_clicked: link.last_clicked,
        created_at: link.created_at
      }
    });
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ error: 'Failed to create link' });
  }
};

export const getAllLinks = async (req, res) => {
  try {
    const { search } = req.query;
    const links = await Link.findAll(search);
    res.json({
      success: true,
      data: links.map(link => ({
        code: link.code,
        original_url: link.original_url,
        total_clicks: link.total_clicks,
        last_clicked: link.last_clicked,
        created_at: link.created_at
      }))
    });
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({ error: 'Failed to fetch links' });
  }
};

export const getLinkStats = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findByCode(code);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({
      success: true,
      data: {
        code: link.code,
        original_url: link.original_url,
        total_clicks: link.total_clicks,
        last_clicked: link.last_clicked,
        created_at: link.created_at
      }
    });
  } catch (error) {
    console.error('Get link stats error:', error);
    res.status(500).json({ error: 'Failed to fetch link stats' });
  }
};

export const deleteLink = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.delete(code);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ success: true, message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({ error: 'Failed to delete link' });
  }
};

