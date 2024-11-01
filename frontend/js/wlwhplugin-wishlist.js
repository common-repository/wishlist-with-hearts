window.$ = window.jQuery = $ = jQuery  ;

class WishList {
	constructor(){
			if(performance.navigation.type == 2){
	//				alert("about to be reloaded ");
					location.reload(true);
			}

			this.wishBox = $(".wish-box");
			this.trashBox = $(".trashwishitem");
			this.singleWishBox = $(".single-addtowishList") ;

			this.leftPlace;
			this.topPlace;
			this.place;

			this.leftCorrection =0;
			this.rightCorrection=0;
			this.jsonorrest = '/?rest_route=';
			this.di;

			this.shortcode = $("#shortinput");

			this.spinner = $(".spinner-loader");

      this.events();
	}



		show_toast(currentWishBox){
			//console.log("show_toast called")
			let wishAdded = currentWishBox.next(".added-wish");
			let cwbOffest = currentWishBox.offset();
			let cwbTop = cwbOffest.top;
			let cwbLeft = cwbOffest.left;
			cwbTop +=4;

			if(this.place == '1' || this.place == '3'){
					cwbLeft += 50;
			} else if(this.place == '2' || this.place == '4'){
					cwbLeft -= 180;
			}
			$(wishAdded[0]).removeClass("hidden");
			$(wishAdded[0]).offset({left: cwbLeft ,top: cwbTop});
			currentWishBox.removeClass("wish-box_hover");

			window.onscroll = function (e){
					$(wishAdded[0]).addClass("hidden");
			}

			setTimeout( function(){
						wishAdded.addClass("hidden");
						currentWishBox.addClass("wish-box_hover");
					},
					3000);

		}

		show_toastbutton(currentbtn){
					//console.log(currentbtn);
					var cwbOffest = currentbtn.offset();
					var cwbTop = cwbOffest.top;
					var cwbLeft = cwbOffest.left;
					cwbTop += 10;
					cwbLeft += 150;
					$(wishAddedbtn).removeClass("hidden");
					$(wishAddedbtn).offset({left: cwbLeft ,top: cwbTop});

					window.onscroll = function (e){
							$(wishAddedbtn).addClass("hidden");
					}

					setTimeout( function(){
								wishAddedbtn.addClass("hidden");

							},
							3000);
		}



			show_toast_inwishlist(currentbtn){
							let wishAddedbtn = currentbtn.next(".inwishlistbtn");
							var cbOffset = currentbtn.offset();
							var cbTop = cbOffset.top;
							var cbLeft = cbOffset.left;

							cbTop += 10;
							cbLeft += 150;
							$(wishAddedbtn).removeClass("hidden");
							$(wishAddedbtn).offset({left: cbLeft ,top: cbTop});

							window.onscroll = function (e){
									$(wishAddedbtn).addClass("hidden");
							}

							setTimeout( function(){
										$(wishAddedbtn).addClass("hidden");
									},
									3000);
				}

