import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { parseURL } from '../src';

describe('parseURL', () => {
    describe('parsing', () => {
        describe('when given correct params', () => {
            it('should parse successfully', () => {
                const url =
                    'solana:GV11559jEBBXYnVAZkQvVxTb3X7tkWkeFoC5H7jTJs8F?amount=0.000000001&reference=82ZJ7nbGpixjeDCmEhUcmwXYfvurzAgGdtSMuHnUgyny&label=Michael&message=Thanks%20for%20all%20the%20fish&memo=OrderId5678';

                const { recipient, amount, splToken, reference, label, message, memo } = parseURL(url);

                expect(recipient.equals(new PublicKey('GV11559jEBBXYnVAZkQvVxTb3X7tkWkeFoC5H7jTJs8F'))).toBe(true);
                expect(amount!.eq(new BigNumber('0.000000001'))).toBe(true);
                expect(splToken).toBeUndefined();
                expect(reference).toHaveLength(1);
                expect(reference![0]!.equals(new PublicKey('82ZJ7nbGpixjeDCmEhUcmwXYfvurzAgGdtSMuHnUgyny'))).toBe(true);
                expect(label).toBe('Michael');
                expect(message).toBe('Thanks for all the fish');
                expect(memo).toBe('OrderId5678');
            });

            it('should parse with spl-token', () => {
                const url =
                    'solana:GV11559jEBBXYnVAZkQvVxTb3X7tkWkeFoC5H7jTJs8F?amount=1.01&spl-token=82ZJ7nbGpixjeDCmEhUcmwXYfvurzAgGdtSMuHnUgyny&label=Michael&message=Thanks%20for%20all%20the%20fish&memo=OrderId5678';

                const { recipient, amount, splToken, reference, label, message, memo } = parseURL(url);

                expect(recipient.equals(new PublicKey('GV11559jEBBXYnVAZkQvVxTb3X7tkWkeFoC5H7jTJs8F'))).toBe(true);
                expect(amount!.eq(new BigNumber('1.01'))).toBe(true);
                expect(splToken!.equals(new PublicKey('82ZJ7nbGpixjeDCmEhUcmwXYfvurzAgGdtSMuHnUgyny'))).toBe(true);
                expect(reference).toBeUndefined();
                expect(label).toBe('Michael');
                expect(message).toBe('Thanks for all the fish');
                expect(memo).toBe('OrderId5678');
            });

            it('should parse without an amount', () => {
                const url =
                    'solana:GV11559jEBBXYnVAZkQvVxTb3X7tkWkeFoC5H7jTJs8F?reference=82ZJ7nbGpixjeDCmEhUcmwXYfvurzAgGdtSMuHnUgyny&label=Michael&message=Thanks%20for%20all%20the%20fish&memo=OrderId5678';

                const { recipient, amount, splToken, reference, label, message, memo } = parseURL(url);

                expect(recipient.equals(new PublicKey('GV11559jEBBXYnVAZkQvVxTb3X7tkWkeFoC5H7jTJs8F'))).toBe(true);
                expect(amount).toBeUndefined();
                expect(splToken).toBeUndefined();
                expect(reference).toHaveLength(1);
                expect(reference![0]!.equals(new PublicKey('82ZJ7nbGpixjeDCmEhUcmwXYfvurzAgGdtSMuHnUgyny'))).toBe(true);
                expect(label).toBe('Michael');
                expect(message).toBe('Thanks for all the fish');
                expect(memo).toBe('OrderId5678');
            });
        });
    });

    describe('errors', () => {
        it('throws an error on invalid length', () => {
            const url = 'X'.repeat(2049);
            expect(() => parseURL(url)).toThrow('length invalid');
        });

        it('throws an error on invalid protocol', () => {
            const url = 'eth:0xffff';
            expect(() => parseURL(url)).toThrow('protocol invalid');
        });

        it('throws an error on invalid recepient', () => {
            const url = 'solana:0xffff';
            expect(() => parseURL(url)).toThrow('recipient invalid');
        });

        it.each([['1milliondollars'], [-0.1], [-100]])('throws an error on invalid amount: %p', (amount) => {
            const url = `solana:GV11559jEBBXYnVAZkQvVxTb3X7tkWkeFoC5H7jTJs8F?amount=${amount}`;

            expect(() => parseURL(url)).toThrow('amount invalid');
        });

        it('throws an error on invalid token', () => {
            const url = 'solana:GV11559jEBBXYnVAZkQvVxTb3X7tkWkeFoC5H7jTJs8F?amount=1&spl-token=0xffff';

            expect(() => parseURL(url)).toThrow('token invalid');
        });

        it('throws an error on invalid reference', () => {
            const url = 'solana:GV11559jEBBXYnVAZkQvVxTb3X7tkWkeFoC5H7jTJs8F?amount=1&reference=0xffff';

            expect(() => parseURL(url)).toThrow('reference invalid');
        });
    });
});
