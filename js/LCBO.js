//LCBO API: General Get Function
function get(url, callback) {
  $.ajax({
    url: 'http://lcboapi.com' + url,
    dataType: 'jsonp',
    success: function(data) {
      if (200 == data.status) {
        callback(data.result);
          //console.log(data.result);
      } else {
        alert('There was an error [' + data.status + ']: ' + data.message);
      }
    }
  });
}



var LCBO = function() {
    
        this.BeausAllProducts=function(callback){
            get("/products?q=Beaus&per_page=50", callback);
        }
        
        this.BeausSeasonalProducts=function(query, callback){
            get("/products?q=Beaus&where=is_seasonal&per_page=50"+query, callback);
        }
                
        this.getProduct = function(id, callback) {
          get('/products/' + id, callback);
        };
    
        this.getStore = function(id, callback) {
          get('/stores/' + id, callback);
        };
    
      };

 

var Product=function(pID) {
    
        this.product_id = pID;
    
        function getStore(id, callback){
            get('/stores/' + id, callback);
        }

        this.findStores = function() {
            
            var stores=[];
            
            get('/inventories?product_id=' + this.product_id, function(inventories){
                
                //for each store that the product can be found at
                $.each(inventories,function(i,record){
                    
                    var store_count=inventories.length; //for checking if async call is complete

                    //fetch information of the store given store_id
                    getStore(record.store_id,function(store){
                        
                        stores.push(store); //array accumulation, must wait for async call or else array will be empty!
                        
                        //once async call has finished 
                        if(stores.length == store_count){
                            paginateStores(stores);
                        }

                    });
                });
        
            });
        };
    
        this.getStore = function(id, callback) {
          get('/stores/' + id, callback);
        };
    
};


