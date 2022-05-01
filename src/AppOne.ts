import * as BABYLON from "babylonjs";
import AudioMotionAnalyzer from "audiomotion-analyzer";
export class AppOne {
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas);
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        this.scene = createScene(this.engine, this.canvas);
    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.scene.debugLayer.show({ overlay: true });
        } else {
            this.scene.debugLayer.hide();
        }
    }

    run() {
        this.debug(false);
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}

const createScene = function (
    engine: BABYLON.Engine,
    canvas: HTMLCanvasElement
) {
    // this is the default code from the playground:

    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const camera = new BABYLON.FreeCamera(
        "camera1",
        new BABYLON.Vector3(0, 5, -10),
        scene
    );

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
    /*
    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere(
        "sphere",
        { diameter: 2, segments: 32 },
        scene
    );
*/
    // Move the sphere upward 1/2 its height
    // sphere.position.y = 1;

    // Our built-in 'ground' shape.
    const ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        { width: 8, height: 6 },
        scene
    );

    //Create dynamic texture
    const textureResolution = 1000;

    const textureGround = new BABYLON.DynamicTexture(
        "dynamic texture",
        textureResolution,
        scene
    );
    textureGround.vOffset = 0.25;

    const textureContext = textureGround.getContext();

    const materialGround = new BABYLON.StandardMaterial("Mat", scene);
    materialGround.diffuseTexture = textureGround;
    materialGround.emissiveTexture = textureGround;
    ground.material = materialGround;

    const audioMotion = new AudioMotionAnalyzer(
        document.getElementById("container") as HTMLElement,
        {
            source: document.getElementById("audio") as HTMLMediaElement,
            //  outlineBars: true,
            showFPS: true,
            //  radial: true,
            // alphaBars: true,
            useCanvas: true,
            ledBars: true,
            overlay: true,
            gradient: "prism",
            bgAlpha: 1,
            showBgColor: true,
        }
    );
    console.log(audioMotion);

    audioMotion.width = 800;
    audioMotion.height = 600;

    audioMotion.mode = 2;

    scene.onBeforeRenderObservable.add(function () {
        textureContext.drawImage(audioMotion.canvas, 0, 0);
        textureGround.update();
    });
    /*
    setInterval(() => {
        textureContext.drawImage(audioMotion.canvas, 0, 0);
        textureGround.update();
    }, 50);
*/
    return scene;
};
