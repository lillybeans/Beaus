$(document).ready(function(){
    $('.heading h1').addClass('animated fadeInDown');
    $('.heading h2').addClass('animated fadeInUp');
    
    $('.seasonal-list').on('click', 'li', function(){

        var product_id = $(this).attr("id"); //grab id from 'li'
        
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

              //fill in the information about this product
              $('#product-details').html(
                  "<div class='row'>"+
                    "<div class='col span-1-of-2 product-img'>"+product_image+"</div>"+
                    "<div class='col span-1-of-2'>"+
                      "<h1 class='product-name'>"+product.name+"</h1>"+
                      "<h2 class='volume divider'>"+product.volume_in_milliliters+" mL</h2>"+
                      "<table class='info'>"+
                          "<tr><td class='price'> $"+(product.price_in_cents/100).toFixed(2)+"</td></tr>"+
                          "<tr><td>Category </td><td>"+product.primary_category+" - "+product.secondary_category+"</td></tr>"+
                          "<tr><td>Style </td><td>"+style+"</td></tr>"+
                          "<tr><td>Origin </td><td>"+product.origin+"</td></tr>"+
                          "<tr><td>Producer </td><td>"+product.producer_name+"</td></tr>"+
                          "<tr><td>Released </td><td>"+released_on+"</td></tr>"+
                          "<tr class><td>Suggestion </td><td>"+serving_suggestion+"</td></tr>"+
                      "</table>"+
                    "<a class='btn btn-full' href='#'>Find stores</a>"+
                    "</div>"+
                  "</div>"

              );
              
              $.each(product,function(key,value){
                  
       
		      });
              
          });
        
        //smooth scroll
        $('html, body').animate({
            scrollTop: $("#product-details").offset().top
        }, 1000);
    });
    
});