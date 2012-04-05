function main() {
    // create a Pie object for our canvas, and draw the slices corresponding to our word list
    var pie = Pie(document.getElementById('pie'));

    var words = {};
    
    var socket = io.connect("localhost");
    socket.on("update", function(data) {
	$("#"+data.key).html(data.count);
	words[data.key] = data.count;
	pie.drawSlices(adapt(words));
    });

    $('#restart').click(function() {
	$.post('/restart');
	for(var key in words) {
	    words[key] = 0;
	    $("#"+data.key).html(0);
	}
	pie.drawSlices(adapt(words));
    });

}

function adapt(obj) {
    var key;
    var result = [];
    for(key in obj) {
	result.push({'word':key, 'count':obj[key]});
    }
    return result;
}


$(document).ready(function() {
    main();
});