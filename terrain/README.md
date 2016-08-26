## terrain example

To get started load
* http://basemap.at/downloads/mobac-basemapOfflineDrucken-Anleitung.pdf
** Install mobac and export png atlas of region to "png + world file"

* http://www.oe3d.at/download/
** Download DEM data

* QGis
** Load png atlas as raster into QGis
** Load DEM as raster into QGis
** Do a Raster->Projections->Warp on the DEM raster so that it is the same CRS
** Do Raster->Extractoin->Clipper and extract area with DEM to tif and PNG Raster to jpg

* Do a gdal_translate -scale 0 2470 0 65535 -ot UInt16 -outsize 20 20 -of ENVI schneeberg_dem.tif schneeberg_dem.bin
** Set in component the segment size to outsize -1 !!!


