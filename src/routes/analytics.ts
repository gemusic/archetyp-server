/**
 * ANALYTICS ROUTES - LITE VERSION
 * Reçoit → Transmet directement à Lindy
 */

import { Router, Request, Response } from 'express';
import { sendConversionWebhook, sendProductWebhook } from '../services/lindyService';
import { ApiResponse } from '../types';

const router = Router();

/**
 * POST /api/analytics/conversion
 * Enregistrer une conversion
 * Envoyer webhook à Lindy
 */
router.post('/conversion', async (req: Request, res: Response) => {
  try {
    const {
      visitor_id,
      product_id,
      product_name,
      price,
      conversion_type,
      timestamp,
    } = req.body;

    if (!visitor_id || !product_id || !product_name || !price || !conversion_type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      } as ApiResponse);
    }

    // Envoyer webhook à Lindy (Flow 3 - Tracking conversions)
    await sendConversionWebhook({
      visitor_id,
      product_id,
      product_name,
      price,
      timestamp: timestamp || new Date().toISOString(),
      conversion_type,
    });

    console.log(`[analytics] 💰 Conversion recorded for visitor: ${visitor_id} (${conversion_type})`);

    res.json({ success: true } as ApiResponse);
  } catch (error) {
    console.error('[analytics] conversion error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
});

/**
 * POST /api/analytics/product-update
 * Mettre à jour le catalogue produits
 * Envoyer webhook à Lindy
 */
router.post('/product-update', async (req: Request, res: Response) => {
  try {
    const { action, product, timestamp } = req.body;

    if (!action || !product) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: action, product',
      } as ApiResponse);
    }

    // Envoyer webhook à Lindy (Flow 4 - Sync catalogue)
    await sendProductWebhook({
      action,
      product,
      timestamp: timestamp || new Date().toISOString(),
    });

    console.log(`[analytics] 📦 Product updated: ${action} - ${product.id}`);

    res.json({ success: true } as ApiResponse);
  } catch (error) {
    console.error('[analytics] product-update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
});

export default router;
