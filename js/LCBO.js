var LCBO = new function() {
    
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
    
        function get(url, callback) {
          $.ajax({
            url: 'http://lcboapi.com' + url,
            dataType: 'jsonp',
            success: function(data) {
              if (200 == data.status) {
                callback(data.result);
                  console.log(data.result);
              } else {
                alert('There was an error [' + data.status + ']: ' + data.message);
              }
            }
          });
        }
      };

      $(function() {
        
        //On load: display all seasonal products
        var query="&where_not=is_dead&order=released_on.desc";
        
          LCBO.BeausSeasonalProducts(query,function(products){
              
              $.each(products,function(i,product){
                  
                  //check if thumbnail exists, if not, replace with default image
                  var product_img="<div class='product-img'><img class='thumb' src="+product.image_thumb_url+"></div>";
                  if (product.image_thumb_url == null){
                      product_img="<div class='product-img'><img class='not-found' src=img/beer-not-found.png></div>";
                  }
                  
                  //fill in the information about this product
                  $('.seasonal-list').append(
                      "<li id="+product.id+">"
                        +"<p class='product-name''>"+product.name+"</p>"+
                        "<br>"+
                        product_img+
                      "<p class='volume'>"+product.volume_in_milliliters+" mL</p>"+
                      "<p class='price'>$"+parseFloat(product.price_in_cents/100).toFixed(2)+"</p>"+
                      "</li>"
                  );
		      });
              
          });
          
      });