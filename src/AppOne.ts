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
        this.debug(true);
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
        { width: 8, height: 8 },
        scene
    );

    //Create dynamic texture
    const textureResolution = 800;

    const textureGround = new BABYLON.DynamicTexture(
        "dynamic texture",
        textureResolution,
        scene
    );
    // textureGround.vOffset = 0.25;

    const textureContext = textureGround.getContext();

    const materialGround = new BABYLON.StandardMaterial("Mat", scene);
    // materialGround.diffuseTexture = textureGround;
    materialGround.alpha = 0.5;
    materialGround.diffuseColor = BABYLON.Color3.Blue();
    materialGround.emissiveTexture = textureGround;
    //materialGround.opacityTexture = textureGround;
    ground.material = materialGround;

    const audioMotion = new AudioMotionAnalyzer(
        document.getElementById("container") as HTMLElement,
        {
            source: document.getElementById("audio") as HTMLMediaElement,
            // outlineBars: true,
            //   lineWidth: 0.5,
            showFPS: true,
            radial: false,
            //alphaBars: true,
            useCanvas: true,
            //ledBars: true,
            overlay: true,
            gradient: "classic",
            bgAlpha: 0.5,
            showBgColor: true,
            fillAlpha: 0.5,
            showPeaks: true,
            showScaleX: false,
        }
    );
    console.log(audioMotion);

    audioMotion.width = 800;
    audioMotion.height = 800;

    audioMotion.mode = 3;

    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);

    box.position.y = -2;

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
