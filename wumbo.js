(function () {
    /* Extend string */
    String.prototype.replaceBetween = function (start, end, what) {
        return this.substring(0, start) + what + this.substring(end);
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
    };

    /* Better number parser */

    Wumbo.prototype.parseNum = function (a, r) {
        if (a.search('.') != -1) {
            return parseFloat(a);
        } else {
            return parseInt(a, r);
        }
    };

    /* Lexing */
    Wumbo.prototype.hasNumbers = function (t) {
        return /\d/.test(t);
    };

    /* Main parser */
    Wumbo.prototype.parse = function (expression) {
        if (expression.indexOf(this.OPERATORS.o_paren) !== -1) {
            while (expression.indexOf(this.OPERATORS.o_paren) !== -1) {
                var subsec;
                var subsecsim;
                console.log(expression);
                var startPoint = expression.indexOf(this.OPERATORS.o_paren);
                var endPoint;
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
                subsecsim = this.parse(subsec);
                expression = expression.replaceBetween(startPoint, endPoint + 1, subsecsim);
            }
            expression = this.parse(expression);
        } else {
            // Left to right parsing
            var i;

            // Exponents
            for (i = 0; i < expression.length; i++) {
                if (expression[i] === this.OPERATORS.exp) {
                    expression = this.simplify(expression, i);
                    i = 0;
                }
            }

            // Multiplication and division
            for (i = 0; i < expression.length; i++) {
                if (expression[i] === this.OPERATORS.mul || expression[i] === this.OPERATORS.div) {
                    expression = this.simplify(expression, i);
                    i = 0;
                }
            }

            // Addition and subtraction
            for (i = 0; i < expression.length; i++) {
                if (expression[i] === this.OPERATORS.add || expression[i] === this.OPERATORS.sub) {
                    expression = this.simplify(expression, i);
                    i = 0;
                }
            }
        }
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
        var k, j;
        var opsign = expression[i];
        var negat;

        // determine left operand index
        for (k = i - 1; k >= 0; k--) {
            if (this.isOp(expression[k])) {
                if (expression[k] === '-') {
                    negat = true;
                    k--;
                }
                break;
            }
        }
        var leftstart = k + 1;

        // determine right operand index
        for (j = i + 1; j < expression.length; j++) {
            if (this.isOp(expression[j])) {
                break;
            }
        }
        var rightstart = j - 1;
        console.log('left: ' + leftstart + ' right: ' + rightstart);

        // Do splicing, simplification, and replacement
        var op1 = expression.slice(leftstart, i).trim();
        var op2 = expression.slice(i + 1, rightstart + 1).trim();

        console.log("Left hand operand: " + op1);
        console.log("opertor middle: " + opsign);
        console.log("Right hand operand: " + op2);

        if (this.hasNumbers(op1) && this.hasNumbers(op2)) {
            if (opsign === this.OPERATORS.add) {
                var stuffing = this.add(op1, op2);
                expression = expression.replaceBetween(leftstart, rightstart + 1, stuffing);
                console.log("SIMPLIFICAITON: " + expression);
            }
            if (opsign === this.OPERATORS.sub) {
                var stuffing = this.sub(op1, op2);
                expression = expression.replaceBetween(leftstart, rightstart + 1, stuffing);
                console.log("SIMPLIFICAITON: " + expression);
            }
            if (opsign === this.OPERATORS.mul) {
                var stuffing = this.mul(op1, op2);
                expression = expression.replaceBetween(leftstart, rightstart + 1, stuffing);
                console.log("SIMPLIFICAITON: " + expression);
            }
            if (opsign === this.OPERATORS.div) {
                var stuffing = this.div(op1, op2);
                expression = expression.replaceBetween(leftstart, rightstart + 1, stuffing);
                console.log("SIMPLIFICAITON: " + expression);
            }
            if (opsign === this.OPERATORS.exp) {
                var stuffing = this.exp(op1, op2);
                expression = expression.replaceBetween(leftstart, rightstart + 1, stuffing);
                console.log("SIMPLIFICAITON: " + expression);
            }
        }
        return expression;
    }

})();

$('button').click(function () {
    var parser = new Wumbo();
    console.time("WumboStart");
    var output = parser.parse($('input').val());
    console.timeEnd("WumboStart");
    $('body').append(output);
});
