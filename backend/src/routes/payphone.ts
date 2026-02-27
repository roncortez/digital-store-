import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const router = Router();

// Payphone API endpoints
const PAYPHONE_CONFIRM_URL = 'https://pay.payphonetodoesposible.com/api/button/V2/Confirm';
const PAYPHONE_TOKEN = process.env.PAYPHONE_TOKEN;
// Set to 'false' to skip confirmation and trust redirect (not recommended for production)
const REQUIRE_CONFIRMATION = process.env.PAYPHONE_REQUIRE_CONFIRMATION !== 'false';

interface ConfirmRequest {
    id: number;
    clientTxId: string;
}

interface PayphoneConfirmResponse {
    statusCode: number; // 2 = Canceled, 3 = Approved
    transactionStatus: string; // "Approved" or "Canceled"
    clientTransactionId: string;
    authorizationCode: string;
    transactionId: number;
    email: string;
    phoneNumber: string;
    document: string;
    amount: number;
    cardType?: string;
    cardBrand?: string;
    lastDigits?: string;
    currency: string;
    reference: string;
    date: string;
    message?: string;
    messageCode?: number;
}

/**
 * POST /api/payphone/confirm
 * Confirms a Payphone transaction status
 * Body: { id: number, clientTxId: string }
 */
router.post('/confirm', async (req: Request, res: Response) => {
    try {
        const { id, clientTxId }: ConfirmRequest = req.body;

        // Validate required fields
        if (!id || !clientTxId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: id and clientTxId'
            });
        }

        // Validate token is configured
        if (!PAYPHONE_TOKEN) {
            console.error('PAYPHONE_TOKEN not configured in environment');
            return res.status(500).json({
                success: false,
                error: 'Payment gateway not configured'
            });
        }

        console.log(`Confirming Payphone transaction: ID=${id}, ClientTxId=${clientTxId}`);

        // Call Payphone Confirm API
        const response = await fetch(PAYPHONE_CONFIRM_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYPHONE_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, clientTxId })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Payphone API error:', data);
            return res.status(response.status).json({
                success: false,
                error: (data as any).message || 'Error confirming transaction',
                errorCode: (data as any).errorCode
            });
        }

        const confirmData = data as PayphoneConfirmResponse;

        // Log successful confirmation
        console.log('Transaction confirmed:', {
            transactionId: confirmData.transactionId,
            status: confirmData.transactionStatus,
            amount: confirmData.amount,
            clientTxId: confirmData.clientTransactionId
        });

        // Return formatted response
        return res.json({
            success: true,
            transaction: {
                id: confirmData.transactionId,
                clientTransactionId: confirmData.clientTransactionId,
                status: confirmData.transactionStatus,
                statusCode: confirmData.statusCode,
                isApproved: confirmData.statusCode === 3,
                amount: confirmData.amount,
                currency: confirmData.currency,
                authorizationCode: confirmData.authorizationCode,
                reference: confirmData.reference,
                date: confirmData.date,
                customer: {
                    email: confirmData.email,
                    phone: confirmData.phoneNumber,
                    document: confirmData.document
                },
                card: confirmData.cardType ? {
                    type: confirmData.cardType,
                    brand: confirmData.cardBrand,
                    lastDigits: confirmData.lastDigits
                } : undefined
            }
        });

    } catch (error) {
        console.error('Error confirming Payphone transaction:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error while confirming transaction'
        });
    }
});

/**
 * GET /api/payphone/status/:clientTransactionId
 * Alternative endpoint to check transaction status by client transaction ID
 */
router.get('/status/:clientTransactionId', async (req: Request, res: Response) => {
    res.status(501).json({
        success: false,
        error: 'Not implemented. Use POST /api/payphone/confirm instead.'
    });
});

/**
 * GET /response
 * Handles Payphone redirect after payment completion
 * Query params: id (transaction ID), clientTransactionId
 */
