var _ = require('underscore');
var request = require('request');
var xml2js = require('xml2js');


var str = 'atlpm0006   atlpm0023   atlpm0031f  atlpm0081c  atlpm0092  atlpm0126  atlpm0228 atlpm0009b  atlpm0025a  atlpm0031g  atlpm0081d  atlpm0093  atlpm0133  atlpm0229 atlpm0009c  atlpm0025b  atlpm0031h  atlpm0081e  atlpm0094  atlpm0165  atlpm0230 atlpm0009d  atlpm0025c  atlpm0031i  atlpm0081f  atlpm0095  atlpm0167  atlpm0231a atlpm0009e  atlpm0025d  atlpm0043a  atlpm0081g  atlpm0096  atlpm0168  atlpm0231b atlpm0009f  atlpm0025e  atlpm0043b  atlpm0081h  atlpm0097  atlpm0181  atlpm0241 atlpm0009g  atlpm0025f  atlpm0043c  atlpm0081i  atlpm0098  atlpm0182  atlpm0244 atlpm0009h  atlpm0026a  atlpm0043d  atlpm0081j  atlpm0099  atlpm0186  atlpm0249 atlpm0009i  atlpm0026b  atlpm0043e  atlpm0081k  atlpm0101  atlpm0187  atlpm0264 atlpm0011b  atlpm0026c  atlpm0043f  atlpm0081l  atlpm0103  atlpm0190  atlpm0273 atlpm0011c  atlpm0026d  atlpm0043g  atlpm0081m  atlpm0109  atlpm0197  atlpm0279 atlpm0011d  atlpm0026e  atlpm0043h  atlpm0081n  atlpm0114  atlpm0198  atlpm0288 atlpm0011e  atlpm0026f  atlpm0057   atlpm0081o  atlpm0115  atlpm0206  atlpm0289 atlpm0011f  atlpm0031b  atlpm0069   atlpm0084   atlpm0117  atlpm0207  atlpm0294 atlpm0011g  atlpm0031c  atlpm0070   atlpm0085   atlpm0118  atlpm0213  atlpm0389 atlpm0011h  atlpm0031d  atlpm0071   atlpm0089   atlpm0119  atlpm0214  atlpm0393 atlpm0011i  atlpm0031e  atlpm0081b  atlpm0091   atlpm0121  atlpm0215'

var strArray = str.split(' ')
var goodArray = []
_.each(strArray, function(val, i) {
	if (val.trim() == '') {} else {
		goodArray.push(val)
	}
})
var testArray = ['atlpm0006']//,'atlpm0023','atlpm0031f']

var parser = new xml2js.Parser({mergeAttrs:true});
//console.log(goodArray)

_.each(testArray, function(val, i){
	request({
	url: 'http://static.library.gsu.edu/ATLmaps/tiles/'+ val + '/tilemapresource.xml'
}, function(error, response, body) {
	//console.log('error: ' + error)
	//console.log(response.body)
	parser.parseString(response.body, function(err, result){
		var data = JSON.stringify(result)
		var dataj = JSON.parse(data)
		//console.log(dataj)
		 console.log(dataj.TileMap.BoundingBox[0])
		 // console.log(dataj.TileMap.TileSets[0].TileSet)
		  var zoomlevels = [];
		 _.each(dataj.TileMap.TileSets[0].TileSet, function(z,i){
		 	//console.log(z.href)
		 	zoomlevels.push(z.href)
		 })
		 //console.log(zoomlevels)
	})
})
})

