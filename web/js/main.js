(function () {

    var getJumpInterval = (function () {
        var multi = 25,
            time = 1;

        return function () {
            return time = (multi + time) % (8 * multi) + multi;
        };
    })();

    var setSphereJumping = function (sphere) {
        var jump = function () {
            sphere.position.y = sphere.position.y % 3 + 1;
            setTimeout(jump, getJumpInterval());
        };
        jump();
    };

    var createSphereMatrix = function (scene, size) {
        var materialSphere = new BABYLON.StandardMaterial('texture1', scene);
        materialSphere.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.3);

        for (var x = 0; x < 3; ++x) {
            for (var z = 0; z < 3; ++z) {
                // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
                var sphere = new BABYLON.Mesh.CreateSphere('sphere' + x + z, 16, 2, scene);

                sphere.material = materialSphere;

                // move the sphere upward 1/2 of its height
                sphere.position.y = 1;
                sphere.position.x = x * 6;
                sphere.position.z = z * 6;

                setSphereJumping(sphere);
            }
        }
    };

    var createLightSphere = function (scene) {
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        for (var i = -15; i < 30; i+= 15) {
            var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(i, 5, i), scene);
            light.diffuse = new BABYLON.Color3(1, 1, 1);
            light.specular = new BABYLON.Color3(1, 1, 1);
        }
    };

    window.addEventListener('DOMContentLoaded', function(){
        // get the canvas DOM element
        var canvas = document.getElementById('renderCanvas');

        // load the 3D engine
        var engine = new BABYLON.Engine(canvas, true);

        // createScene function that creates and return the scene
        var createScene = function() {
            // create a basic BJS Scene object
            var scene = new BABYLON.Scene(engine);

            // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
            var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 20,-10), scene);

            // target the camera to scene origin
            camera.setTarget(BABYLON.Vector3.Zero());

            // attach the camera to the canvas
            camera.attachControl(canvas, false);

            createLightSphere(scene);

            createSphereMatrix(scene, 3);

            // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
            var ground = new BABYLON.Mesh.CreateGround('ground1', 36, 36, 2, scene);

            // return the created scene
            return scene;
        }

        // call the createScene function
        var scene = createScene();

        // run the render loop
        engine.runRenderLoop(function(){
            scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', function(){
            engine.resize();
        });
    });
})();