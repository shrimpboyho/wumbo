(function () {
    /* Extend string and array */
    String.prototype.replaceBetween = function (start, end, what) {
        return this.substring(0, start) + what + this.substring(end);
    };

    window.dynamicArray = function (n) {
        this.coreArray = [];
        if (n) this.coreArray = n;
    };

    dynamicArray.prototype.at = function (n) {
        return this.coreArray[n];
    };

    dynamicArray.prototype.setAt = function (n, s) {
        this.coreArray[n] = s;
    };

    dynamicArray.prototype.push = function (s) {
        this.coreArray.push(s);
    };

    dynamicArray.prototype.delete = function (n) {
        // smart shift delete!
        if (n != -1) {
            this.coreArray.splice(n, 1);
        }
    };

    /* Constructor */
    window.Wumbo = function Wumbo() {
        this.OPERATORS = {
            add: '+',
            sub: '-',
            mul: '*',
            div: '/',
            exp: '^',
            o_paren: '(',
            c_paren: ')'
        };
        this.tokens = new dynamicArray();
        this.tokenTypes = new dynamicArray();
    };

    /* Better number parser */

    Wumbo.prototype.parseNum = function (a, r) {
        if (a.search('.') != -1) {
            return parseFloat(a);
        } else {
            return parseInt(a, r);
        }
        return NaN;
    };

    /* Main parser */
    Wumbo.prototype.parse = function (expression) {
        while (expression.indexOf('(') !== -1) {
            console.log("EXPRESSION: " + expression);
            var subsec;
            var subsecsim;
            var startPoint = expression.indexOf('(');
            var endPoint;
            var i;
            for (i = startPoint + 1; i < expression.length; i++) {
                if (expression[i] === this.OPERATORS.o_paren) {
                    startPoint = i;
                }
                if (expression[i] === this.OPERATORS.c_paren) {
                    endPoint = i;
                    break;
                }
            }
            subsec = expression.slice(startPoint, endPoint + 1); // the sub expression with the parenthesis (2 + 3)
            subsec = subsec.replace("(", ""); // strip away parenthesis
            subsec = subsec.replace(")", "");
            subsecsim = this.parseNoParen(subsec);
            expression = expression.replaceBetween(startPoint, endPoint + 1, subsecsim);
        }
        expression = this.parseNoParen(expression);
        return expression;
    };
    Wumbo.prototype.parseNoParen = function (expression) {
        // Remove all whitespaces
        expression = expression.replace(/\s+/g, '');

        // Append +
        if (expression[0] !== '-' && expression[0] !== '+') expression = '+' + expression;

        // Preproccess input (sign shifts)
        var j;
        for (j = 0; j < expression.length; j++) {
            if (expression[j] === '+' && expression[j + 1] === '+') {
                expression = expression.replaceBetween(j, j + 2, '+');
                j--;
            }
            if (expression[j] === '-' && expression[j + 1] === '-') {
                expression = expression.replaceBetween(j, j + 2, '+');
                j--;
            }
            if (expression[j] === '+' && expression[j + 1] === '-') {
                expression = expression.replaceBetween(j, j + 2, '-');
                j--;
            }
            if (expression[j] === '-' && expression[j + 1] === '+') {
                expression = expression.replaceBetween(j, j + 2, '-');
                j--;
            }
        }

        // Single pass lexer    
        var i, k;
        for (i = 0; i < expression.length; i++) {

            // multiply sign
            if (expression[i] === '*') {
                this.tokens.push('*');
                this.tokenTypes.push('MUL');
                continue;
            }

            // divide sign
            if (expression[i] === '/') {
                this.tokens.push('/');
                this.tokenTypes.push('DIV');
                continue;
            }

            // exponent sign
            if (expression[i] === '^') {
                this.tokens.push('^');
                this.tokenTypes.push('EXP');
                continue;
            }

            // any explicitly signed number
            if (expression[i] === '+' || expression[i] === '-') {
                for (k = i + 1; k < expression.length; k++) {
                    if (expression[k] === '+' || expression[k] === '-' || expression[k] === '*' || expression[k] === '/' || expression[k] === '^') {
                        break;
                    }
                }
                this.tokens.push(expression.slice(i, k));
                this.tokenTypes.push('NUM');
                i = k - 1;
                continue;
            }

            // any generic positive number
            else {
                for (k = i + 1; k < expression.length; k++) {
                    if (expression[k] === '+' || expression[k] === '-' || expression[k] === '*' || expression[k] === '/' || expression[k] === '^') {
                        break;
                    }
                }
                this.tokens.push('+' + expression.slice(i, k));
                this.tokenTypes.push('NUM');
                i = k - 1;
                continue;
            }

        }

        // print tokens

        for (i = 0; i < this.tokens.coreArray.length; i++) {
            console.log('TOKENS: ' + this.tokens.at(i) + ' ' + this.tokenTypes.at(i));
        }

        /* begin traversing and simplifying the intermediate representation */

        // exponents 
        for (i = 0; i < this.tokens.coreArray.length; i++) {
            if (this.tokenTypes.at(i) === 'EXP' && this.tokenTypes.at(i + 1) === 'NUM' && this.tokenTypes.at(i - 1) === 'NUM') {
                this.tokens.setAt(i - 1, this.exp(this.tokens.at(i - 1), this.tokens.at(i + 1)));
                this.tokens.delete(i);
                this.tokens.delete(i);
                this.tokenTypes.setAt(i - 1, 'NUM');
                this.tokenTypes.delete(i);
                this.tokenTypes.delete(i);
                i = -1;
                continue;
            }
        }

        // multiplication and division
        for (i = 0; i < this.tokens.coreArray.length; i++) {
            if ((this.tokenTypes.at(i) === 'MUL' || this.tokenTypes.at(i) === 'DIV') && this.tokenTypes.at(i + 1) === 'NUM' && this.tokenTypes.at(i - 1) === 'NUM') {
                if (this.tokenTypes.at(i) === 'MUL') {
                    this.tokens.setAt(i - 1, this.mul(this.tokens.at(i - 1), this.tokens.at(i + 1)));
                    this.tokens.delete(i);
                    this.tokens.delete(i);
                    this.tokenTypes.setAt(i - 1, 'NUM');
                    this.tokenTypes.delete(i);
                    this.tokenTypes.delete(i);
                    i = -1;
                    continue;
                }
                if (this.tokenTypes.at(i) === 'DIV') {
                    this.tokens.setAt(i - 1, this.div(this.tokens.at(i - 1), this.tokens.at(i + 1)));
                    this.tokens.delete(i);
                    this.tokens.delete(i);
                    this.tokenTypes.setAt(i - 1, 'NUM');
                    this.tokenTypes.delete(i);
                    this.tokenTypes.delete(i);
                    i = -1;
                    continue;
                }
            }
        }

        // normal addition
        for (i = 0; i < this.tokens.coreArray.length; i++) {
            if (this.tokenTypes.at(i) === 'NUM' && this.tokenTypes.at(i + 1) === 'NUM') {
                this.tokens.setAt(i, this.add(this.tokens.at(i), this.tokens.at(i + 1)));
                this.tokens.delete(i + 1);
                this.tokenTypes.setAt(i, 'NUM');
                this.tokenTypes.delete(i + 1);
                i = -1;
                continue;
            }
        }
        // assemble IR back to string

        for (i = 0; i < this.tokens.coreArray.length; i++) {
            console.log('TOKENS NEW: ' + this.tokens.at(i) + ' ' + this.tokenTypes.at(i));
        }
        expression = this.tokens.coreArray.join("");

        // Clear tokens and token types
        this.tokens.coreArray = [];
        this.tokenTypes.coreArray = [];
        return expression;
    };

    /* OPERATOR FUNCTIONS */

    Wumbo.prototype.add = function (a, b) {
        return (this.parseNum(a, 10) + this.parseNum(b, 10)).toString();
    };

    Wumbo.prototype.sub = function (a, b) {
        return (this.parseNum(a, 10) - this.parseNum(b, 10)).toString();
    };

    Wumbo.prototype.mul = function (a, b) {
        return (this.parseNum(a, 10) * this.parseNum(b, 10)).toString();
    };

    Wumbo.prototype.div = function (a, b) {
        return (this.parseNum(a, 10) / this.parseNum(b, 10)).toString();
    };

    Wumbo.prototype.exp = function (a, b) {
        return (Math.pow(this.parseNum(a, 10), this.parseNum(b, 10))).toString();
    };

    /* LOGICAL FUNCTIONS */

    Wumbo.prototype.isOp = function (k) {
        if (k === this.OPERATORS.add || k === this.OPERATORS.sub || k === this.OPERATORS.mul || k === this.OPERATORS.div || k === this.OPERATORS.exp || k === this.OPERATORS.o_paren || k === this.OPERATORS.c_paren) {
            return true;
        } else {
            return false;
        }
    };

    /* Mainipulation functions */
    Wumbo.prototype.simplify = function (expression, i) {

    };

})();
