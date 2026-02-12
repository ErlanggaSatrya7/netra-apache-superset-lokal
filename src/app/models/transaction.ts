export interface Transaction{
    id_retailer? : number;
    id_product? : number;
    id_method? : number;
    id_city? : number;
    invoice_date : string;
    price_per_unit : number;
    unit_sold : number;
    total_sales : number;
    operating_profit : number;
    operating_margin : number

}

export interface InputTransaction{
    retailer : string;
    product : string;
    method : string;
    city : string;
    invoice_date : string;
    price_per_unit : number;
    unit_sold : number;
    total_sales : number;
    operating_profit : number;
    operating_margin : number

}
