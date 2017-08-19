/*** Load upon render ***/

$(document).ready(function(){
    
    var product_id; //will store the id of the active product the user clicked on
    
    var my_lcbo = new LCBO();
    
    //On load: display section seasonal products
    var query="&where_not=is_dead&order=released_on.desc";
    
    my_lcbo.BeausSeasonalProducts(query,function(products){

      $.each(products,function(i,product){ //'i' is mandatory! 

          //check if thumbnail exists, if not, replace with default image
          var product_img="<div class='product-img'><img class='thumb' src="+product.image_thumb_url+"></div>";
          if (product.image_thumb_url == null){
              product_img="<div class='product-img'><img class='not-found' src=img/beer-not-found.png></div>";
          }

          //fill in the information about this product
          $('.seasonal-list').append(
              "<li id="+product.id+">"
                +product_img+
              "<p class='product-name''>"+product.name+"</p>"+
              "<p class='volume'>"+product.volume_in_milliliters+" mL</p>"+
              "<p class='price'>$"+parseFloat(product.price_in_cents/100).toFixed(2)+"</p>"+
              "</li>"
          );
      });
    });

        
    $('.heading h1').addClass('animated fadeInDown');
    $('.heading h2').addClass('animated fadeInUp');
    
    
    //Generate Product Details
    $('.seasonal-list').on('click', 'li', function(){

        product_id = $(this).attr("id"); //grab id from 'li'
        
        my_lcbo.getProduct(product_id,function(product){
            
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
                  find_stores="<a class='find-stores btn btn-full' href=#product-details>Find stores</a>";
              }else{
                  inventory_count="<img src=img/cross.gif>Out of stock";
                  find_stores="<a class='btn btn-faded' href=#product-details>Find stores</a>";
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
    

    
    //Find stores: if clicked, find stores
    $('#product-details').on('click', '.find-stores', function(){
        
        $('#product-details').find('a').html("Searching...");
        var current_product = new Product(product_id);
        
        current_product.findStores();
  
    });
    
    
    //Generate store map
    $('#stores-data-container').on('click', 'li > *', function(event){
        
        var longitude= $(this).siblings("input[name=longitude]").val();
        var latitude=$(this).siblings("input[name=latitude]").val();
        
        generateStoreMap(longitude,latitude);
  
    });
    

});

/** Pagination **/

function paginateStores(stores){ //triggered after async call "getStore" is complete

    $('#product-details').find('a').html("Find stores"); //change button text back
    
    //pagination
    $('#stores-pagination-container').pagination({
        dataSource: stores,
        callback: function(stores_list, pagination) {
            var html = display_stores(stores_list);
            $('#stores-data-container').html(html);
        }
    });

    //smooth scroll to stores
    $('html, body').animate({
        scrollTop: $("#stores-list").offset().top
    }, 1000);
}

function display_stores(stores){
    var html="<ul>";
    for(var i=0; i<stores.length; i++){
        html+="<li>"+
                "<img class='store' src=img/store.jpg>"+
                "<p class='store-name'><span>"+stores[i].name+"</span></p>"+
                "<p>"+stores[i].city+"</p>"+
                "<p>"+stores[i].address_line_1+"</p>"+
                "<p>"+stores[i].postal_code+"</p>"+
                "<p>"+stores[i].telephone+"</p>"+
                "<input type='hidden' name='longitude' value="+stores[i].longitude+">"+
                "<input type='hidden' name='latitude' value="+stores[i].latitude+">"+
              "</li>";
    }
    
    html+="</ul>";
    
    generateStoreMap(stores[0].longitude,stores[0].latitude);
    
    return html;
 }

/** GMaps **/
 
function generateStoreMap(longitude, latitude){

    var map=new GMaps({
        div: '#map',
        lat: latitude,
        lng: longitude, //shift it so marker shows 
        zoom: 14 /* initial: 15, lower = more zoomed out */
    });

    map.addMarker({
      lat: latitude,
      lng: longitude,
      title: 'Store Location'
    });
}