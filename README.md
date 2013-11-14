#ATLmaps

ATLmaps is an fullstack javascript open platform built for discovering, visualizing, and creating new relationships with geospatial data.

## Application Architecture

ATLmaps consists of two parts:

#### Backend
A RESTful API backend built on top of [node.JS](http://nodejs.org/) and [express](http://expressjs.com/) utilizing [MongoDB](mongodb.org) as a backend datastore.

#### Frontend
An [AngularJS](http://angularjs.org) application allowing users to create custom maps that "mash" up geospatial data layers in various collections.  [LeafletJS](http://leafletjs.com/) is used as the mapping API utilizing custom AngularJS directives to visualize datasources on a map.