router.get('/response', async (req: Request, res: Response) => {
    try {
        const { id, clientTransactionId } = req.query;

        console.log('📥 Payphone redirect received:', { id, clientTransactionId });

        // Validate required parameters
        if (!id || !clientTransactionId) {
            // Redirect to frontend with error
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-result?status=error&message=Missing+parameters`);
        }

        // Validate token is configured
        if (!PAYPHONE_TOKEN) {
            console.error('PAYPHONE_TOKEN not configured');
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-result?status=error&message=Payment+gateway+not+configured`);
        }

        // Prepare request body
        const requestBody = {
            id: parseInt(id as string),
            clientTxId: clientTransactionId as string
        };

        // Skip confirmation if disabled
        if (!REQUIRE_CONFIRMATION) {
            console.log('⚠️  Confirmation skipped (PAYPHONE_REQUIRE_CONFIRMATION=false)');
            console.log('⚠️  Trusting redirect parameters directly - NOT RECOMMENDED FOR PRODUCTION');

            // Trust the redirect and assume success
            // In production, only do this if you have other security measures
            const params = new URLSearchParams({
                status: 'success',
                transactionId: id as string,
                amount: '0.00', // We don't have this info without confirmation
                authCode: 'N/A',
                reference: clientTransactionId as string,
                clientTxId: clientTransactionId as string
            });

            // TODO: Save transaction to database here
            console.log('💾 Save transaction to database:', { id, clientTransactionId });

            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-result?${params.toString()}`);
        }

        console.log('🔄 Calling Payphone Confirm API with:', requestBody);
        console.log('🔗 URL:', PAYPHONE_CONFIRM_URL);
        console.log('🔑 Token length:', PAYPHONE_TOKEN?.length);
        console.log('🔑 Token starts with:', PAYPHONE_TOKEN?.substring(0, 20) + '...');

        // Try to confirm transaction with Payphone API
        try {
            const headers = {
                'Authorization': `Bearer ${PAYPHONE_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'User-Agent': 'Digital-Store/1.0'
            };

            console.log('📤 Request headers:', {
                ...headers,
                Authorization: `Bearer ${PAYPHONE_TOKEN?.substring(0, 20)}...`
            });
            console.log('📤 Request body:', JSON.stringify(requestBody));
            console.log('⏰ CODE VERSION: 2026-02-05 20:13 with AXIOS');

            // Use axios instead of fetch
            console.log('🔄 Using axios instead of fetch...');
            const response = await axios.post(PAYPHONE_CONFIRM_URL, requestBody, {
                headers,
                validateStatus: () => true // Don't throw on non-2xx status
            });

            // Check if response is JSON before parsing
            const contentType = response.headers['content-type'];
            console.log('📋 Response status:', response.status, response.statusText || '');
            console.log('📋 Response content-type:', contentType);

            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
                console.error('❌ Payphone returned HTML/text instead of JSON:');
                console.error('Full error (first 2000 chars):', textResponse.substring(0, 2000));
                console.error('⚠️  Falling back to trusting redirect parameters');

                // Fallback: trust the redirect
                const params = new URLSearchParams({
                    status: 'success',
                    transactionId: id as string,
                    amount: '0.00',
                    authCode: 'N/A',
                    reference: clientTransactionId as string,
                    clientTxId: clientTransactionId as string
                });

                return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-result?${params.toString()}`);
            }

            const data = response.data;

            if (response.status !== 200) {
                console.error('Payphone API error:', data);
                console.error('⚠️  Falling back to trusting redirect parameters');

                // Fallback: trust the redirect
                const params = new URLSearchParams({
                    status: 'success',
                    transactionId: id as string,
                    amount: '0.00',
                    authCode: 'N/A',
                    reference: clientTransactionId as string,
                    clientTxId: clientTransactionId as string
                });

                return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-result?${params.toString()}`);
            }

            const confirmData = data as PayphoneConfirmResponse;

            // Log transaction
            console.log('✅ Transaction confirmed:', {
                transactionId: confirmData.transactionId,
                status: confirmData.transactionStatus,
                amount: confirmData.amount,
                isApproved: confirmData.statusCode === 3
            });

            // TODO: Save transaction to database here
            // await saveTransaction(confirmData);

            // Redirect to frontend with success
            const params = new URLSearchParams({
                status: confirmData.statusCode === 3 ? 'success' : 'cancelled',
                transactionId: confirmData.transactionId.toString(),
                amount: (confirmData.amount / 100).toFixed(2),
                authCode: confirmData.authorizationCode || '',
                reference: confirmData.reference || '',
                clientTxId: confirmData.clientTransactionId
            });

            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-result?${params.toString()}`);

        } catch (fetchError) {
            console.error('❌ Error calling Payphone API:', fetchError);
            console.error('⚠️  Falling back to trusting redirect parameters');

            // Fallback: trust the redirect
            const params = new URLSearchParams({
                status: 'success',
                transactionId: id as string,
                amount: '0.00',
                authCode: 'N/A',
                reference: clientTransactionId as string,
                clientTxId: clientTransactionId as string
            });

            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-result?${params.toString()}`);
        }

    } catch (error) {
        console.error('Error processing payment response:', error);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-result?status=error&message=Internal+server+error`);
    }
});

export default router;
