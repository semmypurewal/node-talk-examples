(function($){

    var canvas = null;
    var ctx = null;

    var width;  // width of canvas
    var height; // height of canvas
    var ct;     // coordinate tranformer

    var colors = [
		  // from http://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors:
		  'rgb(239, 222, 205)', // Almond              #EFDECD     
		  'rgb(205, 149, 117)', // Antique Brass       #CD9575     
		  'rgb(253, 217, 181)', // Apricot             #FDD9B5     
		  'rgb(120, 219, 226)', // Aquamarine          #78DBE2     
		  'rgb(135, 169, 107)', // Asparagus           #87A96B     
		  'rgb(255, 164, 116)', // Atomic Tangerine    #FFA474     
		  'rgb(250, 231, 181)', // Banana Mania        #FAE7B5     
		  'rgb(159, 129, 112)', // Beaver              #9F8170     
		  'rgb(253, 124, 110)', // Bittersweet         #FD7C6E     
		  'rgb(172, 229, 238)', // Blizzard Blue       #ACE5EE     
		  'rgb( 31, 117, 254)', // Blue                #1F75FE     
		  'rgb(162, 162, 208)', // Blue Bell           #A2A2D0     
		  'rgb(102, 153, 204)', // Blue Gray           #6699CC     
		  'rgb( 13, 152, 186)', // Blue Green          #0D98BA     
		  'rgb(115, 102, 189)', // Blue Violet         #7366BD     
		  'rgb(222,  93, 131)', // Blush               #DE5D83     
		  'rgb(203,  65,  84)', // Brick Red           #CB4154     
		  'rgb(180, 103,  77)', // Brown               #B4674D     
		  'rgb(255, 127,  73)', // Burnt Orange        #FF7F49     
		  'rgb(234, 126,  93)', // Burnt Sienna        #EA7E5D     
		  'rgb(176, 183, 198)', // Cadet Blue          #B0B7C6     
		  'rgb(255, 255, 153)', // Canary              #FFFF99     
		  'rgb( 28, 211, 162)', // Caribbean Green     #1CD3A2     
		  'rgb(255, 170, 204)', // Carnation Pink      #FFAACC     
		  'rgb(221,  68, 146)', // Cerise              #DD4492     
		  'rgb( 29, 172, 214)', // Cerulean            #1DACD6     
		  'rgb(188,  93,  88)', // Chestnut            #BC5D58     
		  'rgb(221, 148, 117)', // Copper              #DD9475     
		  'rgb(154, 206, 235)', // Cornflower          #9ACEEB     
		  'rgb(255, 188, 217)', // Cotton Candy        #FFBCD9     
		  'rgb(253, 219, 109)', // Dandelion           #FDDB6D     
		  'rgb( 43, 108, 196)', // Denim               #2B6CC4     
		  'rgb(239, 205, 184)', // Desert Sand         #EFCDB8     
		  'rgb(110,  81,  96)', // Eggplant            #6E5160     
		  'rgb(206, 255,  29)', // Electric Lime       #CEFF1D     
		  'rgb(113, 188, 120)', // Fern                #71BC78     
		  'rgb(109, 174, 129)', // Forest Green        #6DAE81     
		  'rgb(195, 100, 197)', // Fuchsia             #C364C5     
		  'rgb(204, 102, 102)', // Fuzzy Wuzzy         #CC6666     
		  'rgb(231, 198, 151)', // Gold                #E7C697     
		  'rgb(252, 217, 117)', // Goldenrod           #FCD975     
		  'rgb(168, 228, 160)', // Granny Smith Apple  #A8E4A0     
		  'rgb(149, 145, 140)', // Gray                #95918C     
		  'rgb( 28, 172, 120)', // Green               #1CAC78     
		  'rgb( 17, 100, 180)', // Green Blue          #1164B4     
		  'rgb(240, 232, 145)', // Green Yellow        #F0E891     
		  'rgb(255,  29, 206)', // Hot Magenta         #FF1DCE     
		  'rgb(178, 236,  93)', // Inchworm            #B2EC5D     
		  'rgb( 93, 118, 203)', // Indigo              #5D76CB     
		  'rgb(202,  55, 103)', // Jazzberry Jam       #CA3767     
		  'rgb( 59, 176, 143)', // Jungle Green        #3BB08F     
		  'rgb(254, 254,  34)', // Laser Lemon         #FEFE22     
		  'rgb(252, 180, 213)', // Lavender            #FCB4D5     
		  'rgb(255, 244,  79)', // Lemon Yellow        #FFF44F     
		  'rgb(255, 189, 136)', // Macaroni and Cheese #FFBD88     
		  'rgb(246, 100, 175)', // Magenta             #F664AF     
		  'rgb(170, 240, 209)', // Magic Mint          #AAF0D1     
		  'rgb(205,  74,  76)', // Mahogany            #CD4A4C     
		  'rgb(237, 209, 156)', // Maize               #EDD19C     
		  'rgb(151, 154, 170)', // Manatee             #979AAA     
		  'rgb(255, 130,  67)', // Mango Tango         #FF8243     
		  'rgb(200,  56,  90)', // Maroon              #C8385A     
		  'rgb(239, 152, 170)', // Mauvelous           #EF98AA     
		  'rgb(253, 188, 180)', // Melon               #FDBCB4     
		  'rgb( 26,  72, 118)', // Midnight Blue       #1A4876     
		  'rgb( 48, 186, 143)', // Mountain Meadow     #30BA8F     
		  'rgb(197,  75, 140)', // Mulberry            #C54B8C     
		  'rgb( 25, 116, 210)'  // Navy Blue           #1974D2     
		  ];



    // This function returns an object that has two methods for interpolating between
    // the intervals [a,b] and [A,B].  The 'forward' method maps [a,b] to [A,B], and
    // the 'reverse' method maps [A,B] to [a,b].  In other words, if
     //    I = interpolator_1d(a,b,A,B)
    // then
    //    I.forward(a) will return A
    //    I.forward(b) will return B
    //    I.reverse(A) will return a
    //    I.reverse(B) will return b
    var Interpolator1D = function(a,b, A,B) {
	var obj = {};
	var f = (B - A) / (b - a);
	obj.forward = function(x) {
	    return (x - a) * f + A;
	}
	obj.reverse = function(X) {
	    return (X - A) / f + a;
	}
	obj.forward_scale = function(len) {
	    return len * f;
	}
	obj.reverse_scale = function(len) {
	    return len / f;
	}
	return obj;
    }

    // return an object representing a point in R2
    var Point = function(x,y) {
	return { 'x' : x, 'y' : y };
    }

    var pointToString = function(p) {
	return '(' + p.x + ',' + p.y + ')';
    };


    // This function returns an object containing two methods for interpolating
    // between two rectangles:
    //   * rectangle 'r'a, having corners represented by Points p1 and p2
    //   * rectangle 'R', having corners represented by Points P1 and P2
    // The 'forward' method takes rectangle 'r' to 'R', and the 'reverse' method
    // goes in the other direction.  In other words, if
    //   I = Interpolator2D(p1,p2, P1,P2)
    // where p1,p2,P1,P2 are all Points, then:
    //   I.forward(p1) = P1
    //   I.forward(p2) = P2
    //   I.reverse(P1) = p1
    //   I.reverse(P2) = p2
    var Interpolator2D = function(p1,p2, P1,P2) {
	var obj = {};
	var x_interpolator = Interpolator1D(p1.x,p2.x,P1.x,P2.x);
	var y_interpolator = Interpolator1D(p1.y,p2.y,P1.y,P2.y);
	obj.forward = function(p) {
	    return Point(x_interpolator.forward(p.x), y_interpolator.forward(p.y));
	}
	obj.reverse = function(P) {
	    return Point(x_interpolator.reverse(P.x), y_interpolator.reverse(P.y));
	}
	obj.forward_x_scale = function(d) {
	    return x_interpolator.forward_scale(d);
	}
	obj.forward_y_scale = function(d) {
	    return y_interpolator.forward_scale(d);
	}
	obj.reverse_x_scale = function(d) {
	    return x_interpolator.reverse_scale(d);
	}
	obj.reverse_y_scale = function(d) {
	    return y_interpolator.reverse_scale(d);
	}
	return obj;
    }

    // This function returns an object that can be used to transform between two
    // different 2d coordinate systems.  It's really just an Interpolator2D, but
    // with aliases for the methods to make it easier to
    // keep the transformation directions straight.
    // Arguments:
    //    user1,user2: Points defining the bounding rectangle of the 'user' coord sys
    //    pixel1,pixel2: Points defining the bounding rectangle of the 'pixel' coord sys
    // Returns:
    //    An Interpolator2D object with the following methods:
    //      user_to_pixel(p): converts point p in user coords to pixel coords
    //      pixel_to_user(P): converts point P in pixel coords to user coords
    var CoordinateTransformer2D =  function(user1,user2, pixel1,pixel2) {
	var t = Interpolator2D(user1,user2, pixel1,pixel2);
	t.user_to_pixel = t.forward;
	t.pixel_to_user = t.reverse;
	t.user_to_pixel_scale_x = t.forward_x_scale;
	t.user_to_pixel_scale_y = t.forward_y_scale;
	t.pixel_to_user_scale_x = t.reverse_x_scale;
	t.pixel_to_user_scale_y = t.reverse_y_scale;
	return t;
    }

    //
    // Constructor for our Pie object; prefixed with 'this.' so that it gets exposed in the global scope:
    //
    this.Pie = function(canvas) {
	obj = {};

	obj.canvas = canvas;
	obj.ctx = canvas.getContext("2d");
	
	obj.canvas_width = canvas.width;
	obj.canvas_height = canvas.height;
	
	obj.ct = CoordinateTransformer2D(Point(-2,2),Point(2,-2),   Point(0,0),Point(obj.canvas_width,obj.canvas_height));

	obj.center = Point(0,0);
	obj.radius = 1.2;
	obj.pixel_center = obj.ct.user_to_pixel(obj.center);
	obj.pixel_radius = obj.ct.user_to_pixel_scale_x(obj.radius);

	obj.border_width = 1.0;

	//
	// draw a single slice of the pie, from angle0 to angle1, in the given color:
	//
	obj.drawSlice = function(angle0, angle1, color) {
	    this.ctx.fillStyle = color;
	    this.ctx.beginPath();

	    if (obj.border_width) {
		this.ctx.strokeStyle = 'rgb(0,0,0)';
		this.ctx.lineWidth = obj.border_width;
	    }
	    this.ctx.moveTo(this.pixel_center.x, this.pixel_center.y);
	    this.ctx.lineTo(this.pixel_center.x + this.pixel_radius * Math.cos(-angle0),
			    this.pixel_center.y + this.pixel_radius * Math.sin(-angle0));
	    this.ctx.arc(this.pixel_center.x, this.pixel_center.y, this.pixel_radius,
			 -angle0, -angle1, true);
	    this.ctx.lineTo(this.pixel_center.x, this.pixel_center.y);
	    if (obj.border_width) {
		this.ctx.stroke();
	    }
	    this.ctx.fill();
	}
	
	// Draw all the slices, one per word. Slices is an array of objects with keys 'word' and 'count'.
	// For example:
	//   slices = [
        //             { 'word' : 'cool',    'count' : 12 },
        //             { 'word' : 'awesome', 'count' : 22 },
        //             { 'word' : 'rockin',  'count' : 48 },
        //             { 'word' : 'theboss', 'count' : 13 },
        //             { 'word' : 'swell',   'count' : 12 },
        //             { 'word' : 'groovy',  'count' : 92 }
        //             ];
	obj.drawSlices = function(slices) {
	    obj.canvas.width = obj.canvas.width; // this clears the canvas
	    var total_count = 0;
	    for (var i=0; i<slices.length; ++i) {
		total_count = total_count + slices[i].count;
	    }
	    var last_angle = 0;
	    var color_index = 0;
	    var mid_angles = [ ];
	    for (var i=0; i<slices.length; ++i) {
		var angle = last_angle + 2 * slices[i].count * Math.PI / total_count;
		if (slices[i].color) {
		    color = slices[i].color;
		} else {
		    color = colors[color_index];
		    color_index = color_index + 1;
		}
		this.drawSlice(last_angle, angle, color);
		mid_angles.push(-(last_angle + angle) / 2);
		last_angle = angle;
	    }

	    var word_height = 20;
	    this.ctx.fillStyle  = 'rgb(0,0,0)';
	    this.ctx.font = '' + word_height + 'px _sans';
	    this.ctx.textBaseline = "center";
	    for (var i=0; i<slices.length; ++i) {
		var mid_angle = mid_angles[i];
		var wordlen = this.ctx.measureText(slices[i].word).width;
		var cos = Math.cos(mid_angle);
		var sin = Math.sin(mid_angle);
		var baseX = this.pixel_center.x + 1.1 * this.pixel_radius * cos;
		var baseY = this.pixel_center.y + 1.1 * this.pixel_radius * sin;
		if (cos < 0) {
		    baseX = baseX + wordlen * cos;
		}
		if (sin > 0) {
		    baseY = baseY + word_height/2 * sin;
		}
		this.ctx.fillText (slices[i].word, baseX, baseY);
	    }

	}

	return obj;
    }

})(jQuery);
