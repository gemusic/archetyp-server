/**
 * CHAT ROUTES - LITE VERSION
 * Endpoints pour le chat (sans base de données)
 * Reçoit → Transmet directement
 */

import { Router, Request, Response } from 'express';
import { sendChatWebhook } from '../services/lindyService';
import { ApiResponse, ChatResponse, MessageQueue, FirstMessageTracker } from '../types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// In-memory storage (réinitialise au redémarrage du serveur)
const messageQueue: MessageQueue = {};
const firstMessageTracker: FirstMessageTracker = {};

/**
 * POST /api/send-popup-message
 * Recevoir le premier message du workflow Lindy
 * Afficher en popup + dans le chat
 */
router.post('/send-popup-message', async (req: Request, res: Response) => {
  try {
    const { visitor_id, message, message_type, timestamp } = req.body;

    if (!visitor_id || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: visitor_id, message',
      } as ApiResponse);
    }

    // Marquer comme premier message
    firstMessageTracker[visitor_id] = true;

    // Stocker en mémoire pour le polling
    if (!messageQueue[visitor_id]) {
      messageQueue[visitor_id] = [];
    }

    messageQueue[visitor_id].push({
      id: uuidv4(),
      visitor_id,
      message,
      sender: 'ai',
      message_type: message_type || 'popup',
      is_first: true,
      timestamp: timestamp || new Date().toISOString(),
    });

    console.log(`[chat] 📬 Popup message received for visitor: ${visitor_id}`);

    res.json({ success: true } as ApiResponse);
  } catch (error) {
    console.error('[chat] send-popup-message error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
});

/**
 * POST /api/send-chat-message
 * Recevoir les messages IA du workflow Lindy
 * Transmettre directement au frontend via polling
 */
router.post('/send-chat-message', async (req: Request, res: Response) => {
  try {
    const {
      visitor_id,
      message,
      sender,
      message_type,
      payment_product,
      timestamp,
    } = req.body;

    if (!visitor_id || !message || sender !== 'ai') {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields or invalid sender',
      } as ApiResponse);
    }

    // Préparer les données de paiement si nécessaire
    let paymentData = undefined;
    if (message_type === 'payment_link' && payment_product) {
      const paymentUrl = `https://checkout.stripe.com/pay/${visitor_id}_${payment_product.id}`;
      paymentData = {
        product: payment_product,
        payment_url: paymentUrl,
      };
    }

    // Stocker en mémoire pour le polling
    if (!messageQueue[visitor_id]) {
      messageQueue[visitor_id] = [];
    }

    messageQueue[visitor_id].push({
      id: uuidv4(),
      visitor_id,
      message,
      sender: 'ai',
      message_type: message_type || 'response',
      is_first: firstMessageTracker[visitor_id] || false,
      payment_data: paymentData,
      timestamp: timestamp || new Date().toISOString(),
    });

    console.log(`[chat] 💬 AI message received for visitor: ${visitor_id}`);

    res.json({ success: true } as ApiResponse);
  } catch (error) {
    console.error('[chat] send-chat-message error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
});

/**
 * GET /api/chat-response/:visitorId
 * Polling du frontend pour récupérer les messages
 * Retourne le premier message en attente
 */
router.get('/chat-response/:visitorId', async (req: Request, res: Response) => {
  try {
    const { visitorId } = req.params;

    if (!visitorId) {
      return res.status(400).json({
        success: false,
        error: 'Missing visitorId',
      } as ChatResponse);
    }

    // Récupérer le premier message en attente
    if (!messageQueue[visitorId] || messageQueue[visitorId].length === 0) {
      return res.json({
        success: false,
      } as ChatResponse);
    }

    const message = messageQueue[visitorId].shift();

    if (!message) {
      return res.json({
        success: false,
      } as ChatResponse);
    }

    res.json({
      success: true,
      message: message.message,
      is_first: message.is_first,
      payment_data: message.payment_data,
    } as ChatResponse);
  } catch (error) {
    console.error('[chat] chat-response error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ChatResponse);
  }
});

/**
 * POST /api/chat-opened
 * Notifier que le chat est ouvert
 * Envoyer webhook à Lindy pour déclencher le premier message
 */
router.post('/chat-opened', async (req: Request, res: Response) => {
  try {
    const { visitor_id, page_url } = req.body;

    if (!visitor_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing visitor_id',
      } as ApiResponse);
    }

    // Envoyer webhook à Lindy
    await sendChatWebhook({
      visitor_id,
      message: '',
      sender: 'user',
      action: 'chat_opened',
      page_url: page_url || '',
      timestamp: new Date().toISOString(),
    });

    console.log(`[chat] 🔓 Chat opened for visitor: ${visitor_id}`);

    res.json({ success: true } as ApiResponse);
  } catch (error) {
    console.error('[chat] chat-opened error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
});

/**
 * POST /api/visitor-message
 * Recevoir les messages utilisateur
 * Envoyer webhook à Lindy
 */
router.post('/visitor-message', async (req: Request, res: Response) => {
  try {
    const { visitor_id, message, timestamp } = req.body;

    if (!visitor_id || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: visitor_id, message',
      } as ApiResponse);
    }

    // Envoyer webhook à Lindy
    await sendChatWebhook({
      visitor_id,
      message,
      sender: 'user',
      page_url: '',
      timestamp: timestamp || new Date().toISOString(),
    });

    console.log(`[chat] 📨 User message sent to Lindy for visitor: ${visitor_id}`);

    res.json({ success: true } as ApiResponse);
  } catch (error) {
    console.error('[chat] visitor-message error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse);
  }
});

export default router;
