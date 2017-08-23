var lcbo = new LCBO(); //initialize global lcbo instance

var product_id; //id of current product in product details

/*** Load upon render ***/

$(document).ready(function(){
    
    createAnimations();
    showSeasonalProducts();
        
    //If user clicks a product in the Seasonal Products list, generate product details
    $('.seasonal-list').on('click', 'li', function(){
        showProductDetails($(this));
    });
    
    //If 'find stores' clicked, find stores for product
    $('#product-details').on('click', '.find-stores', function(){
        findStoresForProduct();
    });
    
    //If user wants to go back to seasonal beverages, redirect
    $('#product-details').on('click','.to-seasonal',function(){
        scrollTo("#seasonal-beverages",0);
    });
    
    //If a store is clicked, update store map
    $('#stores-data-container').on('click', 'li > *', function(event){
        
        //find longitude and latitude from hidden inputs
        var longitude= $(this).siblings("input[name=longitude]").val();
        var latitude=$(this).siblings("input[name=latitude]").val();
        
        generateStoreMap(longitude,latitude);
  
    });
    



});

/** Landing page heading animations **/
function createAnimations(){
    
    //heading animations
    $('header .heading h1').addClass('animated fadeInDown');
    $('header .heading h2').addClass('animated fadeInUp');
    
    $('#summer').waypoint(function(direction){
  
        $('#summer .heading').addClass('animated fadeIn');
        $('#summer .heading h1').addClass('animated fadeInDown');
        $('#summer .heading h2').addClass('animated fadeInUp');
        },{offset:'20%'
    });
    
    $('#seasonal-beverages').waypoint(function(direction){
        $('#seasonal-beverages').addClass('animated fadeIn');
        $('h1').addClass('animated fadeInDown');
        $('li').each(function(){
            $(this).addClass('animated fadeIn');
        });
    },{offset:'60%'
    });
    
}

/** Show list of Seasonal Products **/
function showSeasonalProducts(query){
    
    var query="&where_not=is_dead&order=released_on.desc";
    
    lcbo.BeausSeasonalProducts(query,function(products){

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
}

/** Show Details of Selected Product **/

function showProductDetails(list_item){
    
        $('#stores-list').hide(); //hide stores for previously clicked on products
        $('#product-details').show(); //expand to show section

        product_id = list_item.attr("id"); //update product id of active product
        
        lcbo.getProduct(product_id,function(product){
            
              //check for invalid fields and replace with default
              var product_image="<img src="+product.image_url+">";

              if (product.image_url == null){
                  product_image="<img class='not-found' src=img/beer-not-found.png>";
              }
            
              if(product.style==null){
                  product.style="Unknown";
              }

              if(product.released_on == null){
                  product.released_on="Unknown";
              }
              
              if(product.serving_suggestion==null){
                  product.serving_suggestion="Just another really tasty beer!";
              }
            
              var stock_status;
            
              var find_stores;
            
              if(product.inventory_count > 0){
                  stock_status="<img src=img/check.gif>In stock";
                  find_stores="<a class='find-stores btn btn-full' href=#product-details>Find stores</a>";
              }else{
                  stock_status="<img src=img/cross.gif>Out of stock";
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
                          "<td class='stock-status'>"+stock_status+"</td></tr>"+

                          "<tr><td>Category </td><td>"+product.primary_category+" - "+product.secondary_category+"</td></tr>"+
                          "<tr><td>Style </td><td>"+product.style+"</td></tr>"+
                          "<tr><td>Origin </td><td>"+product.origin+"</td></tr>"+
                          "<tr><td>Producer </td><td>"+product.producer_name+"</td></tr>"+
                          "<tr><td>Released </td><td>"+product.released_on+"</td></tr>"+
                          "<tr class><td>Suggestion </td><td>"+product.serving_suggestion+"</td></tr>"+
                      "</table>"+
                    find_stores+
                    "<a class='to-seasonal btn btn-ghost' href=#product-details>See Other Seasonal Beverages</a>"+
                    "</div>"+
                  "</div>"

              );
              
          });
        
        scrollTo("#product-details",0);
}

/** Find Stores Selling Selected Product **/

function findStoresForProduct(){
     $('#product-details').find('.find-stores').html("Searching...");
        var current_product = new Product(product_id);
        
        $('#stores-list').show(); //show section to display our results
        
        //get product name of currently showcased product
        var product_name=$('#product-details .product-name').html();
 
        $('#stores-list-heading').html(
            "<h1>Where to buy <span class='product-name'>"+product_name+"</span></h1>"
        );
        
        current_product.findStores();
}

/** Pagination **/

function paginateStores(stores){ //triggered after async call "getStore" is complete
    
    $('#product-details').find('.find-stores').html("Find stores"); //change button text back
    
    //pagination
    $('#stores-pagination-container').pagination({
        dataSource: stores,
        callback: function(stores_list, pagination) {
            var html = display_stores(stores_list);
            $('#stores-data-container').html(html);
        }
    });

    scrollTo('#stores-list',-20);
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

/** Smooth scroll **/
function scrollTo(id, offset){
    $('html, body').animate({
        scrollTop: $(id).offset().top-offset
    }, 1000);
}