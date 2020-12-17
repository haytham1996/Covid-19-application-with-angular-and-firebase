export class News {
    date : Date ; 
    description : string ; 
    country : string 

    constructor(date: Date,
        description: string,
        country: string){
            this.date = date;
            this.description = description;
            this.country = country;
        }

}