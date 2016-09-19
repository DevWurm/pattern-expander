# pattern-expander
[![Build Status](https://travis-ci.org/DevWurm/pattern-expander.svg?branch=master)](https://travis-ci.org/DevWurm/pattern-expander)
[![Coverage Status](https://coveralls.io/repos/github/DevWurm/pattern-expander/badge.svg?branch=master)](https://coveralls.io/github/DevWurm/pattern-expander?branch=master)
[![Gitter](https://badges.gitter.im/DevWurm/pattern-expander.svg)](https://gitter.im/DevWurm/pattern-expander?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

A JavaScript library to expand a pattern with permutations of specified values.

`pattern-expander` expands a pattern by applying a set of rules to it.<br>
An example:<br>
The pattern `pattern-a-b` and the rules
```yaml
Pattern 1:
  variable: a
  values:
    - 1
    - 2
  
Pattern2:
  variable: b
  values:
    - 3
    - 4
```
would expand to the following results:
```
pattern-1-3
pattern-1-4
pattern-2-3
pattern-2-4
```
It's great for generating date lists, file lists, etc.

## Installation
To use `pattern-exoander` in your project, just install it via `npm`:
```shell
npm install -S pattern-expander
```

## Usage
To expand a pattern import the `expand` function and the `Rule` constructor from the `pattern-expander` module:
```javascript
import {expand, Rule} from 'pattern-expander';
```
After this, [set up a list of rules](#create-rules) and [expand your pattern string(s)](#expand-patterns).

### Create Rules
To create rules, create an Array, containing `Rule` objects.<br>
The `Rule` constructor can be used in two different ways:
* `Rule(variable, values, padChar)`:
    * `variable {String}`: the variable, which should be substituted
    * `values {[String]}`: the values, which should be used for expansion
    * `padChar {String} [Optional]`: The character used for padding, if the variable block occupies more characters than the value (Default: `'0'`)
* `Rule(variable, from, to, padChar)`:
    * `variable {String}`: the variable, which should be substituted
    * `from {Number}`: the beginning of the numeric range used for expansion
    * `to {Number}`: the end of the numeric range used for expansion
    * `padChar {String} [Optional]`: The character used for padding, if the variable block occupies more characters than the value (Default: `'0'`)    
    
**Example:**<br>
creating two rules, which expand the variable `a` with the values `"a"` and `"b"`, padded with `x`es and the variable `b` with the values `"1"` and `"2"` 
```javascript
const rules = [new Rule('a', ['a', 'b'], 'x'), new Rule('b', 1, 2)];
```

### Expand Patterns
If you have set up your rules, just pass your pattern string (which may contain your variable(s)) or even an array of pattern strings to the `expand` function with the signature `expand(pattern, rules)`. Consecutive occurrences of a variable are treated as a variable block and are just substituted once with the value and may be padded with the `padChar`, if the value is shorter than the variable block. If the value is longer than the variable block, it will be inserted completely.

**Example:**
```javascript
const pattern = 'aa-b';

const result = expand(pattern, rules);
/*
result:
[
    'xa-1',
    'xa-2',
    'xb-1',
    'xb-2'
]
 */
```

### Example
A practical example:<br>
You want to write a function, which prints out all the days of the year.
```javascript
import {expand, Rule} from 'pattern-expander';

function printYear(year) {
    const pattern = 'yyyy-mm-dd';
    
    // setup the needed rules
    const yearRule = new Rule('y', [String(year)]);
    const monthRule = month => new Rule('m', [String(month)]);
    const days28DaysRule = new Rule(`d`, 1, 28); 
    const days30DaysRule = new Rule(`d`, 1, 30); 
    const days31DaysRule = new Rule(`d`, 1, 31); 
    
    // generate an Array containing the numbers 1 -12 and map the 
    // expansion rules for the months onto it and expand them
    const months = Array.from(new Array(12), (val, key) => key + 1)
        .map(month => {
            let rules = [yearRule, monthRule(month)];
            
            // add the correct rule for the month
            if (month == 1) {
                rules.push(days28DaysRule);
            } else if ((month <= 7 && month % 2 == 0) || (month > 7 && month % 2 != 0)) {
                rules.push(days30DaysRule);
            } else {
                rules.push(days31DaysRule);
            }
            
            return rules
        })
        .map(rules => expand(pattern, rules));
        
    // flatten the month array
    const days = [].concat.apply([], months);
    
    // output the days
    days.forEach(day => console.log(day));
}
```
calling `printYear(2016)` would now generate the following ouput (excerpt):
```
2016-01-01
2016-01-02
2016-01-03
2016-01-04
2016-01-05
2016-01-06
2016-01-07
2016-01-08
2016-01-09
2016-01-10
2016-01-11
2016-01-12
2016-01-13
2016-01-14
2016-01-15
2016-01-16
2016-01-17
2016-01-18
...
2016-12-10
2016-12-11
2016-12-12
2016-12-13
2016-12-14
2016-12-15
2016-12-16
2016-12-17
2016-12-18
2016-12-19
2016-12-20
2016-12-21
2016-12-22
2016-12-23
2016-12-24
2016-12-25
2016-12-26
2016-12-27
2016-12-28
2016-12-29
2016-12-30
2016-12-31
```

##License
`pattern-expander` is offered under MIT License (Read LICENSE). Use it! :)<br>
Copyright 2016 DevWurm

##Collaborating
I really appreciate any kind of collaboration!<br>
You can use the [GitHub issue tracker](https://github.com/DevWurm/pattern-expander/issues) for bugs and feature requests or [create a pull request](https://github.com/DevWurm/pattern-expander/pulls) to submit
changes. Forks are welcome, too!
If you don't want to use these possibilities, you can also write me an email to
<a href='mailto:devwurm@devwurm.net'>devwurm@devwurm.net</a>.

## Contact
If you have any questions, ideas, etc. feel free to contact me:<br>
DevWurm<br>
Email: <a href='mailto:devwurm@devwurm.net'>devwurm@devwurm.net</a><br>
Jabber: devwurm@jabber.ccc.de<br>
Twitter: @DevWurm<br>
