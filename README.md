# JS Bike Geometry

> [v0 explaination & demo blog post](https://ryanberliner.com/v0-js-bike-geometry) -- see `v0` and `v0-demo` branch

A javascript app that allows you to manipulate the geometry of mountain
bikes. Does so by letting the user select an image, specify key points on the image,
and when the geo is manipulated, the image will warp and move to match the geometry.

Geometry that can be changed:
 - [x] Head tube angle
 - [ ] chain stay length
 - [ ] bb height
 - [ ] Seat tube angle
 - [ ] effective top tube

To accomplish the the user needs to locate the following points on the image of the
bike:
 - front/rear axle
 - ground
 - bb
 - head tube
 - seat post clamp

From this we can build a base 'stick figure' of the bike. Adjustments of the geometry
will be made to this stick figure, and will acts a a distortion template for the image.

## Image distortion

All image distortion is done with 2 actions.
- Rotation
- Translation
