class QBuilder { 
  constructor(){
    this.query = {
      select:'',
      from:'',
    }
  }
  select=(selector)=>{
    if(this.query.select!=''){
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
  where=(params, type)=>{
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
          this.query['where'] += params.key+" in ("+params.value.map(x=>x).split(",")+")";
        break;
        case "where_not_in":
          this.query['where'] += params.key+" not in ("+params.value.map(x=>x).split(",")+")";
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
    return this;
  }

  join=(table, param, type)=>{
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
      }
    }else{
      this.query.join+="INNER JOIN "+table+" ON "+param;
    }
    return this;
  }

  get=(table)=>{
    if(typeof table === 'undefined'){
      
      if(this.query['from']==''){
        return this.query['select']+" from "+table;
      }else{
        const order_type = ['select', 'from', 'join', 'where'];
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
}