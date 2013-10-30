var fs = require('fs')
var data = require('./raw.json');
var _ = require('underscore');

_.each(data[0], function(year, i) {
    console.log(i)
    var current_year = {
        "type": "FeatureCollection",
        "features": []
    }
    _.each(year, function(val, j) {
        var artists = ""
        _.each(val.artists, function(art, k) {
            if (k == 0) {
                artists += "<a href='" + art.link + "'> " + art.name + "</a>"

            } else {
                artists += "<a href='" + art.link + "'> " + art.name + "</a>, "
            }
        })
        var coords = val.coordinates.split(',')
        console.log(coords)
        current_year.features.push({
            "type": "Feature",
            "properties": {
                "name": val.title.replace('&#8217;',"'"),
                "description": "Artist(s): " + artists + " <br> " + val.desc,
                "image": {
                    "url": val.img.slice(0, val.img.lastIndexOf('-')),
                    "credit": "Dustin Chambers"
                },
            },
            "geometry": {
                "type": "Point",
                "coordinates": [parseFloat(coords[1]), parseFloat(coords[0]), 0.0]
            }
        })
        console.log(val)
    })

    fs.writeFile("../../public/data/livingwalls_" + i + ".json", JSON.stringify(current_year), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
})