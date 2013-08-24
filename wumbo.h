#ifndef WUMBO_H
#define WUMBO_H

/* OPERATOR STRUCT */

typedef struct operators {
    
    char add = '+';
    char sub = '-';
    char mul = '*';
    char div = '/';
    char exp = '^';
    char o_paren = '(';
    char c_paren = ')';
    
} OPERATORS;

/* MAIN RECURSIVE FUNCTION */

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
                subsec = subsec.replace("(",""); // strip away parenthesis
                subsec = subsec.replace(")","");
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

char* wum_add(char* a, char* b) {
    
    return (parseInt(a, 10) + parseInt(b, 10)).toString();
    
}

char* wum_sub(char* a, char* b) {
    
    return (parseInt(a, 10) - parseInt(b, 10)).toString();
    
}

char* wum_mul(char* a, char* b) {
    
    return (parseInt(a, 10) * parseInt(b, 10)).toString();
    
}

char* wum_div(char* a, char* b) {
    
    return (parseInt(a, 10) / parseInt(b, 10)).toString();
    
}

char* wum_exp(char* a, char* b) {
 
    return (Math.pow(parseInt(a, 10), parseInt(b, 10))).toString();

}

/* LOGICAL FUNCTIONS */

bool isOp(char k){
    if (k == OPERATORS.add
        || k == OPERATORS.sub
        || k == OPERATORS.mul
        || k == OPERATORS.div
        || k == OPERATORS.exp
        || k == OPERATORS.o_paren
        || k == OPERATORS.c_paren) {
        return true;
    } else {
        return false;
    }
}

/* Mainipulation functions */
char* simplify(char* expression, int i) {
    int k, j;
    char opsign = expression[i];

    // determine left operand index
    for (k = i - 1; k >= 0; k--) {
        if (this.isOp(expression[k])) {
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
    console.log("Right hand operand: " + op2);

    if (opsign == this.OPERATORS.add) {
        var stuffing = this.add(op1, op2);
        expression = expression.replaceBetween(leftstart, rightstart + 1, stuffing);
        console.log("SIMPLIFICAITON: " + expression);
    }
    if (opsign == OPERATORS.sub) {
        var stuffing = this.sub(op1, op2);
        expression = expression.replaceBetween(leftstart, rightstart + 1, stuffing);
        console.log("SIMPLIFICAITON: " + expression);
    }
    if (opsign == OPERATORS.mul) {
        var stuffing = this.mul(op1, op2);
        expression = expression.replaceBetween(leftstart, rightstart + 1, stuffing);
        console.log("SIMPLIFICAITON: " + expression);
    }
    if (opsign == OPERATORS.div) {
        var stuffing = this.div(op1, op2);
        expression = expression.replaceBetween(leftstart, rightstart + 1, stuffing);
        console.log("SIMPLIFICAITON: " + expression);
    }
    if (opsign == OPERATORS.exp) {
        var stuffing = this.exp(op1, op2);
        expression = expression.replaceBetween(leftstart, rightstart + 1, stuffing);
        console.log("SIMPLIFICAITON: " + expression);
    }

    return expression;
}

#endif /* WUMBO_H */
