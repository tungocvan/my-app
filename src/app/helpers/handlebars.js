const Handlebars = require('handlebars');

module.exports = {
    ifCond: function(v1, operator, v2, options){
        // {{#ifCond 2 "<" 3}} ... {{else}}....{{/ifCond}}
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    },
    sum : function(a,b) {
        return a +b ;
    },
    convertObj : function(obj){
        return JSON.stringify(obj)
    },
    strimHtml : function (strHtml) {
        return Handlebars.escapeExpression(strHtml);     
    },   
    strDate: function () {
        let date = new Date();
        let thang = date.getMonth()+1;    
        let ngay = date.getDate();
        if(ngay < 10) ngay = '0'+ngay.toString();
        if(thang < 10) thang = '0'+thang.toString();       
        return date.getFullYear()+'-'+ thang +'-'+ngay;
        //return '2020-02-11';

    } 
}