		place_wishboxes( ){
						let i=0;
						let allWishBoxes = document.getElementsByClassName("wish-box");
						if ( allWishBoxes.length < 0) return;
						this.place = $(allWishBoxes[0]).attr('data-place');
						let lc= document.getElementsByClassName("left_correction");
						if(lc.length > 0){
								this.leftCorrection = Number(lc[0].innerText);
						}

						let rc= document.getElementsByClassName("right_correction");
						if(rc.length > 0){
								this.rightCorrection = Number(rc[0].innerText);
						}

						for(i=0; i<allWishBoxes.length; i++){
							let short = $(allWishBoxes[i]).attr('data-short');
							let shorttrue="true";
							let shortcheck = shorttrue.localeCompare(short);
							if(shortcheck == 0) {
										$(allWishBoxes[i]).removeClass("hidden");
										continue; // skip the current iteration
									}
							let shorthidden="hidden";
							let hiddencheck = shorthidden.localeCompare(short);
							if( hiddencheck == 0) {
									continue;
							}
							var displayImage = $(allWishBoxes[i]).parent().find('img');
							console.log($(displayImage[0]).width())
							var ii=1;
							while($(displayImage[0]).width() < 101){
								displayImage = $(allWishBoxes[i]).parent().find('img').eq(ii);
								ii=ii+1;
							}
							if(displayImage.length < 0 ){
									$(allWishBoxes[i]).removeClass("hidden");
									console.log("Javascript placement fails");
							} else {
										$(displayImage[0]).one("load", function() {
													  if(this.complete){
																$(this).load();
														}
													});

								let dImgWidth = $(displayImage[0]).width();
								let dImgHeight = $(displayImage[0]).height();

								let posImg = $(displayImage[0]).offset();

								let leftPos = posImg.left + dImgWidth*0.1;
								let rightPos =   posImg.left + dImgWidth*0.85;
								let topPos = posImg.top +  dImgHeight*0.1;
								let bottomPos =posImg.top + dImgHeight*0.85;
								$(allWishBoxes[i]).removeClass("hidden");
								$(allWishBoxes[i]).removeClass("wish-box-topleft");
								this.leftPlace = leftPos;
								this.topPlace =topPos;
								if(this.place == '1'){
									this.leftPlace = leftPos;
									this.topPlace =topPos;
								} else if(this.place =='2'){
									this.leftPlace = rightPos;
									this.topPlace =topPos;
								}else if (this.place =='3'){
									this.leftPlace = leftPos;
									this.topPlace =bottomPos;
								}else if(this.place =='4'){
									this.leftPlace = rightPos;
									this.topPlace = bottomPos;
								}

								this.leftPlace+= this.leftCorrection;
								this.topPlace+= this.rightCorrection;

								$(allWishBoxes[i]).offset({left: this.leftPlace,top: this.topPlace});

							} // outer else ends

						} 	// for ends

			}



	//events
	events() {
    this.wishBox.on("click", this.ourClickDispatcher.bind(this));
    this.trashBox.on("click", this.ourTrashWish.bind(this));
    this.singleWishBox.on("click", this.singleProductAddWish.bind(this));
		$(window).load(this.place_wishboxes.bind(this));
		$(window).on("resize",this.place_wishboxes.bind(this));
  	}

	//functions

 	ourClickDispatcher(e) {

 		let currentWishBox = $(e.target).closest(".wish-box");
		e.preventDefault();
    	if (currentWishBox.attr('data-exists') == 'yes') {
      		this.deleteWish(currentWishBox);
    		} else {
      		this.createWish(currentWishBox);
    	}
 	}




 createWish(currentWishBox) {
 		console.log(" createWish ");
		let oldStatus = currentWishBox.attr('data-exists');
			currentWishBox.attr('data-exists', 'yes');
		if(currentWishBox.attr('data-isjson') == true) {
			this.jsonorrest = '/wp-json';
		} else {
			this.jsonorrest = '/?rest_route=';
		}
    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', wlwhData.nonce);
      },
		  url: wlwhData.root_url + this.jsonorrest + '/wlwh/v1/manageWish',
			type: 'POST',
      data: {'productId': currentWishBox.attr('data-product-id') },
      success: (response) => {
				console.log(response);
				currentWishBox.attr('data-exists', 'yes');
				this.show_toast(currentWishBox);
      },
      error: (response) => {
				currentWishBox.attr('data-exists', oldStatus);
        alert("Could not WishListed! Please try again")
        console.log(response);
      }
    });
  }


 deleteWish(currentWishBox) {
  		console.log(" deleteWish ");
			let oldStatus = currentWishBox.attr('data-exists');
			currentWishBox.attr('data-exists', 'no');
			if(currentWishBox.attr('data-isjson') == true) {
					this.jsonorrest = '/wp-json';
				} else {
					this.jsonorrest = '/?rest_route=';
			}
      $.ajax({
	      beforeSend: (xhr) => {
	        xhr.setRequestHeader('X-WP-Nonce', wlwhData.nonce);
	      },
				url: wlwhData.root_url + this.jsonorrest + '/wlwh/v1/manageWish',
				data: {'productId': currentWishBox.attr('data-product-id') },
	      type: 'DELETE',
	      success: (response) => {
						currentWishBox.attr('data-exists', 'no');
        },
	      error: (response) => {
						currentWishBox.attr('data-exists', oldStatus);
						console.log(response);
	      }
	    });

  	}


