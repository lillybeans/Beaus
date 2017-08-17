var LCBO = new function() {
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
              } else {
                alert('There was an error [' + data.status + ']: ' + data.message);
              }
            }
          });
        }
      };
      $(function() {
        var product_id = 18;
        LCBO.getProduct(product_id, function(product) {
            
          $('.product_title').text(product.name);
            
          $.each(product, function(key, value) {
            if (key == 'name') return true;
            $('#product_details').append(
              "<br>" + key   +":"+ value +"<Br>"
            );
          });
            
        });
      });