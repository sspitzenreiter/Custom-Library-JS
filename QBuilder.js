class QBuilder { 
    constructor(){
      this.query = {}
    }
    select=(selector)=>{
      if(typeof this.query.select!=='undefined'){
        this.query.select+=",";
      }else{
        this.query.select="select ";
      }
      if(typeof selector === 'array'){
        this.query['select'] += selector.join(",");
      }else{
        this.query['select'] += selector;
      }
      return this;
    }
    from=(table)=>{
      this.query['from'] = "from "+table;
      return this;
    }
    where=(param, typer)=>{
      let caller = (params, type) =>{
        if(typeof this.query['where'] === 'undefined'){
          this.query['where'] = "where ";
        }else{
          this.query['where']+=" and ";
        }
        if(typeof type !== 'undefined'){
          switch(type){
            case "where":
              this.query['where'] += params.key+" = '"+params.value+"'";
            break;
            case "where_in":
              this.query['where'] += params.key+" in ("+params.value.map(x=>x).join(",")+")";
            break;
            case "where_not_in":
              this.query['where'] += params.key+" not in ("+params.value.map(x=>x).join(",")+")";
            break;
            case "where_like":
              this.query['where'] += params.key+" like '%"+params.value+"%'";
            break;
          }
        }else{
          if(typeof params === 'object'){
            this.query['where'] += params.key+" = '"+params.value+"'";
          }else{
            this.query['where'] += params;
          }
        }
      }
      if(Array.isArray(param)){
        param.map(x=>{
          caller(x.param, x.type);
        });
      }else{
        caller(param, typer);
      }
      return this;
    }
  
    join=(tabler, params, typer)=>{
      const funct_table = (table, param, type) =>{
        if(typeof this.query.join === 'undefined'){
          this.query.join = "";
        }else{
          this.query.join += " ";
        }
        if(typeof type !== 'undefined'){
          switch(type){
            case "inner":
              this.query.join+="INNER JOIN "+table+" ON "+param;
            break;
            case "outer":
              this.query.join+="OUTER JOIN "+table+" ON "+param;
            break;
            case "left":
              this.query.join+="LEFT JOIN "+table+" ON "+param;
            break;
            case "right":
              this.query.join+="RIGHT JOIN "+table+" ON "+param;
            break;
            case "full":
              this.query.join+="FULL JOIN "+table+" ON "+param;
            break;
          }
        }else{
          this.query.join+="INNER JOIN "+table+" ON "+param;
        }
      }
      if(Array.isArray(tabler)){
        tabler.map(x=>{
          funct_table(x.table, x.param, x.type);
        })
      }else if(typeof tabler === 'object'){
        funct_table(tabler.table, tabler.param, tabler.type);
      }else{
        funct_table(tabler, params, typer);
      }
      
      return this;
    }
  
    order_by=(param, type)=>{
      if(typeof this.query.order_by === 'undefined'){
        this.query.order_by = "";
      }
  
      if(typeof type !== 'undefined'){
        const order_type = ['asc', 'desc'];
        if(order_type.includes(type)){
          this.query.order_by="order by "+param+" "+type;
        }
      }else{
        this.query.order_by="order by "+param;
      }
    }

    limit=(limit, offset)=>{
      if(typeof offset !== 'undefined'){
        this.query.limit="limit "+limit+" offset "+offset;
      }else{
        this.query.limit="limit "+limit;
      }
    }
  
    get=(table)=>{
      if(typeof table === 'undefined'){
        
        if(this.query['from']==''){
          return this.query['select']+" from "+table;
        }else{
          const order_type = ['select', 'from', 'join', 'where', 'order_by', 'limit'];
          let list_query = [];
          order_type.map(x=>{
            if(typeof this.query[x] !== 'undefined'){
              list_query.push(this.query[x]);
            }
          });
          return list_query.join(" ");
        }
      }else{
        return "select * from "+table;
      }
    }


    //Insert
    insert=(param, table)=>{
        if(typeof table === 'undefined'){
           throw "Table must be defined"; 
        }
        if(typeof param === 'object'){
            this.query.insert = "insert into "+table+" ("+Object.keys(param).join(",")+") values ("+Object.keys(param).map(x=>"'"+param[x]+"'").join(",")+")";
        }
        return this.query.insert;
    }

    //Update
    update=(param, table, value)=>{
        if(typeof param === 'object'){
            this.query.update = "update "+param.table+" set "+param.value.map(x=>
                x.key+" = '"+x.val+"'"
            );
            
        }else{
            this.query.update = "update "+table+" set "+value.map(x=>x.key+" = '"+x.val+"'");
        }
        if(typeof this.query.where !== 'undefined'){
            this.query.update+=" "+this.query.where;
        }
        return this.query.update;
    }
  }
  module.exports = QBuilder;