singleProductAddWish(e){
        var currentWishBox;
				var evtDet = $(e.target);
        var temp = evtDet.attr('data-singleproductid');
				let currentbtn = $(e.target).closest(".wish-button");
				let btnProductId = currentbtn.attr('data-singleproductid');
				let allWishBoxes = $(":root").find(".wish-box");
				if(allWishBoxes.length <= 0){
					alert("No heart found . Either select from settings or add heart via shortcode You may add a hidden heart if not needed ");
					return;
				}
				allWishBoxes.each( function(){
						if($(this).attr('data-product-id') == btnProductId){
									currentWishBox= $(this);
						}
				});
				if (currentWishBox == null){
						this.singleWishBox.remove();
						alert("No heart found . Either select from settings or add heart via shortcode You may add a hidden heart if not needed ");
						return;
				}
				if(currentWishBox.length <= 0 ){
						this.singleWishBox.remove();
						alert("No heart found . Either select from settings or add heart via shortcode You may add a hidden heart if not needed ");
						return;
				}

				let oldStatus = currentWishBox.attr('data-exists');
				let status = currentWishBox.attr('data-exists');
				if( currentWishBox.attr('data-logged') == 'yes'){
					currentWishBox.attr('data-exists', 'yes');
				}

				if(currentWishBox.attr('data-isjson') == true) {
					this.jsonorrest = '/wp-json';
				} else {
					this.jsonorrest = '/?rest_route=';
				}

			if(status == 'no') {
              $.ajax({
              beforeSend: (xhr) => {
                xhr.setRequestHeader('X-WP-Nonce', wlwhData.nonce);
              },
        		  url: wlwhData.root_url + this.jsonorrest + '/wlwh/v1/manageWish',
						  type: 'POST',
			              data: {'productId': temp },
			              success: (response) => {
											currentWishBox.attr('data-exists', 'yes');
											this.show_toast(currentWishBox);
											this.show_toastbutton(currentbtn);
			              },
			              error: (response) => {
											currentWishBox.attr('data-exists', oldStatus);
			                console.log(response);
			              }
			            });

        } else if (status == 'yes'){
							this.show_toast_inwishlist(currentbtn);
             console.log("already exists in wish list");
						 //show a modal as in added to wishlist
          } else {
              console.log("invalid entry");
          }
    }

	ourTrashWish(evt){
		var that =this;
    var evtDet = $(evt.target);
		var cords = evtDet.offset();
		var temp = $(evtDet).attr('data-trashitem');
		var temp2= $(evtDet).attr('data-trashjson');
		if(temp2 == true) {
					this.jsonorrest = '/wp-json';
				} else {
					this.jsonorrest = '/?rest_route=';
				}

      $.ajax({
        beforeSend: (xhr) => {
          xhr.setRequestHeader('X-WP-Nonce', wlwhData.nonce);
					this.spinner.removeClass("hidden");
					$(this.spinner).offset({ top: cords.top+25, left: cords.left+20 });
        },
		url: wlwhData.root_url + this.jsonorrest + '/wlwh/v1/manageWish',
        data: {'productId': temp },
        type: 'DELETE',
				complete: function(){that.spinner.addClass("hidden");},

        success: (response) => {
          //dynamically delete the list element whose id is temp
          $(`#${temp}`).remove();
          //console.log(response);
        },
        error: (response) => {
          console.log(response);
        }
      });

    }


}

var wl = new WishList();
