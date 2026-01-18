/**
 * TRACKING ROUTES - LITE VERSION
 * Reçoit → Transmet directement à Lindy
 */

import { Router, Request, Response } from 'express';
import { sendTrackingWebhook } from '../services/lindyService';
import { ApiResponse } from '../types';

const router = Router();

/**
 * POST /api/track-behavior
 * Recevoir les données de tracking (25 secondes)
 * Envoyer webhook à Lindy
 */
router.post('/track-behavior', async (req: Request, res: Response) => {
  try {
    const { visitor_id, session_id, tracking_data } = req.body;

    if (!visitor_id || !tracking_data) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: visitor_id, tracking_data',
      } as ApiResponse);
    }

    // Envoyer webhook à Lindy (Flow 1 - Analyse comportementale)
    await sendTrackingWebhook({
      visitor_id,
      tracking_data,
    });

    console.log(`[tracking] 📊 Tracking data sent to Lindy for visitor: ${visitor_id}`);

    res.json({ success: true } as ApiResponse);
  } catch (error) {
    console.error('[tracking] track-behavior error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
});

export default router;
