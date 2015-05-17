/*
  A Three.js 'Object3D' representing a cube where each inner face displays a 
  tile of a cubic panorama. The textures of the faces are render targets and can
  be rendered to at will.
  'tiles' is a dictionary of images representing the faces of the cube.
  Keys are: north, west, south, east, top, bottom. North is the yaw rotation 
  of 0 radians and rotation is counter-clockwise.
  Event: render
*/
demo.CubicPanorama = function CubicPanorama(renderer, size, tiles)
{
  var
    camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -0.5, 0.5),
    geometry = new THREE.PlaneBufferGeometry(1, 1),
    light = new THREE.AmbientLight(0xbbbbbb),
    scene = new THREE.Scene(),
    drawingBoard = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        map: new THREE.Texture()
      })
    ),

    faces = {},

    tileKeys = ['north', 'west', 'south', 'east', 'bottom', 'top'];


  THREE.Object3D.apply(this);

  this.renderTargets = {};
  
  // 'tiles' are a dictionary of textures.
  this.setTiles = function setTiles(tiles)
  {
    renderer.setViewport(0, 0, size, size);

    _.each(
      tiles, 
      function iteratee(texture, key)
      {
        drawingBoard.material.map = texture;

        renderer.render(scene, camera, this.renderTargets[key]);
      },
      this
    );

    this.dispatchEvent({type: 'render'});
  };


  // Set up container and textures for cubic projection panorama.
  _.each(
    tileKeys, 
    function iteratee(key)
    {
      var target = new THREE.WebGLRenderTarget(
            size, 
            size,
            {
              // Mipmaps aren't generated by perspective scaling.
              minFilter: THREE.LinearFilter
            }
          );

      this.renderTargets[key] = target;

      faces[key] = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({map: target})
      );

      this.add(faces[key]);
    },
    this
  );

  // Position cube faces.
  faces.north.position.z  = -0.5;

  faces.west.rotation.y   = Math.PI / 2;
  faces.west.position.x   = -0.5;

  faces.south.rotation.y  = Math.PI;
  faces.south.position.z  = 0.5;

  faces.east.rotation.y   = Math.PI * 3 / 2;
  faces.east.position.x   = 0.5;

  faces.bottom.rotation.x = Math.PI * 3 / 2;
  faces.bottom.position.y = -0.5;

  faces.top.rotation.x    = Math.PI / 2;
  faces.top.position.y    = 0.5;

  scene.add(light);
  scene.add(drawingBoard);

  if (tiles)
    this.setTiles(tiles);
};

demo.CubicPanorama.prototype = Object.create(THREE.Object3D.prototype);
demo.CubicPanorama.prototype.constructor = demo.CubicPanorama;
