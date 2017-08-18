$(document).ready(function(){
    $('.heading h1').addClass('animated fadeInDown');
    $('.heading h2').addClass('animated fadeInUp');
    
    var product_id;
    
    //Seasonal Beverages -  if clicked, go to product details
    $('.seasonal-list').on('click', 'li', function(){

        product_id = $(this).attr("id"); //grab id from 'li'
        
        LCBO.getProduct(product_id,function(product){
            
              //title and image
              //check if thumbnail exists, if not, replace with default image
              var product_image="<img src="+product.image_url+">";

              if (product.image_url == null){
                  product_image="<img class='not-found' src=img/beer-not-found.png>";
              }
            
              var style=product.style;
              if(product.style==null){
                  style="Unknown";
              }
            
              var released_on = product.released_on;
              if(product.released_on == null){
                  released_on="Unknown";
              }
              
              var serving_suggestion = product.serving_suggestion;
              if(product.serving_suggestion==null){
                  serving_suggestion="Just another really tasty beer!";
              }
            
              var inventory_count;
              var find_stores;
              if(product.inventory_count > 0){
                  inventory_count="<img src=img/check.gif>In stock";
                  find_stores="<a class='find-stores btn btn-full' href='#'>Find stores</a>";
              }else{
                  inventory_count="<img src=img/cross.gif>Out of stock";
                  find_stores="<a class='btn btn-faded' href='#'>Find stores</a>";
              }
            

              //fill in the information about this product
              $('#product-details').html(
                  "<div class='row'>"+
                    "<div class='col span-1-of-2 product-img'>"+product_image+"</div>"+
                    "<div class='col span-1-of-2'>"+
                      "<h1 class='product-name'>"+product.name+"</h1>"+
                      "<h2 class='volume divider'>"+product.volume_in_milliliters+" mL</h2>"+
                      "<table class='info'>"+

                          "<tr><td class='price'> $"+(product.price_in_cents/100).toFixed(2)+"</td>"+
                          "<td class='stock-status'>"+inventory_count+"</td></tr>"+

                          "<tr><td>Category </td><td>"+product.primary_category+" - "+product.secondary_category+"</td></tr>"+
                          "<tr><td>Style </td><td>"+style+"</td></tr>"+
                          "<tr><td>Origin </td><td>"+product.origin+"</td></tr>"+
                          "<tr><td>Producer </td><td>"+product.producer_name+"</td></tr>"+
                          "<tr><td>Released </td><td>"+released_on+"</td></tr>"+
                          "<tr class><td>Suggestion </td><td>"+serving_suggestion+"</td></tr>"+
                      "</table>"+
                    find_stores+
                    "</div>"+
                  "</div>"

              );
              
          });
        
        //smooth scroll
        $('html, body').animate({
            scrollTop: $("#product-details").offset().top
        }, 1000);
    });
    
     function display_stores(inv_records){
        var html="";
        for(var i=0; i<inv_records.length; i++){
            html+="<br>"+inv_records[i].name;
            }
            return html;
     }
    
    //Find stores: if clicked, find stores
    $('#product-details').on('click', '.find-stores', function(){

        Product.findStores(product_id,function(inventories){
            
            //for each store that the product can be found at
            $.each(inventories,function(i,record){
                
                //fetch information of the store given store_id
                Product.getStore(record.store_id,function(store){
                    
                    console.log("store id is: "+store.id);
                    $(this).stores.push(store);
                    
                });
            });
            
            alert("stores has length "+this.stores.length);
            
            //pagination
            $('#stores-pagination-container').pagination({
                dataSource: stores,
                callback: function(stores_list, pagination) {
                    var html = display_stores(stores_list);
                    $('#stores-data-container').html(html);
                }
            });
            
            console.log(inventories.length);
            $.each(inventories,function(i,record){ //'i' is mandatory

                 console.log(record.product_id+","+record.store_id);
            });
        });
        
        //smooth scroll to stores
        $('html, body').animate({
            scrollTop: $("#stores-list").offset().top
        }, 1000);
    });
    
});