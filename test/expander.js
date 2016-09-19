import { Rule, expand } from '../src/expander.js';
import { expect } from 'chai';

describe('pattern-expander', function () {
    describe('Rule', function () {
        context('General', function () {
            it('should throw error, when constructed incorrectly', function () {
                expect(() => new Rule('a', null, null, null)).to.throw(/Incorrect arguments provided to the Rule constructor/);
            });
        });

        context('Initialization with values list', function () {
            it('should construct correctly', function () {
                const rule = new Rule('a', [1, 2, 3]);

                expect(rule.variable).to.equal('a');
                expect(rule.values).to.eql(['1', '2', '3']);
                expect(rule.padChar).to.equal('0');
            });

            it('should construct correctly, when padChar provided', function () {
                const rule = new Rule('a', [1, 2, 3], 'x');

                expect(rule.variable).to.equal('a');
                expect(rule.values).to.eql(['1', '2', '3']);
                expect(rule.padChar).to.equal('x');
            });
        });

        context('Initialization with value range', function () {
            it('should construct correctly', function () {
                const rule = new Rule('a', 1, 4);

                expect(rule.variable).to.equal('a');
                expect(rule.values).to.eql(['1', '2', '3', '4']);
                expect(rule.padChar).to.equal('0');
            });

            it('should construct correctly, when padChar provided', function () {
                const rule = new Rule('a', 1, 4, 'x');

                expect(rule.variable).to.equal('a');
                expect(rule.values).to.eql(['1', '2', '3', '4']);
                expect(rule.padChar).to.equal('x');
            });
        });
    });

    describe('expand', function () {
        context('Without rules', function () {
            it('should expand correctly, when no rules specified', function () {
                const pattern = 'a-a';
                const result = expand(pattern, []);

                expect(result.length).to.equal(1);
                expect(result[0]).to.equal(pattern);
            });
        });


        context('With single rule', function () {
            it('should expand correctly with single-character values', function () {
                const rule = new Rule('a', 1, 2);
                const pattern = 'pref-a-a-a-suf';

                const result = expand(pattern, [rule]);

                expect(result.length).to.equal(2);
                expect(result[0]).to.equal('pref-1-1-1-suf');
                expect(result[1]).to.equal('pref-2-2-2-suf');
            });

            it('should expand correctly with single-character values and padding', function () {
                const rule = new Rule('a', 1, 2);
                const pattern = 'pref-aa-aaa-aaaa-suf';

                const result = expand(pattern, [rule]);

                expect(result.length).to.equal(2);
                expect(result[0]).to.equal('pref-01-001-0001-suf');
                expect(result[1]).to.equal('pref-02-002-0002-suf');
            });

            it('should expand correctly with multi-character values', function () {
                const rule = new Rule('a', ['one', 'two']);
                const pattern = 'pref-a-a-a-suf';

                const result = expand(pattern, [rule]);

                expect(result.length).to.equal(2);
                expect(result[0]).to.equal('pref-one-one-one-suf');
                expect(result[1]).to.equal('pref-two-two-two-suf');
            });

            it('should expand correctly with multi-character values and padding', function () {
                const rule = new Rule('a', ['one', 'two']);
                const pattern = 'pref-aa-aaa-aaaa-suf';

                const result = expand(pattern, [rule]);

                expect(result.length).to.equal(2);
                expect(result[0]).to.equal('pref-one-one-0one-suf');
                expect(result[1]).to.equal('pref-two-two-0two-suf');
            });

            it('should expand correctly with specified padding character', function () {
                const rule = new Rule('a', 1, 1, 'x');
                const pattern = 'pref-aa-aaa-aaaa-suf';

                const result = expand(pattern, [rule]);

                expect(result.length).to.equal(1);
                expect(result[0]).to.equal('pref-x1-xx1-xxx1-suf');
            });
        });

        context('With multiple rules', function () {
            it('should expand correctly with multiple rules', function () {
                const rules = [new Rule('a', 1, 2), new Rule('b', 3, 4)];
                const pattern = 'pref-a-b-a-b-suf';

                const result = expand(pattern, rules);

                expect(result.length).to.equal(4);
                expect(result[0]).to.equal('pref-1-3-1-3-suf');
                expect(result[1]).to.equal('pref-1-4-1-4-suf');
                expect(result[2]).to.equal('pref-2-3-2-3-suf');
                expect(result[3]).to.equal('pref-2-4-2-4-suf');
            });
        });
    });
});
