OpenStreetMap Contributors by Area
============

List of contributors who have participated in a given OSM area.

Ispired by: [OpenStreetMap Contributors](https://resultmaps.neis-one.org/oooc) *Copyright © [Pascal Neis](https://neis-one.org)*

Copyright 2014 [Stefano Cudini](https://opengeo.tech/stefano-cudini/)

**Demo:**  
[opengeo.tech/maps/osm-contributors-by-area](https://opengeo.tech/maps/osm-contributors-by-area/)

![Image](https://raw.githubusercontent.com/stefanocudini/osm-contributors-by-area/master/images/osm-contributors-by-area.png)

Build

*include libs:*
```
git submodule update --init --recursive
```

*update libs*
```
git submodule foreach git pull origin master
```

**compress files:**
```
npm install
grunt
```
