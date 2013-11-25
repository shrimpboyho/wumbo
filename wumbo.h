#ifndef WUMBO_H
#define WUMBO_H

/* OPERATOR STRUCT */

typedef struct operators
{

    char add = '+';
    char sub = '-';
    char mul = '*';
    char div = '/';
    char exp = '^';
    char o_paren = '(';
    char c_paren = ')';

} OPERATORS;

/* OPERATOR FUNCTIONS */

char *wum_add(char *a, char *b)
{
    return stringToInt((parseInt(a, 10) + parseInt(b, 10)));
}
char *wum_sub(char *a, char *b)
{
    return stringToInt((parseInt(a, 10) - parseInt(b, 10)));
}
char *wum_mul(char *a, char *b)
{
    return stringToInt((parseInt(a, 10) * parseInt(b, 10)));
}
char *wum_div(char *a, char *b)
{
    return stringToInt((parseInt(a, 10) / parseInt(b, 10)));
}
char *wum_exp(char *a, char *b)
{
    return stringToInt((Math.pow(parseInt(a, 10), parseInt(b, 10))).toString());
}

/* LOGICAL FUNCTIONS */

bool isOp(char k)
{
    if (k == OPERATORS.add
            || k == OPERATORS.sub
            || k == OPERATORS.mul
            || k == OPERATORS.div
            || k == OPERATORS.exp
            || k == OPERATORS.o_paren
            || k == OPERATORS.c_paren)
    {
        return true;
    }
    else
    {
        return false;
    }
}

#endif /* WUMBO_H */
