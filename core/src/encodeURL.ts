import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { URL_PROTOCOL } from './constants';

/**
 * Optional query parameters to encode in a Fyfy Pay URL.
 */
export interface EncodeURLParams {
    /** `amount` in the [Fyfy Pay spec](https://github.com/vamise/fyfy-pay/blob/master/SPEC.md#memoblob/master/SPEC.md#amount) */
    amount?: BigNumber;
    /** `splToken` in the [Fyfy Pay spec](https://github.com/vamise/fyfy-pay/blob/master/SPEC.md#memoblob/master/SPEC.md#spl-token) */
    splToken?: PublicKey;
    /** `reference` in the [Fyfy Pay spec](https://github.com/vamise/fyfy-pay/blob/master/SPEC.md#memoblob/master/SPEC.md#reference) */
    reference?: PublicKey | PublicKey[];
    /** `label` in the [Fyfy Pay spec](https://github.com/vamise/fyfy-pay/blob/master/SPEC.md#memoblob/master/SPEC.md#label) */
    label?: string;
    /** `message` in the [Fyfy Pay spec](https://github.com/vamise/fyfy-pay/blob/master/SPEC.md#memoblob/master/SPEC.md#message)  */
    message?: string;
    /** `memo` in the [Fyfy Pay spec](https://github.com/vamise/fyfy-pay/blob/master/SPEC.md#memoblob/master/SPEC.md#memo) */
    memo?: string;
}

/**
 * Required and optional URL components to encode in a Fyfy Pay URL.
 */
export interface EncodeURLComponents extends EncodeURLParams {
    /** `recipient` in the [Fyfy Pay spec](https://github.com/vamise/fyfy-pay/blob/master/SPEC.md#memoblob/master/SPEC.md#recipient) */
    recipient: PublicKey;
}

/**
 * Encode a Fyfy Pay URL from required and optional components.
 *
 * @param {EncodeURLComponents} components
 *
 * @param components.recipient
 * @param components.amount
 * @param components.splToken
 * @param components.reference
 * @param components.label
 * @param components.message
 * @param components.memo
 */
export function encodeURL({ recipient, ...params }: EncodeURLComponents): string {
    let url = URL_PROTOCOL + encodeURIComponent(recipient.toBase58());

    const encodedParams = encodeURLParams(params);
    if (encodedParams) {
        url += '?' + encodedParams;
    }

    return url;
}

function encodeURLParams({ amount, splToken, reference, label, message, memo }: EncodeURLParams): string {
    const params: [string, string][] = [];

    if (amount) {
        params.push(['amount', amount.toFixed(amount.decimalPlaces())]);
    }

    if (splToken) {
        params.push(['spl-token', splToken.toBase58()]);
    }

    if (reference) {
        if (!Array.isArray(reference)) {
            reference = [reference];
        }

        for (const pubkey of reference) {
            params.push(['reference', pubkey.toBase58()]);
        }
    }

    if (label) {
        params.push(['label', label]);
    }

    if (message) {
        params.push(['message', message]);
    }

    if (memo) {
        params.push(['memo', memo]);
    }

    return params.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
}
