(function () {
    /* Extend string */
    String.prototype.replaceBetween = function(start, end, what) {
        return this.substring(0, start) + what + this.substring(end);
    };
    
    /* Constructor */
    window.Porket = function Porket() {
        this.OPERATORS = {
            add: '+',
            sub: '-',
            mul: '*',
            div: '/',
            exp: '^',
            o_paren: '(',
            o_paren: ')'
        };
        this.PAREN_REGEX = /[^()]+(?=\))/;
    };
    
    /* Main parser */
    Porket.prototype.parse = function (expression) {
        if(expression.search(this.PAREN_REGEX) !== -1){
           expression = this.parse(expression.match(this.PAREN_REGEX)[0]);
        }else{
            // Left to right parsing
            var i;
            
            // Multiplication and division
            for(i = 0; i < expression.length; i++){
                if(expression[i] === this.OPERATORS.mul || expression[i] === this.OPERATORS.div){
                    expression = this.simplify(expression, i);
                    i = 0;
                }
            }
        }
        
        return expression;
    };
    
    /* OPERATOR FUNCTIONS */
    
    Porket.prototype.add = function(a,b){
        return (parseInt(a,10) + parseInt(b,10)).toString();
    };
    
    Porket.prototype.sub = function(a,b){
        return (parseInt(a,10) - parseInt(b,10)).toString();
    };
    
    Porket.prototype.mul = function(a,b){
        return (parseInt(a,10) * parseInt(b,10)).toString();
    };
    
    Porket.prototype.div = function(a,b){
        return (parseInt(a,10) / parseInt(b,10)).toString();
    };
    
    Porket.prototype.exp = function(a,b){
        return (Math.pow(parseInt(a,10), parseInt(b,10))).toString();
    };
    
    /* LOGICAL FUNCTIONS */
    
    Porket.prototype.isOp = function(k){
        if(k === '+' || k === '-' || k === '*' || k === '/' || k === '^'){
            return true;
        }else{
            return false;
        }
    };
    
    /* Mainipulation functions */
    Porket.prototype.simplify = function(expression, i){
        var k, j;
        var opsign = expression[i];
        
        // determine left operand index
        for(k = i - 1; k >= 0; k--){
            if(this.isOp(expression[k])){
                break;
            }
        }
        var leftstart = k + 1;
        
        // determine right operand index
        for(j = i + 1; j < expression.length; j++){
            if(this.isOp(expression[j])){
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
        
        if(opsign === this.OPERATORS.add){
            
        }
        if(opsign === this.OPERATORS.sub){
            
        }
        if(opsign === this.OPERATORS.mul){
            var stuffing = this.mul(op1,op2);
            expression = expression.replaceBetween(leftstart,rightstart + 1,stuffing);
            console.log("SIMPLIFICAITON: " + expression);
        }
        if(opsign === this.OPERATORS.div){
            
        }
        if(opsign === this.OPERATORS.exp){
            
        }
        
        return expression;
    }

})();