$(document).ready(function(){
    $('.heading h1').addClass('animated fadeInDown');
    $('.heading h2').addClass('animated fadeInUp');
    
    $('.seasonal-list').on('click', 'li', function(){

        var product_id = $(this).attr("id"); //grab id from 'li'
        
        LCBO.getProduct(product_id,function(product){
            
              //title and image
              //check if thumbnail exists, if not, replace with default image
              var product_image="<div class='product-img clearfix'><img src="+product.image_url+"></div>";

              if (product.image_url == null){
                  product_image="<div class='product-img clearfix'><img class='not-found' src=img/beer-not-found.png></div>";
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
                  "<h1>"+product.name+"</h1>"+
                  "<h2>"+product.volume_in_milliliters+" mL</h2>"+
                  product_image+
                  "<table class='info clearfix'>"+
                  "<tr><td>Price:</td><td> $"+(product.price_in_cents/100).toFixed(2)+"</td></tr>"+
                  "<tr><td>Category: </td><td>"+product.primary_category+" - "+product.secondary_category+"</td></tr>"+
                  "<tr><td>Style: </td><td>"+style+"</td></tr>"+
                  "<tr><td>Origin: </td><td>"+product.origin+"</td></tr>"+
                  "<tr><td>Producer: </td><td>"+product.producer_name+"</td></tr>"+
                  "<tr><td>Released: </td><td>"+released_on+"</td></tr>"+
                  "<tr><td>Suggestion: </td><td>"+serving_suggestion+"</td></tr></table>"+
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